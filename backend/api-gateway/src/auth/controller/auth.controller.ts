import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthLoginUserDto } from '../dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from '../dtos/auth-register-user.dtos';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { AwsCognitoService } from '../service/aws-cognito.service';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private awsCognitoService: AwsCognitoService) { }

    @Post('register')
    @HttpCode(201)
    @UsePipes(ValidationPipe)
    async Register(
        @Body() authRegisterUserDto: AuthRegisterUserDto
    ) {

        return await this.awsCognitoService.RegisterUser(authRegisterUserDto);
    }

    @Post('login')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async Login(
        @Body() authLoginUserDto: AuthLoginUserDto
    ) {
        const user = await this.awsCognitoService.AuthUser(authLoginUserDto);

        return user;
    }

    @Post('refresh-token')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async RefreshToken(
        @Body() refreshTokenDto: RefreshTokenDto
    ) {
        const newToken = await this.awsCognitoService.RefreshToken(refreshTokenDto);

        return newToken;
    }
}
