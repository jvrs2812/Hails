import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http.exception.filter';
import { LogginInterceptor } from './intercept/logging.interceptor';
import { TimeOutInterceptor } from './intercept/timeout.interceptor';
import * as momentTimezone from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LogginInterceptor(), new TimeOutInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS')
  }

  await app.listen(3000);
}
bootstrap();
