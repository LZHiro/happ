'use strict';

class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  configWillLoad() {
  }
  async didLoad() {
  }
  async willReady() {
  }
  async didReady() {
    // this.app.runSchedule('clear_trending_cache');
    // this.app.runSchedule('update_github_trending');
  }
  async serverDidReady() {
  }
}

module.exports = AppBootHook;
