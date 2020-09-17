'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = async app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  router.get('/trending', controller.github.index);
  router.get('/trending/:language', controller.github.language);
  io.of('/').route('exchange', io.controller.nsp.exchange);
  io.of('/').route('join', io.controller.nsp.join);
  io.of('/').route('leaved', io.controller.nsp.leave);
  io.of('/').route('message', io.controller.nsp.message);
};
