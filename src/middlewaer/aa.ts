// import cheerio, { load } from 'cheerio'
// import puppeteer from 'puppeteer'
// import { exec } from 'node:child_process'
// import fs, { promises } from 'fs'
// import { promisify } from 'node:util'
// const root = process.cwd()
// import express from 'express'
// const app = express()

// var conn = ''

// async function main(id: string) {
//     const browser = await puppeteer
//         .connect({ browserWSEndpoint: conn })
//         .then((browser) => browser)

//     const page = await browser.pages().then((pages) => pages[0])
//     var cookieas = fs.readFileSync(root + '/cookies.json', 'utf8')
//     var cookies = JSON.parse(cookieas)
//     await page.setCookie(...cookies)

//     await page.goto('https://akwam.us' + '/download/' + id + '/56151', {
//         waitUntil: 'load',
//         timeout: 0,
//     })
//     const title = await page.title()
//     if (!title.startsWith('تحق')) {
//         const html = await page.content()
//         const $ = load(html)
//         var rss = {
//             link: $('.link.btn.btn-light').attr('href'),
//             name: $('a[download]').last().text().split('.AKWAM.')[0],
//         }
//         const cookies = await page.cookies()
//         fs.writeFileSync(
//             root + '/cookies.json',
//             JSON.stringify(cookies, null, 2)
//         )

//         browser.disconnect()
//         return {
//             name: rss.name,
//             link: rss.link,
//         }
//     } else if (title.startsWith('تحق')) {
//         throw new Error('App need a cookies')
//     } else if (title.includes('404')) {
//         browser.disconnect()
//         throw new Error('404')
//     }
// }
// app.get('/auth', async (req, res) => {
//     const browser =await launach(false)

// const page = await browser.pages().then((pages) => pages[0])

// await page.goto('https://akwam.us' + '/download/' + "78895" + '/56151', {
//     waitUntil: 'load',
//     timeout: 0,
// })

// await page
//        .waitForNavigation({
//            waitUntil: 'load',
//            timeout: 0,
//        })
//        .then(async() => {
//         console.log('Page loaded!');
//          const html = await page.content()
//          const $ = load(html)
//          var rss = {
//              link: $('.link.btn.btn-light').attr('href'),
//              name: $('a[download]').last().text().split('.AKWAM.')[0],
//          }
//         const cookies = await page.cookies()
//         fs.writeFileSync(
//             root + '/cookies.json',
//             JSON.stringify(cookies, null, 2)
//         )

//        browser.disconnect()
//          res.send({
//                 status: true,
//                 msg: "Comfirmtion Done",
//                 data: rss
//             })
//          })
//       });

// app.get('/:id', async (req, res) => {
//     var id = req.params.id
//     if (!id) return res.send('no id')
//     console.log('try to get :' + id)
//     var rss = await main(id).then((data) => {
//         return data
//     }).catch((err) => {
//         res.status(500).send(err.message)
//     }
// )
//     res.send(rss)
// })
// app.get('/', async (req, res) => {
//     res.send('hi')
// })




// app.listen(3000, async () => {
//     console.log('server started')
//     launach("new")
// })

// async function launach(type :any) {
//     const browser = await puppeteer.launch({
//         headless: type,
//         userDataDir: './tmp',
//         waitForInitialPage: true,
//         timeout: 0,

//         args: [
//              '--proxy-server=192.168.1.9:44355',
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//         ],
//     })
//     conn = browser.wsEndpoint()
//     console.log(conn)
//     return browser
// }


// export default launach