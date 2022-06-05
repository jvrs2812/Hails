import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountsPayableModule } from './accounts_payable/accounts_payable.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsReceiveModule } from './accounts_receive/accounts_receive.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://admin:ixKGSoQunsTAVYd9@skadi.bxtsb.mongodb.net/skadi?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopoLogy: true }), ConfigModule.forRoot(
    { isGlobal: true }
  ), AuthModule, AccountsPayableModule, AccountsReceiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
