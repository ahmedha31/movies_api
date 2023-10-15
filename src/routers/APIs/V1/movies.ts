const axios = require('axios').default
import cheerio from 'cheerio'
import express from 'express'
const router = express.Router()
import { GetMovie, DownLoad } from '../../../middlewaer/getdetails'
const root = process.cwd()
var config = require(root + '/config.json')
router.get('/', async (req, res) => {
    try {
        const rs = await axios.get(config.url + '/movies', {
            params: {
                page: req.query.page,
            },
        })
        const $ = cheerio.load(rs.data)
        var movies = $('.entry-box')
            .map(function (i, elem) {
                return {
                    name: $(elem).find('.entry-title').children().text(),
                    id: $(elem)
                        .find('.entry-title')
                        .children()
                        .attr('href')
                        ?.toString()
                        .split('movie/')[1]
                        .split('/')[0],
                    image: $(elem)
                        .find('.entry-image')
                        .find('img')
                        .attr('data-src'),
                    date: $(elem).find('span.badge.badge-secondary').text(),
                    rating: $(elem).find('.label.rating').text(),
                    quality: $(elem).find('.label.quality').text(),
                    category: $(elem)
                        .find('span.badge.badge-light')
                        .map(function (i, elem) {
                            return $(elem).text()
                        })
                        .get(),
                    type: 'movie',
                }
            })
            .get()
        res.send({
            status: true,
            data: movies,
        })
    } catch (err) {
        res.send({
            status: false,
            msg: 'Something went wrong',
            err: err,
        })
    }
})

router.get('/new', async (req, res) => {
    try {
        var rs = await axios.get(config.url + '/one')
        var $ = cheerio.load(rs.data)
        var entry = $('.entry-box-2').eq(0)
        var data = {
            title: entry
                .find('.entry-body')
                .find('.entry-title')
                .children()
                .first()
                .text(),
            id: entry
                .find('.entry-body')
                .find('.entry-title')
                .children()
                .first()
                .attr('href')
                ?.toString()
                .split('movie/')[1]
                .split('/')[0],
            description: entry
                .find('.entry-body')
                .find('.entry-desc')
                .first()
                .text()
                .split('مشاهدة و تحميل فيلم ')[1],
            Image: entry.find('.entry-poster').find('img').attr('data-src'),
            banner: entry
                .attr('style')
                ?.toString()
                .split("background-image: url('")[1]
                .split("')")[0],
            rate: entry
                .find('.entry-body')
                .find('.label.rating')
                .first()
                .text(),
            quality: entry
                .find('.entry-body')
                .find('.label.quality')
                .first()
                .text(),
            type: 'movie',
        }
        res.send({
            status: true,
            data: data,
        })
    } catch (e) {
        res.send({
            status: false,
            msg: 'Something went wrong',
            err: e,
        })
    }
})

router.get('/:id', async (req, res) => {
    console.log(req.params)
    try {
        var rs = await axios.get(config.url + '/movie/' + req.params.id)
        var $ = cheerio.load(rs.data)

        var actors = $('.entry-box-3')
            .map(function (i, elem) {
                return {
                    id: i++,
                    name: $(elem).find('img').attr('alt'),
                    image: $(elem).find('img').attr('src'),
                }
            })
            .get()

        var downloads = DownLoad(rs.data)
        var data = GetMovie(rs.data)

        res.send({
            status: true,
            info: data,
            actors: actors,
            downloads: downloads,
        })
    } catch (e) {
        res.send({
            status: false,
            msg: 'something went wrong',
            err: e,
        })
    }
})

module.exports = router
