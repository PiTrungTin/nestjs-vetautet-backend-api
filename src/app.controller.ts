import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private logger = new Logger();

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.error("11111", AppController.name);
    this.logger.debug("22222", AppController.name);
    this.logger.log("33333", AppController.name);
    this.logger.verbose("44444", AppController.name);
    this.logger.warn("55555", AppController.name);

    return this.appService.getHello();
  }
}
