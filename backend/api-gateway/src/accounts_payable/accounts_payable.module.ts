import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsPayableController } from './controller/accounts_payable.controller';
import { AccountsPayableService } from './service/accounts_payable.service';

@Module({
  imports: [],
  controllers: [AccountsPayableController],
  providers: [AccountsPayableService]
})
export class AccountsPayableModule { }
