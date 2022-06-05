import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import { Console } from "console";
import { AuthLoginUserDto } from "../dtos/auth-login-user.dto";
import { AuthRegisterUserDto } from "../dtos/auth-register-user.dtos";
import { AuthRegisterUserResponseInterface } from "../interfaces/auth-register-user-response.interface";
import { AwsCognitoConfig } from "../variables/aws-cognito.config";
import { UserService } from "./user-service";

@Injectable()
export class AwsCognitoService {
    private userPool: CognitoUserPool;

    constructor(
        private authConfig: AwsCognitoConfig,
        private userService: UserService
    ) {
        this.userPool = new CognitoUserPool({
            UserPoolId: this.authConfig.userPoolId,
            ClientId: this.authConfig.clientId
        });
    }

    async RegisterUser(authRegisterDto: AuthRegisterUserDto) {
        const { name, email, password, phoneNumber } = authRegisterDto;

        if (await this.userService.existsEmail(email)) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Email já cadastrado !',
            }, HttpStatus.CONFLICT);
        }

        const user = await this.userService.Register(authRegisterDto);

        console.log(JSON.stringify(user));

        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                email,
                password,
                [
                    new CognitoUserAttribute({
                        Name: 'custom:idSystem', Value: user._id
                    }),
                    new CognitoUserAttribute({
                        Name: 'phone_number', Value: phoneNumber
                    }
                    ),
                    new CognitoUserAttribute({
                        Name: 'name', Value: name
                    }
                    )
                ], null,
                async (err, result) => {
                    if (!result) {
                        reject(err);
                    } else {
                        resolve(null);
                    }
                }
            );
        });

    }

    async AuthUser(authLoginUserDto: AuthLoginUserDto) {
        const { email, password } = authLoginUserDto;

        const userData = {
            Username: email,
            Pool: this.userPool
        }

        const userCognito = new CognitoUser(userData);

        const authenticateDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        })

        return new Promise((resolve, reject) => {
            userCognito.authenticateUser(authenticateDetails, {
                onSuccess: async (result) => {
                    const userModel = await this.userService.GetUserWithEmail(email);

                    const userResponse = {
                        name: userModel.name,
                        email: userModel.email,
                        phoneNumber: userModel.phoneNumber,
                        id: userModel._id,
                        cpf: userModel.cpf,
                        token: result.getIdToken().getJwtToken()
                    };

                    resolve(userResponse);
                },
                onFailure: ((err) => {
                    if (err.code == 'UserNotConfirmedException') {
                        reject(new HttpException({
                            status: HttpStatus.FORBIDDEN,
                            error: 'Conta não confirmada',
                        }, HttpStatus.FORBIDDEN));
                    } else if (err.code == 'NotAuthorizedException') {
                        reject(new HttpException({
                            status: HttpStatus.FORBIDDEN,
                            error: 'Email ou senha não encontrado.',
                        }, HttpStatus.FORBIDDEN));
                    }

                }),

            })
        })

    }
}