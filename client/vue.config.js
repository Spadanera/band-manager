// vue.config.js
module.exports = {
    devServer: {
      public: 'localhost:8080',
      watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
      }
    }
  }