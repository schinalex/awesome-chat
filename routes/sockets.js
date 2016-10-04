'use strict'

const SocketIO = require('socket.io')

exports.initialize = server => {
  let io = SocketIO.listen(server)
  io.on('connection', socket => {
    socket.send(JSON.stringify({
      type: 'serverMessage',
      message: 'Welcome to the most interesting chat room on earth!!!'
    }))

    socket.on('message', message => {
      message = JSON.parse(message)
      if (message.type === 'userMessage') {
        let nickname = socket.nickname
        message.user = nickname || 'Anonymous'
        socket.broadcast.send(JSON.stringify(message))
        message.type = 'myMessage'
        socket.send(JSON.stringify(message))
        console.log(`${message.user}: ${message.message}`)
      }
    })

    socket.on('set_name', data => {
      socket.nickname = data.name
      socket.emit('name_set', data)
      socket.send(JSON.stringify({
        type: 'serverMessage',
        message: `Hello ${data.name}!`
      }))
    })
  })
}
