'use strict';

module.exports = () => {
  return async function(ctx, next) {
    ctx.set('Access-Control-Allow-Origin', 'https://hiro.cn:8000');
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
    await next();
  };
};
