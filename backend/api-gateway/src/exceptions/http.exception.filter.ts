import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(HttpExceptionFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        console.log(`exception: ${JSON.stringify(exception)}`)

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException ? exception.getResponse() : exception;

        this.logger.error(`Http Status: ${status} Error Message: ${JSON.stringify(message)} `)

        const data = {
            code: message['status'] ? message['status'] : message['name'] ? message['name'] : message['statusCode'],
            error: message['message']
        }

        response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            error: data
        })
    }
}
