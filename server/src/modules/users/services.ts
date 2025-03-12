/**
 * 创建时间: 2025-03-12
 * 作者: jjq
 * 描述: USER 服务层
 */

import { PrismaClient } from "@prisma/client";
import { UserLoginDto } from './dtos/user.dto'
import { R } from '../../utils/R'

const prisma = new PrismaClient();

export class UserServices {

  // 用户登录
  public async login(user: UserLoginDto): Promise<any> {
    try {
      const users = await prisma.users.findMany();
      const userInfo = users.find((item: any) => item.USERNAME === user.username && item.PASSWORD === user.password);
      if (userInfo === undefined) {
        return R.error("用户名或密码错误")
      } else {
        return R.ok("登录成功！");
      }
    } catch (error) {
      return R.error("登录过程出现异常"+error)
    }
  }


}