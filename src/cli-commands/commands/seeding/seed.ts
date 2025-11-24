export abstract class Seed {
  abstract seed(): Promise<boolean>;

  [key: string]: any;
}

export interface SeedInterfaceConstruct {
  new (...args: any[]): Seed;
}
