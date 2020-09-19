'use strict';

const { Service } = require('egg');
const fs = require('fs');
const path = require('path');

const options = {
  dataType: 'text',
  timeout: 300000,
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
    host: 'github.com',
  },
};

class GithubService extends Service {
  async trending() {
    const { ctx } = this;
    const { logger } = ctx;
    try {
      const filepath = path.join(__dirname, '../public/cache/github_trending.json');
      if (fs.existsSync(filepath)) {
        const data = fs.readFileSync(filepath, {
          encoding: 'utf8',
        });
        return JSON.parse(data);
      }
      return [];
    } catch (err) {
      logger.error(err);
    }
  }
  async language() {
    const { ctx } = this;
    const { logger, query, params } = ctx;

    function getDate(since) {
      switch (since) {
        case 'daily':
          return 'today';
        case 'weekly':
          return 'week';
        case 'monthly':
          return 'month';
        default:
          return 'today';
      }
    }
    try {
      const { language } = params;
      const since = query.since || 'daily';
      const key = getDate(since);
      const cachePath = path.join(__dirname, `../public/cache/${language}_trending.json`);
      let result = {};
      if (language) {
        if (fs.existsSync(cachePath)) {
          const data = fs.readFileSync(cachePath, {
            encoding: 'utf8',
          });
          result = JSON.parse(data);
          if (result[key].length) {
            return result;
          }
        }

        const { data } = await ctx.curl(`https://github.com/trending/${language}?since=${since}`, options);
        if (!data.includes('It looks like we don’t have any trending repositories for your choices.')) {
          const trending = {
            today: [],
            week: [],
            month: [],
            ...result,
          };
          ctx.helper.insertDataFromHtml(data, key, trending);
          fs.writeFile(cachePath, JSON.stringify(trending), err => {
            if (!err) {
              logger.debug(`write ${language}_trending success`);
            }
          });
          return trending;
        }
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

module.exports = GithubService;
