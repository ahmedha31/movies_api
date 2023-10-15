import { default as axios } from 'axios'
import cheerio, { load } from 'cheerio'
import express from 'express'
import puppeteer from 'puppeteer'
import { exec } from 'node:child_process'
import fs, { promises } from 'fs'
import { promisify } from 'node:util'
var https = require('https')
const router = express.Router()
const root = process.cwd()
var config = require(root + '/config.json')

export default async function (id: string): Promise<{
    name: string
    link: string
}> {

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './tmp',
        waitForInitialPage: true,
        timeout: 0,
        args: [
          //   '--proxy-server=192.168.1.9:44355',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    })

    const page = await browser.pages().then((pages) => pages[0])
    const cookiesBuffer = await fs.promises.readFile(root+'/cookies.json');
    const cookies = JSON.parse(cookiesBuffer.toString());
    await page.setCookie(...cookies);
    await page.goto(config.url + '/download/' + id + '/56151')
    const html = await page.content()
    const title = await page.title()
    if (!title.startsWith('تحق')) {
        const $ = cheerio.load(html)
        var rss = {
            link: $('.link.btn.btn-light').attr('href'),
            name: $('a[download]').last().text().split('.AKWAM.')[0],
        }
        const cookies = await page.cookies();
         fs.writeFileSync(root +'/cookies.json',
              JSON.stringify(cookies, null, 2));
        await browser.close()
        return {
            name: rss.name,
            link: rss.link!,
        }
    } else {
        throw  new Error('App Need to get Verify')
    }
}
