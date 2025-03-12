import { Controller, Get, Post, Put, Delete, Path, Body, Request, Route, SuccessResponse } from "tsoa";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Route("users")
export class UserController extends Controller {
  // 获取所有用户
  @Get()
  public async getAllUsers(): Promise<any[]> {
    // 当数据库表名全部使用大写时，下方大小写与预期不符。数据库使用小写表名后问题消失
    const users = await prisma.users.findMany();
      return users;
    }
  }