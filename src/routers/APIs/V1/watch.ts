import { default as axios } from 'axios'
import cheerio from 'cheerio'
import express, { Request, Response } from 'express'
const router = express.Router()
import { exec } from 'node:child_process'
import { promises } from 'fs'
import { promisify } from 'node:util'
import contentDisposition from 'content-disposition'
import https from 'https'
import puppeteer from 'puppeteer'
const root = process.cwd()
var config = require(root + '/config.json')
router.get('/:id', async (req: Request, res: Response) => {
    const { stdout: chromiumPath } = await promisify(exec)("which chromium");

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './tmp',
        waitForInitialPage: true,
      executablePath: chromiumPath.trim(),
        timeout: 0,
        args: [
           // '--proxy-server=192.168.1.9:44355',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    })
  
   
    const page = await browser.pages().then((pages) => pages[0])
    await page.goto(config.url + '/download/' + req.params.id + '/56151')
    const html = await page.content()
    const title = await page.title()
    if (!title.startsWith('تحق')) {
        const $ = cheerio.load(html)
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
    } else {
        res.send({
            status: false,
            message: 'app need  to verify',
        })
  
    }
})

module.exports = router
