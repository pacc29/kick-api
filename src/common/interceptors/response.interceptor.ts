import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

interface Response<T> {
    statusCode: number;
    data: T;
    message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const httpContext = context.switchToHttp();
        const statusCode = httpContext.getResponse().statusCode;
        // console.log(httpContext.getResponse());

        return next.handle().pipe(map(data => ({ statusCode, data })));
    }
}