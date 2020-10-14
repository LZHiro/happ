'use strict';

const { Controller } = require('egg');


class Weibo extends Controller {
  async index() {
    const { ctx } = this;
    try {
      switch(ctx.params.type) {
        case 'index':
          {
            const result = await ctx.service.weibo.index();
            ctx.body = ctx.helper.parseRes({
              data: result.data,
            });
          }
        break;
        case 'yaowen':
         {
          const result = await ctx.service.weibo.yaowen();
          ctx.body = ctx.helper.parseRes({
            data: result.data,
          });
         }
        break;
        default:
          ctx.body = ctx.helper.parseRes({
            code: 500,
            message: '网络异常,请稍后重试',
          });
      }
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = ctx.helper.parseRes({
        code: 500,
        message: '网络异常,请稍后重试',
      })
    }
  }
}

module.exports = Weibo;
