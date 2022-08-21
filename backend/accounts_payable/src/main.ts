import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${configService.get<String>('RABBITMQ_USER')}:${configService.get<String>('RABBITMQ_PASSWORD')}@${configService.get<String>('RABBITMQ_HOST')}:${configService.get<String>('RABBITMQ_PORT')}`],
        queue: 'admin-payable',
        noAck: false,
      },
      logger: console
    },
  );
  await app.listen();
}
bootstrap();
