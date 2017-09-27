const socket = io()
socket.on('connected', () => {
    console.log('YOU ARE NOW CONNECTED !')
    socket.emit('join', {room: 'room1'})
})
socket.on('new', data => console.log('SOMEONE IS NEW !'))
socket.on('joinned', data => console.log('SOMEONE COMES IN YOUR ROOM !'))


const app = new Vue({
    el: '#app',
    data: {
        user: null,
        room: 'room1',
        message: null,
        messages: [],
    },
    beforeCreate: function() {
        socket.on('message:sent', data => this.messages.push(data.message))
    },
    methods: {
        join: function(e) {
            socket.emit('join', {room: e.target.id})
            this.room = e.target.id
        },
        send: function() {
            const message = {author: this.user, content: this.message, room: this.room}
            socket.emit('send:message', {message})
            this.message = null
            this.messages.push(message)
        }
    }
})
