import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsReceiveModule } from './accounts_receive/accounts_receive.module';
import { AccountsReceiveService } from './accounts_receive/service/accounts_receive.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb+srv://admin:ixKGSoQunsTAVYd9@skadi.bxtsb.mongodb.net/accounts_receive?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopoLogy: true }),
    AccountsReceiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
