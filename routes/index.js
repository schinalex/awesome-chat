const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' })
})
module.exports = router
module.exports.chatroom = (req, res) => {
  res.render('chatroom', {title: 'Express chat'})
}
