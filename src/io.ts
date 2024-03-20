import { RemoteSocket, Server, Socket } from 'socket.io'
import https from 'http'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import mongose from 'mongoose'
import { instrument } from '@socket.io/admin-ui'

class IO {
    static io: Server

    constructor(server: https.Server) {
        IO.io = new Server(server, {
            cors: {
                origin: ['https://admin.socket.io'],
                credentials: false,
            },
        })
        instrument(IO.io, {
            auth: {
                password: '$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS',
                username: 'admin',
                type: 'basic',
            },
            namespaceName: '/',
            
            mode: 'development',
        })
        IO.io.on('connection', async (socket) => {
         
            console.log('connected')
            socket.on('disconnect', () => {
                console.log('disconnected')
            })
        })
    }
}

export default IO
