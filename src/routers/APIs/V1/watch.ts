import { default as axios } from 'axios'
import cheerio from 'cheerio'
import express, { Request, Response } from 'express'
const router = express.Router()
import request from 'request'
import contentDisposition from 'content-disposition'
import https from 'https'
const root = process.cwd()
var config = require(root + '/config.json')
router.get('/:id', async (req: Request, res: Response) => {
    var rs = await axios.get(
        config.url + '/download/' + req.params.id + '/56151'
    )
    var $ = cheerio.load(rs.data)
    var rss = {
        link: $('.link.btn.btn-light').attr('href'),
        name: $('meta')
            .filter(function (i: any, el: any) {
                return $(el).attr('property') === 'og:title'
            })
            .last()
            .attr('content'),
    }
    const response = await axios.get(rss.link!, {
        responseType: 'stream',
        headers: {
            Range: req.headers.range ?? 0,
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    })
    response.headers['Content-Type'] = 'video/mp4'
    response.headers['Content-name'] = contentDisposition(rss.name)
    ;(response.headers['Content-Disposition'] = contentDisposition(rss.name)),
        res.writeHead(206, response.headers)
    response.data.on('data', (data: any) => {
        res.write(data)
    })
    console.log(rss.name)

    response.data.on('end', () => {
        console.log('stream done')
        res.end()
    })
    response.data.on('error', (err: any) => {
        console.log(err)
    })
})

module.exports = router
