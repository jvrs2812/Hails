import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountsPayableModule } from './accounts_payable/accounts_payable.module';

const configService = new ConfigService();

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://admin:ixKGSoQunsTAVYd9@skadi.bxtsb.mongodb.net/accounts-payable?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopoLogy: true }), ConfigModule.forRoot(
    { isGlobal: true }
  ), AccountsPayableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
