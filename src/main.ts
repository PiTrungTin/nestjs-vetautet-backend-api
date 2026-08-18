import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path/win32';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoginGuard } from './login.guard';
import { MyLogger } from './logger/my.logger';
import { MyloggerDev } from './logger/my.logger.dev';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: new MyLogger()
    // bufferLogs: true
  });
  app.useLogger(new MyLogger());
  app.useGlobalPipes(new ValidationPipe());

  //anable cors
  app.enableCors();
  app.useGlobalGuards(new LoginGuard());
  app.useStaticAssets(join(__dirname, '../uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
