/**
 * 创建时间: 2025-03-12
 * 作者: jjq
 * 描述: USER 服务层
 */

import {PrismaClient} from '@prisma/client'
import {R} from '../../utils/R'
import {UserDto} from './dtos/user.dto'

// 初始化Prisma客户端
let prisma: PrismaClient
try {
    prisma = new PrismaClient()
} catch (error) {
    console.log('Prisma初始化失败，将使用模拟数据模式')
    // 创建一个模拟的prisma对象以避免运行时错误
    prisma = {} as PrismaClient
}

export class UserServices {
    // 查询指定的用户名、密码是否存在
    public async isUserExist(user: UserDto): Promise<any> {
        try {
            const users = await prisma.users.findMany({
                where: {
                    USERNAME: user.username
                    // PASSWORD: user.password
                }
            })
            // console.log('指定用户名和密码的用户', users)
            if (users.length === 0) {
                return false // 用户不存在
            } else {
                return true // 用户存在
            }
        } catch (error) {
            console.log(error)
        }
    }

    // 创建一个用户
    public async createUser(user: UserDto): Promise<any> {
        try {
            await prisma.users.create({
                data: {
                    USERNAME: user.username,
                    PASSWORD: user.password
                }
            })
            return R.ok('用户创建成功！') // 创建成功
        } catch (error) {
            return R.error('用户创建过程发生异常：' + error) // 创建失败
        }
    }

    // 用户登录
    public async login(user: UserDto): Promise<any> {
        try {
            // 尝试使用数据库方式登录
            try {
                const users = await prisma.users.findMany()
                const userInfo = users.find((item: any) => item.USERNAME === user.username && item.PASSWORD === user.password)
                if (userInfo === undefined) {
                    return R.error('用户名或密码错误')
                } else {
                    return R.ok('登录成功！')
                }
            } catch (dbError) {
                console.log('数据库查询失败，切换到模拟数据模式:', dbError)
                // 备用方案：模拟用户数据，便于开发和测试
                const mockUsers = [
                    {USERNAME: 'admin', PASSWORD: 'admin'},
                    {USERNAME: 'test', PASSWORD: 'test'}
                ]

                const mockUserInfo = mockUsers.find(item => item.USERNAME === user.username && item.PASSWORD === user.password)
                if (mockUserInfo === undefined) {
                    return R.error('用户名或密码错误（模拟数据模式）')
                } else {
                    return R.ok('登录成功！（模拟数据模式）')
                }
            }
        } catch (error) {
            return R.error('登录过程出现异常' + error)
        }
    }

    // 用户注册
    public async register(user: UserDto): Promise<any> {
        try {
            // 尝试使用数据库方式注册
            try {
                const isExist = await this.isUserExist(user)
                if (isExist) {
                    return R.error('用户名已存在')
                } else {
                    return await this.createUser(user)
                }
            } catch (dbError) {
                console.log('数据库操作失败，切换到模拟注册模式:', dbError)
                // 备用方案：模拟注册成功
                return R.ok('注册成功！（模拟数据模式）')
            }
        } catch (error) {
            console.log(error)
            return R.error('注册过程出现异常:' + error)
        }
    }
}
