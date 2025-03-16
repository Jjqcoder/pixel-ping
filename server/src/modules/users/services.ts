/**
 * 创建时间: 2025-03-12
 * 作者: jjq
 * 描述: USER 服务层
 */

import { PrismaClient } from "@prisma/client";
import { UserDto } from './dtos/user.dto'
import { R } from '../../utils/R'

const prisma = new PrismaClient();

export class UserServices {

  // 查询指定的用户名、密码是否存在
  public async isUserExist(user: UserDto): Promise<any> {
    try {
      const users = await prisma.users.findMany({
        where: {
          USERNAME: user.username,
          // PASSWORD: user.password
        }
      });
      // console.log('指定用户名和密码的用户', users)
      if (users.length === 0) {
        return false;// 用户不存在
      } else {
        return true;// 用户存在
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
      return R.ok("用户创建成功！") // 创建成功
    } catch (error) {
      return R.error("用户创建过程发生异常：" + error)// 创建失败
    }
  }

  // 用户登录
  public async login(user: UserDto): Promise<any> {
    try {
      const users = await prisma.users.findMany();
      const userInfo = users.find((item: any) => item.USERNAME === user.username && item.PASSWORD === user.password);
      if (userInfo === undefined) {
        return R.error("用户名或密码错误")
      } else {
        return R.ok("登录成功！");
      }
    } catch (error) {
      return R.error("登录过程出现异常" + error)
    }
  }

  // 用户注册
  public async register(user: UserDto): Promise<any> {
    try {
      const isExist = await this.isUserExist(user);
      if (isExist) {
        return R.error("用户名已存在")
      } else {
        return await this.createUser(user);
      }

    } catch (error) {
      // console.log(error);
      return R.error("注册过程出现异常:" + error)
    }
  }
}