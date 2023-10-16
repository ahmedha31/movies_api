import { default as axios } from 'axios'
import cheerio, { load } from 'cheerio'
import express from 'express'
import puppeteer from 'puppeteer'
import { exec } from 'node:child_process'
import { promises } from 'fs'
import { promisify } from 'node:util'
import getDown from '../../../middlewaer/getDown'
var https = require('https')
const router = express.Router()
const root = process.cwd()
var config = require(root + '/config.json')

router.get('/:id', async (req, res) => {
   getDown(req.params.id).then((data) => {
        res.redirect(200,data.link,)
    }).catch((err) => {
        res.status(500).json({
            status: false,
            msg: err.message,
        })
    })
})

router.get('/:id/info', async (req, res) => {
    getDown(req.params.id).then((data) => {
        res.send({
            name: data.name,
            link: data.link,
        })
        
    }).catch((err) => {
        res.send({
            status: false,
            msg: err.message,
        })
    })
})

router.get('/:id/links', async (req, res) => {
   axios.get(config.url + '/download/' + req.params.id + '/56151',{
    withCredentials: true,
    headers: {
   Cookie:"akwamVerification3=eyJpdiI6Ikp3Wk9nc0MxbHdiOGsrK2N0V0M2RHc9PSIsInZhbHVlIjoiaVwvMEpqbXJBYVVRNGtVU3ZJMlhkVXc9PSIsIm1hYyI6Ijg5ZTliZjdjYjJiZjYwZTU4Y2IxM2EyNjA3N2E4NTlkMTJkYjRkMGY2MjIyZDQ4YTM1ODgwM2VmMTcxMzFlN2MifQ%3D%3D   "
   } }).then((data) => {
        const $ = cheerio.load(data.data)
        var rss = {
            link: $('.link.btn.btn-light').attr('href'),
            name: $('a[download]').last().text().split('.AKWAM.')[0],
        }
        res.send(rss)
    }).catch((err) => {
        res.status(500).json({
            status: false,
            msg: err.message,
        })
    }
    )

}
)


module.exports = router
