/*
 * Pixel Ping 后端启动脚本
 *
 * 此脚本负责自动启动Pixel Ping项目的数据库容器和后端服务，
 * 提供一站式的开发环境初始化功能，包括：
 * 1. 启动MySQL数据库容器
 * 2. 安装项目依赖
 * 3. 生成API路由和类型
 * 4. 编译TypeScript代码
 * 5. 生成Prisma客户端
 * 6. 启动后端服务器
 *
 * 使用方法：在server目录下运行 `node start-db-and-backend.js`
 */

// 导入必要的Node.js模块
const {exec, spawn} = require('child_process')
const {promisify} = require('util')

// 将exec方法转换为Promise形式，便于异步操作
const execAsync = promisify(exec)

/**
 * ServerStarter类
 *
 * 负责Pixel Ping项目后端服务的完整启动流程管理，
 * 包括数据库初始化和后端服务器启动。
 */
class ServerStarter {
    /**
     * 构造函数
     *
     * 初始化ServerStarter实例，设置开发进程引用为null
     */
    constructor() {
        // 存储后端开发服务进程的引用
        this.devProcess = null
    }

    /**
     * 执行命令行命令
     *
     * @param {string} command - 要执行的命令行命令
     * @param {Object} options - 命令执行选项
     * @returns {Promise<boolean>} - 命令是否执行成功
     */
    async runCommand(command, options = {}) {
        try {
            console.log(`▶️  执行: ${command}`)
            const {stdout, stderr} = await execAsync(command, options)
            if (stdout) console.log(stdout)
            if (stderr) console.error(stderr)
            return true
        } catch (error) {
            console.error(`❌ 执行失败: ${command}`, error.message)
            return false
        }
    }

    /**
     * 启动数据库容器
     *
     * 停止旧容器，启动新容器，等待初始化，测试连接，并检查用户数据
     */
    async startDatabase() {
        console.log('🐳 启动数据库容器...')
        // 先停止并移除旧容器，确保使用新的初始化脚本
        await this.runCommand('docker-compose down -v')
        const success = await this.runCommand('docker-compose up -d')
        if (!success) {
            console.log('⚠️  数据库启动可能有问题，继续尝试...')
        }

        // 等待数据库初始化
        console.log('⏳ 等待数据库初始化...')
        await new Promise(resolve => setTimeout(resolve, 15000))

        // 测试连接
        console.log('🔗 测试数据库连接...')
        const connected = await this.runCommand('docker exec pixelping-mysql mysql -u pixeluser -ppixelpassword -e "SELECT 1;"', {stdio: 'pipe'})

        if (connected) {
            console.log('✅ 数据库连接成功')
            // 检查用户数据是否已初始化
            console.log('📊 检查用户数据初始化状态...')
            await this.runCommand(
                'docker exec pixelping-mysql mysql -u pixeluser -ppixelpassword -e "USE pixelping; SELECT COUNT(*) AS user_count FROM users; SELECT * FROM users;"',
                {stdio: 'inherit'}
            )
        } else {
            console.log('⚠️  数据库连接测试失败，继续启动后端...')
        }
    }

    /**
     * 安装项目依赖
     *
     * 使用pnpm安装所有必要的项目依赖
     */
    async installDependencies() {
        console.log('📦 安装项目依赖...')
        await this.runCommand('pnpm install')
    }

    /**
     * 修复Prisma权限问题
     *
     * 清理并重新安装Prisma客户端，以解决可能的权限问题
     */
    async fixPrismaPermissions() {
        console.log('🔧 尝试修复Prisma权限问题...')
        // 先尝试清理Prisma客户端相关文件
        await this.runCommand('rm -rf node_modules/.pnpm/@prisma+client*')
        // 重新安装依赖
        console.log('📦 重新安装依赖...')
        await this.runCommand('pnpm install')
    }

    /**
     * 启动后端服务（带重试机制）
     *
     * 执行多个步骤来启动后端服务，如果失败则尝试修复并重新启动
     */
    async startBackendWithRetry() {
        console.log('🎯 启动后端服务...')

        try {
            // 第一步：生成路由和类型
            console.log('📝 生成API路由和类型...')
            const tsoaSuccess = await this.runCommand('pnpm tsoa spec-and-routes')
            if (!tsoaSuccess) throw new Error('TSOA生成失败')

            // 第二步：编译TypeScript
            console.log('🔨 编译TypeScript...')
            const tscSuccess = await this.runCommand('pnpm tsc')
            if (!tscSuccess) throw new Error('TypeScript编译失败')

            // 第三步：尝试Prisma生成（使用不同方式避免权限问题）
            console.log('🧪 生成Prisma客户端...')
            try {
                // 尝试使用--skip-generate标志跳过部分生成步骤
                await this.runCommand('pnpm prisma generate --skip-generate')
            } catch (e) {
                console.log('⚠️  Prisma生成失败，尝试备选方案...')
                // 备选方案：直接运行服务器，依赖已存在的Prisma客户端
            }

            // 第四步：启动服务器
            console.log('🚀 启动服务器...')
            this.devProcess = spawn('node', ['./build/src/server.js'], {
                stdio: 'inherit',
                shell: true
            })

            // 监听进程错误
            this.devProcess.on('error', error => {
                console.error('❌ 后端服务启动失败:', error.message)
                console.log('💡 提示：请尝试以管理员身份运行此脚本')
                process.exit(1)
            })

            // 监听进程退出
            this.devProcess.on('exit', code => {
                if (code !== 0) {
                    console.log(`\n❌ 服务退出，退出码: ${code}`)
                    console.log('💡 提示：如果是Prisma权限错误，请尝试以管理员身份运行PowerShell')
                }
            })
        } catch (error) {
            console.error('❌ 后端启动过程出错:', error.message)
            // 尝试修复权限并重新启动
            await this.fixPrismaPermissions()
            console.log('🔄 重新尝试启动后端...')
            this.startBackend()
        }
    }

    /**
     * 启动后端服务的入口方法
     *
     * 设置信号处理器并调用实际的启动方法
     */
    startBackend() {
        // 设置信号处理器，确保优雅退出
        process.on('SIGINT', () => this.cleanup())
        process.on('SIGTERM', () => this.cleanup())

        // 直接调用改进的启动方法
        this.startBackendWithRetry()
    }

    /**
     * 清理资源
     *
     * 停止正在运行的后端进程并退出应用
     */
    cleanup() {
        console.log('\n🧹 清理资源...')
        if (this.devProcess) {
            this.devProcess.kill('SIGINT')
        }
        process.exit(0)
    }

    /**
     * 启动整个服务流程
     *
     * 按顺序启动数据库和后端服务，并处理可能的错误
     */
    async start() {
        console.log('🚀 === Pixel Ping 启动脚本 ===')

        try {
            await this.startDatabase()
            await this.installDependencies()
            this.startBackend()
        } catch (error) {
            console.error('💥 启动过程出错:', error.message)
            this.cleanup()
        }
    }
}

// 当脚本作为主程序运行时执行
if (require.main === module) {
    const starter = new ServerStarter()
    starter.start()
}

// 导出ServerStarter类，供其他模块使用
module.exports = ServerStarter
