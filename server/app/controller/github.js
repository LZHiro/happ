'use strict';

const Controller = require('egg').Controller;

class GithubController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      const data = await ctx.service.github.trending();
      ctx.type = 'json';
      ctx.body = ctx.helper.parseRes({
        data,
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = ctx.helper.parseRes({
        code: 500,
        message: '网路异常',
      });
    }
  }
  async language() {
    const { ctx } = this;
    try {
      const data = await ctx.service.github.language();
      ctx.body = ctx.helper.parseRes({
        data,
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = ctx.helper.parseRes({
        code: 500,
        message: '网络异常',
      });
    }
  }
}

module.exports = GithubController;
