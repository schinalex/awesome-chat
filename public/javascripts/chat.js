'use strict'

const socket = io.connect('/')

socket.on('message', data => {
  data = JSON.parse(data)
  let user = data.user
  if (data.type === 'serverMessage') user = 'Server'
  let li =
  `<ul class="mdl-list">
    <li class="mdl-list__item mdl-list__item--three-line">
      <span class="mdl-list__item-primary-content">
        <i class="material-icons mdl-list__item-avatar">person</i>
        <span>${user}</span>
        <span class="mdl-list__item-text-body">
          ${data.message}
        </span>
      </span>
      <span class="mdl-list__item-secondary-content">
        <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
      </span>
    </li>
  </ul>`
  $('#messages').append(li)
})
$(() => {
  var dialog = document.querySelector('dialog')
  let showDialogButton = document.querySelector('#show-dialog')
  if (! dialog.showModal) dialogPolyfill.registerDialog(dialog)
  showDialogButton.addEventListener('click', () => dialog.showModal())
  dialog.querySelector('.close').addEventListener('click', () => dialog.close())

  $('#name-form').submit(() => {
    let name = $('#name').val()
    if (name) {
      socket.emit('set_name', {name})
      dialog.close()
      $('#name').val('')
    }
    return false
  })
  $('#message-form').submit(() => {
    let message = $('#message').val()
    if (message) {
      let data = {message, type: 'userMessage'}
      socket.send(JSON.stringify(data))
      $('#message').val('')
    }
    return false
  })
})
