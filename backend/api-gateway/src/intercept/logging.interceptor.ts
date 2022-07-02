import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { now } from "mongoose";
import { Observable } from "rxjs";

@Injectable()
export class LogginInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        var datanow = now;
        //GRAVAR NO BANCO O TEMPO QUE DEMOROU CADA REQUEST PARA SABER A SAUDE DOS ENDPOINTS
        return next.handle();
    }
}