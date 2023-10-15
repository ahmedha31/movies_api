"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class IO {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: ['https://admin.socket.io'],
                credentials: true,
            },
        });
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            var connectedto;
            yield this.io.sockets.fetchSockets().then((res) => {
                res.forEach((e) => {
                    if (socket.handshake.query.connecto ==
                        e.handshake.query.token) {
                        console.log('joined');
                        connectedto = e;
                    }
                });
            });
            //vol
            socket.on('vol', (data) => {
                console.log(data);
                connectedto.emit('vol', data);
            });
            //nav
            socket.on('nav', (data) => {
                console.log(data);
                connectedto.emit('nav', data);
            });
            //mute
            socket.on('mute', (data) => {
                console.log(data);
                connectedto.emit('mute', data);
            });
            //arrow
            socket.on('arrow', (data) => {
                console.log(data);
                connectedto.emit('arrow', data);
            });
            //seek
            socket.on('seek', (data) => {
                console.log(data);
                connectedto.emit('seek', data);
            });
            //prev
            socket.on('prev', (data) => {
                console.log(data);
                connectedto.emit('prev', data);
            });
            //next
            socket.on('next', (data) => {
                console.log(data);
                connectedto.emit('next', data);
            });
            //play
            socket.on('play', (data) => {
                console.log(data);
                connectedto.emit('play', data);
            });
            console.log('connected');
            socket.on('disconnect', () => {
                console.log('disconnected');
            });
        }));
    }
}
exports.default = IO;
