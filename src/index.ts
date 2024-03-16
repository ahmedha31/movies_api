require('dotenv').config()
import express from 'express'
import cors from 'cors'
const app = express()
import https from 'http'
import passport from 'passport'
const server = https.createServer(app).setMaxListeners(0)
import bodyParser from 'body-parser'
const port = process.env.PORT || 3333
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { isAuth } from './middlewaer/Auth'
import { Usermodel } from './database/models/usermodel'
import IO from './io'
const LocalStrategy = require('passport-local').Strategy
import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { getMovie } from './routers/APIs/V1/movies' // Import the getMovie function correctly
import puppeteer from 'puppeteer'
const root = process.cwd()
var config = require(root + '/config.json')

const prisma = new PrismaClient()
app.use(cors({ origin: '*', credentials: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.static('web'))
app.use(
    session({
        secret: process.env.JWT_SCERET!,
        cookie: {
            maxAge: 60000 * 60 * 24,
        },
        saveUninitialized: false,
        resave: false,
        name: 'AH1_MOVIES_APP',
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))

app.use((req, _res, next) => {
    console.log(req.url)

    next()
})

passport.use(
    new LocalStrategy(function (
        username: any,
        password: any,
        done: (arg0: Error | null, arg1: boolean | undefined) => any
    ) {
        Usermodel.findOne(
            { username: username },
            function (err: Error, user: any) {
                if (err) {
                    return done(err, false)
                }
                if (user) {
                    if (user['password'] == password) {
                        user['password'] = undefined
                        return done(null, user)
                    } else {
                        return done(new Error('Password Error'), false)
                    }
                }
            }
        )
    })
)

app.use('/auth', require('./routers/Auth'))
app.use('/', require('./routers/APIs'))

server.listen(port, async () => {
    new IO(server)
    console.log(`🚀 Server is running on port ${port}`)
    var speed = Number.parseInt(process.argv[2]) || 10
    var start = Number.parseInt(process.argv[3]) || 0


    if (true) {
        await puppeteer.launch({ headless: false }).then(async (browser): Promise<void> => {
            console.log("Browser is ready")
            config.browser = browser.wsEndpoint()
        })


        console.log("Starting to get movies with speed of " + speed + " and starting from " + start)
        var aa = Array.from({ length: 1000 }, (_, i) => i + start )
        for (let index = 0; index < aa.length; index += speed) {
            await Promise.all(
                aa.slice(index, index + speed).map(async (i) => {
                    await getMovie(i).then((res) => {
                        console.log(res.info.title, "✅")
                    }).catch((err) => {
                        console.log(i, "❌",err)
                    })
                })
            )
        }

    }

})
