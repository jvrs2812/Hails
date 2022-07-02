import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthRegisterUserDto } from "../dtos/auth-register-user.dtos";
import { AuthRegisterUserInterface } from "../interfaces/auth-register-user.interface";

@Injectable()
export class UserService {

    constructor(@InjectModel('users') private readonly UserModel: Model<AuthRegisterUserInterface>) { }


    async Register(userRegister: AuthRegisterUserDto): Promise<AuthRegisterUserInterface> {
        const userCreated = new this.UserModel(userRegister);

        return await userCreated.save();
    }

    async GetUserWithEmail(email: string): Promise<AuthRegisterUserInterface> {
        const user = await this.UserModel.findOne({ email }).exec();

        return user;
    }

    async existsEmail(email: string): Promise<boolean> {

        const user = await this.UserModel.findOne({ email }).exec();

        return user ? true : false;
    }
}