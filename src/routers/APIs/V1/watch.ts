import { AxiosRequestHeaders, default as axios } from 'axios'
import express, { Request, Response } from 'express'
const router = express.Router()
import contentDisposition from 'content-disposition'
import https from 'https'
import getDown from '../../../middlewaer/getDown'
const root = process.cwd()
var config = require(root + '/config.json')
router.get('/:id', async (req: Request, res: Response) => {
    getDown(req.params.id)
        .then((data) => {
            var vid = axios({
                method: 'get',
                url: data.link,
                responseType: 'stream',
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                }),
                
            })
        })
        .catch((err) => {
            res.send({
                status: false,
                msg: err.message,
            })
        })
})

module.exports = router
