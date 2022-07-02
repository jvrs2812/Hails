import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsPayableController } from './controller/accounts_payable.controller';
import { AccountsPayableSchema } from './schemas/accounts_payable.schema';
import { AccountsPayableService } from './service/accounts_payable.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'accounts_payable', schema: AccountsPayableSchema }])],
  controllers: [AccountsPayableController],
  providers: [AccountsPayableService]
})
export class AccountsPayableModule { }
