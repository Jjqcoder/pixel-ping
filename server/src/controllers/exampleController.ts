import { Controller, Get, Route } from "tsoa";

@Route("example")
export class ExampleController extends Controller {
  @Get()
  public async getExample(): Promise<string> {
    return "Hello, TSOA!";
  }
}