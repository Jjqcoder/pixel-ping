
export class R{
  static ok(data: any) {
      return {
          code: 200,
          message: "操作成功",
          data: data
      };
  }

  static error(msg: any) {
      return {
          code: 400,
          message: msg,
          data: []
      };
  }
}