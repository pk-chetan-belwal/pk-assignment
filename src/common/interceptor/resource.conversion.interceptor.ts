/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { ResourceMap } from '../decorator/resource-map.decorator';

@Injectable()
export class ResourceConversionInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((content) => {
        if (!content) {
          return content;
        }

        const instanceType = this.reflector.getAllAndOverride(ResourceMap, [
          context.getHandler(),
          context.getClass(),
        ]);

        if (Array.isArray(content)) {
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
