import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountsPayableModule } from './accounts_payable/accounts_payable.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsReceiveModule } from './accounts_receive/accounts_receive.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv:'+process.ENV.MONGODB, { useNewUrlParser: true, useUnifiedTopoLogy: true }), ConfigModule.forRoot(
    { isGlobal: true }
  ), AuthModule, AccountsPayableModule, AccountsReceiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
