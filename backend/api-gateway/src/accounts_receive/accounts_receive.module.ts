import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsReceiveController } from './controller/accounts_receive.controller';
import { AccountsReceiveSchema } from './schemas/accounts_receive.schema';
import { AccountsReceiveService } from './service/accounts_receive.service';

@Module({
  imports: [],
  controllers: [AccountsReceiveController],
  providers: [AccountsReceiveService]
})
export class AccountsReceiveModule { }
