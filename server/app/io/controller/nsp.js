'use strice';

const { Controller } = require("egg");

const roomMax = 2;

class NspController extends Controller {
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    try {
      const { target, payload } = message;
      if(!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });

      nsp.emit(target, msg);
    } catch (err) {
      app.logger.error(err);
    };
  }
  async join() {
    const { ctx, app } = this;
    const { socket, logger, args } = ctx;

    const room = args[0] || 'default room';
    socket.join(room)
    const myRoom = app.io.sockets.adapter.rooms[ room ];
    const users = myRoom ? Object.keys(myRoom.sockets).length : 0;
    logger.debug(`the user number of room ${room} is ${users}`);

   try {
      if (users <= roomMax) {
        socket.emit('joined', room, socket.id);
        if (users > 1) {
          socket.to(room).emit('otherjoin', room, socket.id);
        }
      } else {
        socket.leave(room);
        socket.emit('full', room, socket.id);
      }
    } catch (err) {
      logger.error(err);
    }
  }
  async leave() {
    const { ctx, app } = this;
    const { socket, logger, args } = ctx;
    const room = args[0];
    const myRoom = app.io.sockets.adapter.rooms[ room ];
    const users = myRoom ? Object.keys(myRoom.sockets).length : 0;
    logger.debug(`the user number of room ${room} is ${users}`);

    try {
      socket.to(room).emit('bye', room, socket.id);
      socket.emit('leaved', room, socket.id);
    } catch (err) {
      logger.error(err);
    }
  }
  async message() {
    const { ctx, app } = this;
    const { socket, args, logger } = ctx;
    const [ room, data ] = args;
    logger.debug('message', `room: ${room}`, data);
    try {
      socket.to(room).emit('message', room, data);
    } catch(err) {
      logger.error(err);
    }
  }
}

module.exports = NspController;
