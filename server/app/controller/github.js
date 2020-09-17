'use strict';

const Controller = require('egg').Controller;
const delay = time => new Promise(resolve => setTimeout(resolve, time));

class GithubController extends Controller {
  async index() {
    const { ctx } = this;
    const data = await ctx.service.github.trending();
    ctx.type = 'json';
    ctx.body = ctx.helper.parseRes({
      data,
    });
  }
  async language() {
    const { ctx } = this;
    const data = await ctx.service.github.language();
    ctx.body = ctx.helper.parseRes({
      data,
    });
  }
}

module.exports = GithubController;
