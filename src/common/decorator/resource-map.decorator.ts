import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const RESOURCE_MAP_KEY = 'resources-map.decorator';

export const ResourceMap = (resourceType: {
  new (...args: unknown[]): unknown;
}): CustomDecorator => SetMetadata(RESOURCE_MAP_KEY, resourceType);
