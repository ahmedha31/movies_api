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
import getDown from '../../../middlewaer/getDown'
const root = process.cwd()
var config = require(root + '/config.json')
router.get('/:id', async (req: Request, res: Response) => {
    getDown(req.params.id).then((data) => {
        res.redirect(data.link, 200)
    }).catch((err) => {
        res.send({
            status: false,
            msg: err.message,
        })
    }
    )
})

module.exports = router
