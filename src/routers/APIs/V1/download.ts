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
        res.redirect(data.link,200)
    }).catch((err) => {
        res.send({
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

module.exports = router
