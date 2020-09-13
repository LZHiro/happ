'use strict';

const { Service } = require('egg');
const cheerio = require('cheerio');

class GithubService extends Service {
  async trending() {
    const { ctx } = this;
    const trendingData = [];
    try {
      const { data } = await ctx.curl('https://github.com/trending', {
        dataType: 'text',
        timeout: 30000,
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
          host: 'github.com',
        },
      });
      if (data) {
        const Q = cheerio.load(data);
        Q('.Box-row').each(function(index) {
          trendingData[index] = {};
          trendingData[index].link = `https://github.com${Q(this).find('.h3.lh-condensed a').attr('href')}`;
          trendingData[index].language = Q(this).find('[itemprop=programmingLanguage]').text();
          // trendingData[index].language_color = Q(this).find('.repo-language-color').css('background-color');
          Q(this).find('.h3.lh-condensed').text()
            .replace(/([^\s]+)\s+\/\s+([^\s]+)/g, (m, author, project) => {
              trendingData[index].author = author;
              trendingData[index].project = project;
            });
          Q(this).find('.muted-link').text()
            .replace(/([^\s]+)\s+([^\s]+)/g, (m, stars, branch) => {
              trendingData[index].stars = stars;
              trendingData[index].branch = branch;
            });
          trendingData[index].description = Q(this).find('p.col-9.text-gray').text()
            .trim();
          trendingData[index].star_today = Q(this).find('.float-sm-right').text()
            .trim();
        });
        console.log(trendingData);
      }

      return trendingData;
    } catch (err) {
      return trendingData;
    }
  }
}

module.exports = GithubService;
