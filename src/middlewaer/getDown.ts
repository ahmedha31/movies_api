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

export default async function (id: string): Promise<{
    name: string
    link: string
}> {
    const { stdout: chromiumPath } = await promisify(exec)('which chromium')

    const browser = await puppeteer.launch({
        headless: "new",
        userDataDir: './tmp',
        waitForInitialPage: true,
        executablePath: chromiumPath.trim(),
        timeout: 0,
        args: [
            //  '--proxy-server=192.168.1.9:44355',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    })

    const page = await browser.pages().then((pages) => pages[0])
    await page.goto(config.url + '/download/' + id + '/56151')
    const html = await page.content()
    const title = await page.title()
    if (!title.startsWith('تحق')) {
        const $ = cheerio.load(html)
        var rss = {
            link: $('.link.btn.btn-light').attr('href'),
            name: $('a[download]').last().text().split('.AKWAM.')[0],
        }
        await browser.close()
        return {
            name: rss.name,
            link: rss.link!,
        }
    } else {
        throw  new Error('App Need to get Verify')
    }
}
