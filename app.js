const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(`${__dirname}/public`))

io.on('connection', socket => {
    socket.emit('connected')
    socket.broadcast.emit('new')
    socket.on('join', data => {
        Object.keys(socket.rooms).map(room => {
            if (room !== socket.id) socket.leave(socket.rooms[room])
        })
        socket.join(data.room)
        socket.broadcast.to(data.room).emit('joinned', {room: data.room})
    })
    socket.on('send:message', data => {
        socket.broadcast.to(data.message.room).emit('message:sent', data)
    })
})

server.listen(3000)
