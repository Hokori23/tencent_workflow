import { databaseConfig } from '@config';
import { Sequelize } from 'sequelize';

const { database, user, password, options } = databaseConfig;
const DB = new Sequelize(database, user, password, {
  ...options,
  logging: process.env.NODE_ENV === 'development' ? console.log : false // 是否输出数据库日志
});

const init = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // await DB.authenticate();
      // console.log('Connection has been established successfully.');
      await DB.sync({ alter: true });
      console.log('All models were synchronized successfully.');
      resolve();
    } catch (error) {
      throw new Error(`Unable to connect to the database: ${error}`);
    }
  });
};
export { init };

export default DB;
