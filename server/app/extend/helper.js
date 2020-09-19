'use strict';

const cheerio = require('cheerio');

module.exports = {
  parseMsg(action, payload = {}, metadata = {}) {
    const meta = {
      timestamp: Date.now(),
      ...metadata,
    };

    return {
      data: {
        action,
        payload,
      },
      meta,
    };
  },
  parseRes(data) {
    return {
      code: 200,
      message: '获取成功',
      ...data,
    };
  },
  insertDataFromHtml(html, key, obj) {
    if (html) {
      const Q = cheerio.load(html);
      Q('.Box-row').each(function(index) {
        obj[key][index] = {};
        obj[key][index].link = `https://github.com${Q(this).find('.h3.lh-condensed a').attr('href')}`;
        obj[key][index].language = Q(this).find('[itemprop=programmingLanguage]').text();
        // obj[key][index].language_color = Q(this).find('.repo-language-color').css('background-color');
        Q(this).find('.h3.lh-condensed').text()
          .replace(/([^\s]+)\s+\/\s+([^\s]+)/g, (m, author, project) => {
            obj[key][index].author = author;
            obj[key][index].project = project;
          });
        Q(this).find('.muted-link').text()
          .replace(/([^\s]+)\s+([^\s]+)/g, (m, stars, branch) => {
            obj[key][index].stars = stars;
            obj[key][index].branch = branch;
          });
        obj[key][index].description = Q(this).find('p.col-9.text-gray').text()
          .trim();
        obj[key][index].star_today = Q(this).find('.float-sm-right').text()
          .trim();
      });
    }
  },
  delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
};
