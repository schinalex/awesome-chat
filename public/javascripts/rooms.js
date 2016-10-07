const chatInfra = io.connect('/chat_infra')

chatInfra.on('connect', () => {
  chatInfra.emit('get_rooms', {})
  chatInfra.on('rooms_list', rooms => {
    for (let room in rooms) {
      let roomListElement = `li class="mdl-list__item">
        <span class="mdl-list__item-primary-content">
          ${room}
        </span>
      </li>`
      $('#rooms-list').append(roomListElement)
    }
  })

  $(() => {
    $('#room-form').submit(() => {
      window.location = `/chatroom?room=${$('#new-room-name').val()}`
    })
  })
})
