const config = {
  databaseConfig: {
    // 数据库名
    database: 'tencent_workflow',

    // 数据库账号
    user: 'tencent_workflow',

    // 密码
    password: 'KmjD6dYSNTwhD7ZL',

    // options
    options: {
      // 数据库类别
      dialect: 'mysql',

      // 主机，如IP 或 'localhost'
      host: '101.201.239.229',

      // 端口, MySQL默认端口3306
      port: '3306',

      // 字符集
      charset: 'utf8mb4',

      // 连接池
      pool: {
        max: 20,
        min: 1,
        idle: 30000,
        acquire: 60000
      },

      // 时区
      timezone: '+08:00'
    }
  },
  serverConfig: {
    port: '8003'
  }
};

module.exports = config;
