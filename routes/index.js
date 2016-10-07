const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express Chat' })
})
router.get('/chat_room', (req, res) => {
  res.render('chatroom', {title: 'Express Chat'})
})
router.get('/rooms', (req, res) => {
  res.render('rooms', {title: 'Express Chat'})
})
module.exports = router
