import axios from 'axios'
import cheerio from 'cheerio'
import express from 'express'
const router = express.Router()
const vonfig = require('../../../package.json')
const root = process.cwd()
var config = require(root + '/config.json')
router.get('/', async (req, res) => {
    try {
        var rs = await axios.get(config.url + '/one')
        var $ = cheerio.load(rs.data)
        var movie: any = []
        var series: any = []
        $('.widget-4.widget.widget-style-1')
            .first()
            .find('.row')
            .children()
            .each(function (i, elem) {
                var ele: object = {
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
                movie.push(ele)
            })
        $('.widget-4.widget.widget-style-1')
            .eq(1)
            .find('.row')
            .children()
            .each(function (i, elem) {
                var ele = {
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
                    eCount: $(elem).find('.label.series').text(),
                    category: $(elem)
                        .find('span.badge.badge-light')
                        .map(function (i, elem) {
                            return $(elem).text()
                        })
                        .get(),
                }
                series.push(ele)
            })

        res.send({
            status: true,
            data: {
                movie,
                series,
            },
        })
    } catch (e: Error | any) {
        res.send({
            status: false,
            error: e.message,
        })
    }
})

router.get('/test', async (req, res) => {
    res.send({
        status: true,
        message: 'API is working',
        version: vonfig.version,
    })
})

router.use('/search', require('./V1/search'))
router.use('/movie', require('./V1/movies').router)
router.use('/series', require('./V1/series').router)
router.use('/episode', require('./V1/episode').router)
router.use('/download', require('./V1/download'))
router.use('/watch', require('./V1/watch'))

module.exports = router
