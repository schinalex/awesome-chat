'use strict'

const socket = io.connect('/')

socket.on('message', data => {
  data = JSON.parse(data)
  $('#messages').append(`<div class="${data.type}">${data.message}</div>`)
})

$(() => {
  $('#send').click(() => {
    let data = {
      message: $('#message').val(),
      type: 'userMessage'
    }
    socket.send(JSON.stringify(data))
    $('#message').val('')
  })
})
