import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AccountsReceiveDto } from './accounts_receive/dtos/accounts_receive.dto';
import { AppService } from './app.service';

@Controller('api/v1')
export class AppController {
  constructor() {
  }
}
