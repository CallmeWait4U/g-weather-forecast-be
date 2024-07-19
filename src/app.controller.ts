import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDTO } from './dto/register.dto';
import { SearchDTO } from './dto/search.dto';
import { SignUpDTO } from './dto/sign.up.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/signUp')
  async signUp(@Body() body: SignUpDTO) {
    console.log(body);
    return await this.appService.signUp(body);
  }

  @Post('/signIn')
  async signIn(@Body() body: SignUpDTO) {
    return await this.appService.signIn(body);
  }

  @Get('/search')
  async search(@Query() query: SearchDTO) {
    return await this.appService.search(query.name, query.email);
  }

  @Get('/subscribe')
  async subscribe(@Query() query: RegisterDTO) {
    return await this.appService.subscribe(query);
  }

  @Get('/unsubscribe')
  async unsubscribe(@Query() query: RegisterDTO) {
    return await this.appService.unsubscribe(query);
  }
}
