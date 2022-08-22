import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { now } from "mongoose";
import { Observable } from "rxjs";

@Injectable()
export class LogginInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle();
    }
}