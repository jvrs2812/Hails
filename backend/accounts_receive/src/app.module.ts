import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsReceiveModule } from './accounts_receive/accounts_receive.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://admin:ixKGSoQunsTAVYd9@skadi.bxtsb.mongodb.net/accounts-receive?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopoLogy: true }), AccountsReceiveModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
