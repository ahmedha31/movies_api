const axios = require('axios').default
import cheerio from 'cheerio'
import express from 'express'
const router = express.Router()
import { GetMovie, DownLoad } from '../../../middlewaer/getdetails'
const root = process.cwd()
var config = require(root + '/config.json')
import { PrismaClient } from '@prisma/client'
import { AxiosError } from 'axios'
const prisma = new PrismaClient()
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
        await prisma.movie
            .findFirst({
                where: {
                    id: parseInt(req.params.id),
                },
                include: {
                    category: true,
                    actors: true,
                    download: true,
                },
            })
            .then(async (v) => {
                if (v) {
                    res.send({
                        status: true,
                        data: v,
                    })
                    return
                } else {
                    var rs = await axios.get(
                        config.url + '/movie/' + req.params.id
                    )
                    var $ = cheerio.load(rs.data)

                    var actors = $('.entry-box-3')
                        .map(function (i, elem) {
                            return {
                                id: parseInt(
                                    $(elem)
                                        .find('a')
                                        .attr('href')
                                        ?.split('/person/')[1]
                                        .split('/')[0]!
                                ),
                                name: $(elem).find('img').attr('alt')!,
                                image: $(elem).find('img').attr('src')!,
                            }
                        })
                        .get()

                    var downloads = DownLoad(rs.data)
                    var data = GetMovie(rs.data)
                    await prisma.movie
                        .create({
                            data: {
                                name: data.title,
                                id: parseInt(req.params.id),
                                image: data.image!,
                                reating: parseFloat(data.rating),
                                quality: data.quality,
                                description: data.description,
                                duration: data.duration,
                                year: parseInt(data.year ?? '0'),
                                country: data.country,
                                language: data.language,
                                translate: data.translate,
                                trailer: data.trailer,
                                category: {
                                    connectOrCreate: data.category.map((v) => {
                                        return {
                                            where: {
                                                id: v.id,
                                            },
                                            create: {
                                                id: v.id,
                                                name: v.name,
                                            },
                                        }
                                    }),
                                },
                                actors: {
                                    connectOrCreate: actors.map((v) => {
                                        return {
                                            where: {
                                                id: v.id,
                                            },
                                            create: {
                                                id: v.id,
                                                name: v.name,
                                                image: v.image,
                                            },
                                        }
                                    }),
                                },
                                download: {
                                    connectOrCreate: downloads.map((v) => {
                                        return {
                                            where: {
                                                id: v.id,
                                            },
                                            create: {
                                                id: v.id,
                                                name: v.name,
                                                quality: v.quality,
                                                size: v.size,
                                            },
                                        }
                                    }),
                                },
                            },
                        })
                        .then((v) => {
                            console.log(
                                'New Movie Added to DB Wih ID: ' +
                                    v.id +
                                    ' With Name: ' +
                                    v.name
                            )
                        })
                    res.send({
                        status: true,
                        info: data,
                        actors: actors,
                        downloads: downloads,
                    })
                    return
                }
            })
    } catch (e) {
        res.status(500).json({
            status: false,
            msg: 'Something went wrong',
            err: e,
        })
        return
    }
})

module.exports = router
