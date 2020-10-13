'use strict';
const { Subscription } = require('egg');
const path = require('path');
const fs = require('fs');

class UpdateGithubCache extends Subscription {
  static get schedule() {
    return {
      interval: '1d',
      type: 'worker',
    };
  }
  async subscribe() {
    const { ctx } = this;
    const { logger, helper } = ctx;

    logger.info('update github_trending cache');
    const trending = {
      today: [],
      week: [],
      month: [],
    };
    try {
      const options = {
        dataType: 'text',
        timeout: 300000,
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
          host: 'github.com',
        },
      };
      const result = await Promise.all([
        ctx.curl('https://github.com/trending', options),
        ctx.curl('https://github.com/trending?since=weekly', options),
        ctx.curl('https://github.com/trending?since=monthly', options),
      ]);
      if (result) {
        const today = result[0].data;
        const week = result[1].data;
        const month = result[2].data;
        helper.insertDataFromHtml(today, 'today', trending);
        helper.insertDataFromHtml(week, 'week', trending);
        helper.insertDataFromHtml(month, 'month', trending);
        try {
          fs.accessSync(path.join(__dirname, '../public', 'cache'));
        } catch (err) {
          fs.mkdirSync(path.join(__dirname, '../public/cache'));
        }
        fs.writeFile(path.join(__dirname, '../public/cache/github_trending.json'), JSON.stringify(trending), err => {
          if (!err) {
            logger.info('write github_trending success');
          } else {
            logger.error(err);
          }
        });
      }
    } catch (err) {
      logger.error(err);
    }
  }
}


module.exports = UpdateGithubCache;
