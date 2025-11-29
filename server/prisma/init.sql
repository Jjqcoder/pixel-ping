-- 等待数据库完全初始化
SET SESSION wait_timeout = 28800;
SET SESSION interactive_timeout = 28800;

-- 确保pixelping数据库存在
CREATE DATABASE IF NOT EXISTS pixelping;

-- 使用pixelping数据库
USE pixelping;

-- 确保users表存在（通常由Prisma负责创建，但这里作为备用）
CREATE TABLE IF NOT EXISTS users (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  USERNAME VARCHAR(255),
  PASSWORD VARCHAR(255)
);

-- 插入默认用户（如果不存在）
INSERT IGNORE INTO users (USERNAME, PASSWORD) VALUES ('admin', 'admin123');
INSERT IGNORE INTO users (USERNAME, PASSWORD) VALUES ('testuser', 'test123');

-- 输出初始化完成信息
SELECT 'Database and default users initialized successfully' AS status;
