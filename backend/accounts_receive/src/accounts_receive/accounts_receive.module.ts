import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsReceiveController } from './controller/accounts_receive.controller';
import { AccountsReceiveSchema } from './schemas/accounts_receive.schema';
import { AccountsReceiveService } from './service/accounts_receive.service';

@Module(
  {
    imports: [MongooseModule.forFeature([{ name: 'accounts_receive', schema: AccountsReceiveSchema }])],
    controllers: [AccountsReceiveController],
    providers: [AccountsReceiveService]

  })
export class AccountsReceiveModule {

}
