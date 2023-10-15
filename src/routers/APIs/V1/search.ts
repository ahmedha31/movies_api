import { default as axios } from 'axios'
import cheerio from 'cheerio'
import express from 'express'
const router = express.Router()
const root = process.cwd()
var config = require(root + '/config.json')
router.get('/info', async (req, res) => {
    try {
        var rs = await axios.get(config.url + '/search')
        var $ = cheerio.load(rs.data)
        var data = {
            category: [
                {
                    name: 'الأقسام',
                    value: '0',
                },
                {
                    name: 'افلام',
                    value: 'movie',
                },
                {
                    name: 'مسلسلات',
                    value: 'series',
                },
            ],

            year: $('#filter')
                .children()
                .last()
                .children()
                .eq(1)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return {
                        name: $(elem).text(),
                        value: $(elem).val(),
                    }
                })
                .get(),
            rating: $('#filter')
                .children()
                .last()
                .children()
                .eq(2)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return {
                        name: $(elem).text(),
                        value: $(elem).val(),
                    }
                })
                .get(),
            quality: $('#filter')
                .children()
                .last()
                .children()
                .eq(3)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return {
                        name: $(elem).text(),
                        value: $(elem).val(),
                    }
                })
                .get(),
            resolution: $('#filter')
                .children()
                .last()
                .children()
                .eq(4)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return {
                        name: $(elem).text(),
                        value: $(elem).val(),
                    }
                })
                .get(),
        }

        res.send({
            status: true,
            info: data,
        })
    } catch (err: any) {
        res.send({
            status: false,
            data: err.message,
        })
    }
})

router.get('/:name', async (req, res) => {
    try {
        var rs = await axios.get(config.url + '/search', {
            params: {
                q: req.params.name,
                section: req.query.section,
                year: req.query.year,
                rating: req.query.rating,
                formats: req.query.formats,
                quality: req.query.quality,
                page: req.query.page,
            },
        })
        var $ = cheerio.load(rs.data)
        var data = $('.page.page-search')
            .children()
            .last()
            .children()
            .find('.widget-body.row')
            .children()
            .map(function (i, elem) {
                return {
                    title: $(elem).find('.entry-title').children().text(),
                    link: $(elem)
                        .find('.actions')
                        .children()
                        .first()
                        .attr('href'),
                    Image: $(elem)
                        .find('.entry-image')
                        .find('img')
                        .attr('data-src'),
                    type: $(elem)
                        .find('.actions')
                        .children()
                        .last()
                        .attr('data-type'),
                    id: $(elem)
                        .find('.actions')
                        .children()
                        .last()
                        .attr('data-id'),
                    date: $(elem).find('span.badge.badge-secondary').text(),
                    rating: $(elem).find('.label.rating').text(),
                    quality: $(elem).find('.label.quality').text(),
                    category: $(elem)
                        .find('span.badge.badge-light')
                        .map(function (i, elem) {
                            return $(elem).text()
                        })
                        .get(),
                }
            })
            .get()
            .sort((a, b) => {
                return a.title.localeCompare(b.title)
            })
        if (data.length === 0) {
            throw new Error('No Items Found')
        }
        var movies = data.filter((item) => {
            return item.type === 'movie'
        })
        var series = data.filter((item) => {
            return item.type === 'series'
        })

        res.send({
            status: true,
            page: parseInt($('nav.mt-5').find('.page-item.active').text()),
            pages: parseInt(
                $('nav.mt-5').find('.page-item').last().prev().text()
            ),
            data: {
                movies: movies,
                series: series,
            },
        })
    } catch (err: any) {
        res.send({
            status: false,
            msg: err.message,
            data: {
                movies: [],
                series: [],
            },
            err: err,
        })
    }
})

module.exports = router
