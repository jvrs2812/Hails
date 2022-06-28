import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://admin:ixKGSoQunsTAVYd9@skadi.bxtsb.mongodb.net/skadi?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopoLogy: true }), ConfigModule.forRoot(
    { isGlobal: true }
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }