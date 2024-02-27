const router = require('express').Router()
import passport from 'passport'
import { Usermodel } from '../../database/models/usermodel'

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((id, done) => {
    Usermodel.findById(id, (err: any, user: boolean | Express.User) => {
        done(err, user)
    })
})

router.post(
    '/',
    async (
        req: { body: any },
        res: {
            status: (arg0: number) => {
                (): any
                new (): any
                json: {
                    (arg0: {
                        status: boolean
                        message: string
                        error?: any
                        user?: any
                    }): void
                    new (): any
                }
            }
        }
    ) => {
        var user = req.body
        user['userid'] = (await Usermodel.collection.count({})) + 1

        Usermodel.create(user, (err: any, user: { [x: string]: any }) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: 'Not auth',
                    error: err,
                    
                })
            } else {
                user['password'] = undefined
                res.status(200).json({
                    status: true,
                    message: 'auth',
                    user: user,
                })
            }
        })
    }
)

router.post(
    '/login',
    (
        req: { logIn: (arg0: any, arg1: (err: any) => void) => void },
        res: {
            status: (arg0: number) => {
                (): any
                new (): any
                json: {
                    (arg0: {
                        status: boolean
                        message: string
                        error?: any
                        user?: any
                    }): void
                    new (): any
                }
            }
        }
    ) => {
        passport.authenticate('local', (err: { message: any }, user: { username: any }, info: any) => {
            if (err) {
                res.status(403).json({
                    status: false,
                    message: 'Not auth',
                    error: err.message,
                })
            } else {
                req.logIn(user, (err: { stack: any }) => {
                    if (err) {
                        console.log(err)
                        res.status(401).json({
                            status: false,
                            message: 'Not auth',
                            error: err.stack,
                        })
                    } else {
                        res.status(200).json({
                            status: true,
                            message: `You have been logged in Successfully with ${user.username}`,
                            user: user,
                        })
                    }
                })
            }
        })(req, res)
    }
)
router.delete(
    '/',
    function (
        req: { logout: (arg0: (err: any) => any) => void },
        res: {
            status: (arg0: number) => {
                (): any
                new (): any
                json: {
                    (arg0: { status: boolean; message: string }): void
                    new (): any
                }
            }
        },
        next: (arg0: any) => any
    ) {
        req.logout(function (err: any) {
            if (err) {
                return next(err)
            }
            res.status(200).json({
                status: true,
                message: 'You have been logged out Successfully',
            })
        })
    }
)

module.exports = router
