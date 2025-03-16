/**
 * 创建时间: 2025-03-12
 * 作者: jjq
 * 描述: USER 路由层
 */

import { Controller, Get, Post, Put, Delete, Path, Body, Request, Route, SuccessResponse } from "tsoa";
import { UserDto } from './dtos/user.dto'
// 引入服务层
import { UserServices } from './services'
const userServices = new UserServices()

@Route("users")
export class UserController extends Controller {

  // 登录
  @Post("login")
  public async login(@Body() user: UserDto): Promise<any> {
    return userServices.login(user)
  }

  // 注册
  @Post("register")
  public async register(@Body() user: UserDto): Promise<any> {
    return userServices.register(user)
  }
}