'use strict';

const { Controller } = require('egg');


class Weibo extends Controller {
  async index() {
    const { ctx } = this;
    try {
      const result = await ctx.service.weibo.index();
      ctx.body = ctx.helper.parseRes({
        data: result.data,
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = ctx.helper.parseRes({
        code: 500,
        message: '网络异常,请稍后重试',
      })
    }
  }
  async yaowen() {
    const { ctx } = this;

  }
}

module.exports = Weibo;
