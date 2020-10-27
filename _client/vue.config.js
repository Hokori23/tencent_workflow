module.exports = {
  devServer: {
    port: 8080,
    proxy: 'http://localhost:8003'
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8003',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  }
};
