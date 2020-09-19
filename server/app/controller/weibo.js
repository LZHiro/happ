'use strict';

const { Controller } = require('egg');


class Weibo extends Controller {
  async index() {
    const { ctx } = this;
    const result = await ctx.service.weibo.index();
    ctx.body = ctx.helper.parseRes({
      data: result.data,
    });
  }
}

module.exports = Weibo;
