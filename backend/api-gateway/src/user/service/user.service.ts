import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Injectable()
export class UserService {
    private clientAdminBackend: ClientProxy;
    constructor(private configService: ConfigService) {
        this.clientAdminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${this.configService.get<String>('RABBITMQ_USER')}:${this.configService.get<String>('RABBITMQ_PASSWORD')}@${this.configService.get<String>('RABBITMQ_HOST')}:${this.configService.get<String>('RABBITMQ_PORT')}`],
                queue: 'admin-user'
            }
        })
    }

    async getEmailUser(idUser: string): Promise<Observable<string>> {
        const email = this.clientAdminBackend.send<string>('get-email-user', idUser);

        return email;
    }

}