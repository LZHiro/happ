'use strict';

const { Subscription } = require('egg');
const fs = require('fs');
const path = require('path');

class ClearTrendingCache extends Subscription {
  static get schedule() {
    return {
      interval: '1d',
      type: 'worker',
    }
  }
  async subscribe() {
    try {
      const dirpath = path.join(__dirname, '../public/cache');
      if (fs.existsSync(dirpath)) {
        const files = fs.readdirSync(dirpath);
        files.forEach(file => {
          fs.unlinkSync(`${dirpath}/${file}`);
        });
        console.log('clear trending cache success');
      }
    } catch (err) {
      this.ctx.logger.error(err);
    }

  }
}

module.exports = ClearTrendingCache;
