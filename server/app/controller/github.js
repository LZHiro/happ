'use strict';

const Controller = require('egg').Controller;

class GithubController extends Controller {
  async index() {
    const { ctx } = this;
    const trendingData = await ctx.service.github.trending();
    ctx.body = trendingData;

  }
}

module.exports = GithubController;
