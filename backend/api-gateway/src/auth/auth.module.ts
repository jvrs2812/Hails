import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AwsCognitoConfig } from './variables/aws-cognito.config';
import { AwsCognitoService } from './service/aws-cognito.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from './service/user-service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthRegisterUserSchema } from './interfaces/auth-register-user.schema';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), MongooseModule.forFeature([{ name: 'users', schema: AuthRegisterUserSchema }])],
  providers: [UserService, AwsCognitoConfig, AwsCognitoService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
