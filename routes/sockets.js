'use strict'

 const SocketIO = require('socket.io')

exports.initialize = server => {
  let io = SocketIO.listen(server)
  io.on('connection', socket => {
    console.log('Heu!')
    socket.send(JSON.stringify({
        type: 'serverMessage',
        message: 'Welcome to the most interesting chat room on earth!!!'
      }))

    socket.on('message', message => {
      console.log('Got it!')
      if (message.type == 'userMessage') {
        message = JSON.parse(message)
        socket.broadcast.send(JSON.stringify(message))
        message.type = 'myMessage'
        socket.send(JSON.stringify(message))
        console.log(message)
      }
    })
  })
}
