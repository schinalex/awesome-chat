'use strict'

const SocketIO = require('socket.io')

exports.initialize = function (server) {
  const io = SocketIO.listen(server)
  const self = this
  this.chatInfra = io.of('/chat_infra')
  this.chatInfra.on('connection', socket => {
    socket.send(JSON.stringify({
      type: 'serverMessage',
      message: 'Welcome to the most interesting chat room on earth!!!'
    }))
    socket.on('set_name', data => {
      let id = socket.id.split('#')[1]
      let comSocket = self.chatCom.sockets[`/chat_com#${id}`]
      comSocket.nickname = data.name
      socket.nickname = data.name
      socket.emit('name_set', data)
      socket.send(JSON.stringify({
        type: 'serverMessage',
        message: `Hello ${data.name}!`
      }))
      socket.broadcast.emit('user_entered', data)
    })
    socket.on('join_room', room => {
      let name = socket.nickname
      socket.join(room.name)
      let id = socket.id.split('#')[1]
      let comSocket = self.chatCom.sockets[`/chat_com#${id}`]
      comSocket.join(room.name)
      comSocket.room = room.name
      socket.in(room.name).broadcast.emit('user_entered', {name})
    })
  })

  this.chatCom = io.of('/chat_com')
  this.chatCom.on('connection', socket => {
    socket.on('message', message => {
      message = JSON.parse(message)
      // console.log(message);
      if (message.type === 'userMessage') {
        let nickname = socket.nickname
        // console.log(socket.nickname);
        message.user = nickname || 'Anonymous'
        socket.in(socket.room).broadcast.send(JSON.stringify(message))
        message.type = 'myMessage'
        socket.send(JSON.stringify(message))
        // console.log(`${message.user}: ${message.message}`);
      }
    })
  })
}
