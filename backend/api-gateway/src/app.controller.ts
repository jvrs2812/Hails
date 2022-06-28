import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AccountsReceiveDto } from './accounts_receive/dtos/accounts_receive.dto';
import { AppService } from './app.service';

@Controller('api/v1')
export class AppController {
  private clientAdminBackend: ClientProxy;

  constructor(private readonly appService: AppService, private configService: ConfigService) {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.configService.get<String>('RABBITMQ_USER')}:${this.configService.get<String>('RABBITMQ_PASSWORD')}@${this.configService.get<String>('RABBITMQ_HOST')}:${this.configService.get<String>('RABBITMQ_PORT')}`],
        queue: 'admin-backend'
      }
    })

  }

  @Post('criarTeste')
  @UsePipes(ValidationPipe)
  async criarTeste(@Body() account: AccountsReceiveDto) {
    return await this.clientAdminBackend.emit('teste', account);
  }
}
