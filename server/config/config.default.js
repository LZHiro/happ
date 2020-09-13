/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1598314072354_926';

  // add your middleware config here
  config.middleware = [];

  config.io = {
    init: {},
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: []
      }
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    mongoose: {
      url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1/happ',
      options: {
        poolSize: 40,
      },
    },
  };


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
