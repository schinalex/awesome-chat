'use strict'

const chatInfra = io.connect('/chat_infra')
const chatCom = io.connect('/chat_com')
const makeMessage = (user, message) => {
  return `<ul class="mdl-list">
    <li class="mdl-list__item mdl-list__item--three-line">
      <span class="mdl-list__item-primary-content">
        <i class="material-icons mdl-list__item-avatar">person</i>
        <span>${user}</span>
        <span class="mdl-list__item-text-body">${message}</span>
      </span>
      <span class="mdl-list__item-secondary-content">
        <a class="mdl-list__item-secondary-action" href="#">
          <i class="material-icons">star</i>
        </a>
      </span>
    </li>
  </ul>`
}
let displayMessage = (user, message) => {
  $('#messages').append(makeMessage(user,message))
}
let roomName = decodeURI(
  (RegExp('room' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
)
if (roomName) {
  chatInfra.on('name_set', data => {
    chatInfra.emit('join_room', {name: roomName})
    chatInfra.on('user_entered', data => {
      data = JSON.parse(data)
      displayMessage('Server', `Say hello to ${data.name}!`)
    })
    chatInfra.on('message', data => {
      data = JSON.parse(data)
      displayMessage('Server', data.message)
    })
  })
  chatCom.on('message', data => {
    data = JSON.parse(data)
    displayMessage(data.user, data.message)
  })
}
$(() => {
  let dialog = document.querySelector('dialog')
  let showDialogButton = document.querySelector('#show-dialog')
  if (! dialog.showModal) dialogPolyfill.registerDialog(dialog)
  dialog.showModal()
  // showDialogButton.addEventListener('click', () => dialog.showModal())
  dialog.querySelector('.close').addEventListener('click', () => dialog.close())

  $('#name-form').submit(() => {
    let name = $('#name').val()
    if (name) {
      chatInfra.emit('set_name', {name})
      dialog.close()
      $('#name').val('')
    }
    return false
  })
  $('#message-form').submit(() => {
    let message = $('#message').val()
    if (message) {
      let data = {message, type: 'userMessage'}
      chatCom.send(JSON.stringify(data))
      $('#message').val('')
    }
    return false
  })
})
