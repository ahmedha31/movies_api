"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const passport_1 = __importDefault(require("passport"));
const server = http_1.default.createServer(app).setMaxListeners(0);
const body_parser_1 = __importDefault(require("body-parser"));
const port = process.env.PORT || 3333;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const usermodel_1 = require("./database/models/usermodel");
const io_1 = __importDefault(require("./io"));
const LocalStrategy = require('passport-local').Strategy;
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set('view engine', 'ejs');
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use(express_1.default.static('web'));
app.use((0, express_session_1.default)({
    secret: process.env.JWT_SCERET,
    cookie: {
        maxAge: 60000 * 60 * 24,
    },
    saveUninitialized: false,
    resave: false,
    name: 'AH1_MOVIES_APP',
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(passport_1.default.authenticate('session'));
app.use((req, _res, next) => {
    console.log(req.url);
    console.log('===========');
    next();
});
passport_1.default.use(new LocalStrategy(function (username, password, done) {
    usermodel_1.Usermodel.findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            if (user['password'] == password) {
                user['password'] = undefined;
                return done(null, user);
            }
            else {
                return done(new Error('Password Error'), false);
            }
        }
    });
}));
app.use('/auth', require('./routers/Auth'));
app.use('/', require('./routers/APIs'));
console.log(
// get os name
require('os').platform());
server.listen(port, () => {
    new io_1.default(server);
    console.log(`🚀 Server is running on port ${port}`);
});
