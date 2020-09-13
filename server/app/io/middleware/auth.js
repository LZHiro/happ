'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    const { query } = socket.handshake;

    const { room, userId } = query;
    const rooms = [ room ];

    nsp.adapter.clients(rooms, (err, clients) => {
      clients[id] = query;
      socket.join(room);

      nsp.to(room).emit('joined', {
        clients,
        message: `User ${id} joined.`,
      });
    });
    await next();

    nsp.adapter.clients(rooms, (err, clients) => {
      const _clients = {};
      clients.forEach(client => {
        const _id = client.split('#')[1];
        const _client = app.io.sockets.sockets[_id];
        const _query = _client.handshake.query;
        _clients[client] = _query;
      });

      nsp.to(room).emit('leave', {
        clients,
        message: `User ${id} leaved.`
      });
    })
  };
};
