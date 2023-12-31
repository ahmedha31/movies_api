import { RemoteSocket, Server, Socket } from 'socket.io'
import https from 'http'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

class IO {
    io

    constructor(server: https.Server) {
        this.io = new Server(server, {
            cors: {
                origin: ['https://admin.socket.io'],
                credentials: true,
            },
        })
        this.io.on('connection',async (socket) => {
            var connectedto :RemoteSocket<DefaultEventsMap, any> 
            await this.io.sockets.fetchSockets().then((res) => {
                res.forEach((e) => {
                    if (
                        socket.handshake.query.connecto ==
                        e.handshake.query.token
                    ) {
                        console.log('joined')
                        connectedto = e                    }
                })
            })

            //vol
            socket.on('vol', (data) => {
                console.log(data)
                connectedto.emit('vol', data)
            })
            //nav
            socket.on('nav', (data) => {
                console.log(data)
                connectedto.emit('nav', data)
            })
            //mute
            socket.on('mute', (data) => {
                console.log(data)
                connectedto.emit('mute', data)
            })
            //arrow
            socket.on('arrow', (data) => {
                console.log(data)
                connectedto.emit('arrow', data)
            })
            //seek
            socket.on('seek', (data) => {
                console.log(data)
                connectedto.emit('seek', data)
            })
            //prev
            socket.on('prev', (data) => {
                console.log(data)
                connectedto.emit('prev', data)
            })
            //next
            socket.on('next', (data) => {
                console.log(data)
                connectedto.emit('next', data)
            })
            //play
            socket.on('play', (data) => {
                console.log(data)
                connectedto.emit('play', data)
            })

            console.log('connected')
            socket.on('disconnect', () => {
                console.log('disconnected')
            })
        })
    }
}

export default IO
