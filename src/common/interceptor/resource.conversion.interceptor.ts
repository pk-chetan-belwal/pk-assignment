import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { RESOURCE_MAP_KEY } from '../decorator/resource-map.decorator';

@Injectable()
export class ResourceConversionInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const instanceType = this.reflector.getAllAndOverride<{
      new (...args: unknown[]): unknown;
    }>(RESOURCE_MAP_KEY, [context.getHandler(), context.getClass()]);

    return next.handle().pipe(
      map((content) => {
        if (content instanceof Array) {
          return content.map((mappedContent) =>
            plainToInstance(instanceType, mappedContent, {
              excludeExtraneousValues: true,
            }),
          );
        }

        return plainToInstance(instanceType, content, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
