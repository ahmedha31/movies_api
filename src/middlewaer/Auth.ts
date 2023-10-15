import { NextFunction, Request, Response } from 'express'

export async function isAuth(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.user)
        if (req.user) {
            next()
        } else {
            res.status(401).json({
                status: false,
                message: 'Not auth',
                error: 'Not auth',
            })
        }
    } catch (e) {
        res.status(401).json({
            status: false,
            message: 'Not auth',
            error: e,
        })
    }
}
