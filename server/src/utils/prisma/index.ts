/**
 * 创建时间: 2025-03-12
 * 作者: jjq
 * 描述: 返回PrismaClient对象工具
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;