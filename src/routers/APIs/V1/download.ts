import { default as axios } from 'axios'
import cheerio, { load } from 'cheerio'
import express from 'express'
import puppeteer from 'puppeteer'
import { exec } from 'node:child_process'
import { promises } from 'fs'
import { promisify } from 'node:util'
var https = require('https')
const router = express.Router()
const root = process.cwd()
var config = require(root + '/config.json')

router.get('/:id', async (req, res) => {
    var rs = await axios.get(
        config.url + '/download/' + req.params.id + '/56151'
    )
    var $ = cheerio.load(rs.data)
    var rss = {
        link: $('.link.btn.btn-light').attr('href'),
        name: $('a[download]').last().text().split('.AKWAM.')[0],
    }
    const response = await axios.get(rss.link!, {
        responseType: 'stream',
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    })
    const stream = response.data
    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'content-name': rss.name + '.mp4',
        'Content-Disposition': `attachment; filename=${rss.name}.mp4`,
        'content-length': response.headers['content-length'],
    })
    stream.on('data', (data: any) => {
        res.write(data)
    })

    stream.on('end', () => {
        res.end()
        console.log('stream done')
    })
})

router.get('/:id/info', async (req, res) => {
    // config.url + '/download/' + req.params.id + '/56151',
    //const { stdout: chromiumPath } = await promisify(exec)("which chromium");

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './tmp',
        waitForInitialPage: true,
        //     executablePath: chromiumPath.trim(),
        timeout: 0,
        args: [
            '--proxy-server=192.168.1.9:44355',
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
            name: $('a[download]').last().text().split('.AKWAM.')[0],
        }
        await browser.close()
        res.json({
            name: rss.name,
            link: rss.link,
            size: 0,
        })
    } else {
        res.json({
            status: false,
            msg: 'app need verification',
        })
    }
})

module.exports = router
