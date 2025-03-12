import { Controller, Get, Post, Put, Delete, Path, Body, Request, Route, SuccessResponse } from "tsoa";
import { PrismaClient } from "@prisma/client";
import { R } from './../../utils/R'
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

    // 登录
    @Post("login")
    public async login(@Body() user: any): Promise<any> {
      try {
        const { username, password } = user;
        const users = await prisma.users.findMany();
        console.log(users);
        const userInfo = users.find((item: any) => item.USERNAME === username && item.PASSWORD === password);
        console.log("userInfo", userInfo);
        if (userInfo === undefined) {
          return R.error("用户名或密码错误")
        }
        return R.ok("登录成功！");
      } catch (error) {
        return R.error("登录过程出现异常"+error)
      }
    }
  }