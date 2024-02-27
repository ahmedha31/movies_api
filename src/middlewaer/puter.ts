import { load } from 'cheerio'
import puppeteer, { Browser } from 'puppeteer'

class App {
    private browser!: Browser
    private static conn: string
    constructor() {}
    static async getdownloadlink(id: string) {
        const browser = await puppeteer
            .connect({ browserWSEndpoint: this.conn })
            .then((browser) => browser)
            .catch((err) => {
                return this.launch(false)
                    .then((browser) => {
                        return browser
                    })
                    .catch((err) => {
                        throw new Error(err.message)
                    })
            })

        const page = await browser.pages().then((pages) => pages[0])
// cerate a random number frpm 6 numbers
        const random = Math.floor(Math.random() * 1000000) + 1
        await page.goto('https://akwam.us' + '/download/' + id + '/' + random, {
            waitUntil: 'load',
            timeout: 0,
        })
        const title = await page.title()
        if (!title.startsWith('تحق')) {
            const html = await page.content()
            const $ = load(html)
            var rss = {
                link: $('.link.btn.btn-light').attr('href'),
                name: $('a[download]').last().text().split('.AKWAM.')[0],
            }

            browser.disconnect()
            return {
                name: rss.name,
                link: rss.link,
            }
        } else if (title.startsWith('تحق')) {
            console.log('Page need auth!')
            await this.auth(id)
                .then((data) => {
                    return data
                })
                .catch((err) => {
                    return {
                        status: false,
                        msg: err.message,
                    }
                })
        } else if (title.includes('404')) {
            browser.disconnect()
            throw new Error('404')
        }
    }
    static async launch(type: boolean | 'new') {
        const browser = await puppeteer.launch({
            headless: type,
            userDataDir: './tmp',
            waitForInitialPage: true,
            timeout: 0,

            args: [
                '--user-data-dir=./tmp',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-extensions',
                '--disable-dev-shm-usage',
                '--disable-software-rasterizer',
                '--disable-breakpad',
                '--disable-features=TranslateUI',
                '--disable-features=site-per-process',
                '--disable-features=IsolateOrigins',
            ],
        })
        this.conn = browser.wsEndpoint()
        console.log(this.conn)
        return browser
    }
    static async auth(id: string) {
        const browser = await puppeteer
            .connect({ browserWSEndpoint: this.conn })
            .then((browser) => browser)
        const page = await browser.pages().then((pages) => pages[0])
        const random = Math.floor(Math.random() * 1000000) + 1

        await page.goto('https://akwam.us' + '/download/' + id + '/'+random, {
            waitUntil: 'load',
            timeout: 0,
        })

        await page
            .waitForNavigation({
                waitUntil: 'load',
                timeout: 0,
            })
            .then(async () => {
                console.log('Page loaded!')
                const html = await page.content()
                const $ = load(html)
                var rss = {
                    link: $('.link.btn.btn-light').attr('href'),
                    name: $('a[download]').last().text().split('.AKWAM.')[0],
                }

                browser.disconnect()
                return {
                    status: true,
                    msg: 'Comfirmtion Done',
                    data: rss,
                }
            })
    }
}

export default App
