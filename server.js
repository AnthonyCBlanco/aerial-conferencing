const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const exphbs = require('express-handlebars');

const hbs = exphbs.create();

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))


app.get('/', (req, res) => {

  res.redirect(`/${uuidV4()}`)

})


app.get('/:room', (req, res) => {

  res.render('room', { roomId: req.params.room })

})


// WebSocket Communication

io.on('connection', socket => {

  socket.on('join-room', (roomId, userId) => {

    socket.join(roomId)

    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {

      socket.to(roomId).broadcast.emit('user-disconnected', userId)

    })

  })

})

// Starting the Server
server.listen(3000)