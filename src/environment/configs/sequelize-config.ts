import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig = () => {
  const config = {
    databases: {} as { default: SequelizeModuleOptions },
  };

  config.databases.default = {
    dialect: 'postgres',
    uri: process.env.DB_URI,
    name: 'default',
    logging: process.env.DB_LOGGING === 'true',
    models: [__dirname + '/../../databases/models/**/*.ts'],
  };

  return config;
};
