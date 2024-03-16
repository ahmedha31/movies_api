const axios = require('axios').default
import cheerio from 'cheerio'
import express from 'express'
const router = express.Router()
import { GetMovie, DownLoad } from '../../../middlewaer/getdetails'
const root = process.cwd()
var config = require(root + '/config.json')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { AxiosError } from 'axios'
import { slack } from '../../../utils/slack'
import { MovieType } from '.'
import puppeteer from 'puppeteer'
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
    interface NewMovieStatus {
        status: boolean
        msg?: string
        err?: string
    }

    interface NewMovieData {
        title: string
        id: string | undefined
        description: string | undefined
        image: string | undefined
        banner: string | undefined
        rate: string | undefined
        quality: string
        type: string
    }

    interface NewMovie extends NewMovieStatus {
        data: NewMovieData
    }
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
            description:
                entry
                    .find('.entry-body')
                    .find('.entry-desc')
                    .first()
                    .text()
                    .split(
                        entry
                            .find('.entry-body')
                            .find('.entry-title')
                            .children()
                            .first()
                            .text()!
                    )[1] ?? 'No Description',
            image: entry.find('.entry-poster').find('img').attr('data-src'),
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
        var movie: NewMovie = {
            status: true,
            data: data,
        }
        res.send(movie)
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
    interface MovieStatus {
        status: boolean
    }

    interface Info {
        title: string
        image: string
        description: string
        rating: string
        language: string
        translate: string
        quality: string
        country: string
        year: string
        duration: string
        category: string[]
        trailer: string
    }

    interface Actor {
        id: number
        name: string
        image: string
    }

    interface Downloads {
        name: string
        size: string
        quality: string
        id: number
        url: string
        download: string
    }

    interface Movie extends MovieStatus {
        info: Info
        actors: Actor[]
        downloads: Downloads[]
    }
    await getMovie(parseInt(req.params.id))
        .then((v) => {
            var movie: Movie = {
                status: true,
                info: v.info,
                actors: v.actors,
                downloads: v.downloads,
            }
            res.send(movie)
        })
       
})


async function getMovie(id: number): Promise<MovieType> {

        var ress = await prisma.movie
            .findFirst({
                where: {
                    id: id,
                },
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                    actors: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    download: true,
                },
            })
            .then(async (v) => {
                if (v) {
                    return v
                } else {
                    // var rs = await axios.get(config.url + '/movie/' + id)
                    // var $ = cheerio.load(rs.data)
                  var browser =  await puppeteer.connect({
                        browserWSEndpoint: config.browser,
                    })
                    var page = await browser.newPage()
                    await page.goto(config.url + '/movie/' + id)
                    var rs = await page.content()
                    var $ = cheerio.load(rs)
                    await page.close()



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

                    var downloads = DownLoad(rs)
                    var data = GetMovie(rs)
                    return await prisma.movie
                        .create({
                            data: {
                                name: data.title,
                                id: id,
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
                        .then(async (v) => {
                            console.log(
                                'New Movie Added to DB Wih ID: ' +
                                v.id +
                                ' With Name: ' +
                                v.name
                            )
                            await slack.send({
                                
                                    "blocks": [
                                        {
                                            "type": "section",
                                            "text": {
                                                "type": "plain_text",
                                                "text": "New Movie Added to DB",
                                                "emoji": true
                                            }
                                        },
                                        {
                                            "type": "section",
                                            "text": {
                                                "type": "plain_text",
                                                "text": "New Movie Added to DB Wih ID: " + v.id,
                                                "emoji": true
                                            }
                                        },
                                        {
                                            "type": "section",
                                            "text": {
                                                "type": "plain_text",
                                                "text": "With Name: " + v.name,
                                                "emoji": true
                                            }
                                        },
                                        {
                                            "type": "section",
                                            "text": {
                                                "type": "mrkdwn",
                                                "text": v.description ?? 'No Description'
                                            },
                                            "accessory": {
                                                "type": "image",
                                                "image_url": v.image,
                                                "alt_text": "cute cat"
                                            }
                                        }
                                    ]
                                
                            })
                            return await prisma.movie
                                .findFirst({
                                    where: {
                                        id: id,
                                    },
                                    include: {
                                        category: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                        actors: {
                                            select: {
                                                id: true,
                                                name: true,
                                                image: true,
                                            },
                                        },
                                        download: true,
                                    },
                                })
                                .then((v) => {
                                    return v
                                })
                        })

                }
            })
        var movie: MovieType = {
            status: true,
            info: {
                title: ress!.name,
                image: ress!.image,
                description: ress!.description ?? 'No Description',
                rating: ress!.reating!.toString(),
                language: ress!.language ?? 'No Language',
                translate: ress!.translate ?? 'No Translate',
                quality: ress!.quality ?? 'No Quality',
                country: ress!.country ?? 'No Country',
                year: ress!.year?.toString() ?? 'No Year',
                duration: ress!.duration ?? 'No Duration',
                category: ress!.category.map((v) => {
                    return v.name
                }),
                trailer: ress!.trailer ?? '',
            },
            actors: ress!.actors.map((v) => {
                return {
                    id: v.id,
                    name: v.name,
                    image: v.image,
                }
            }),
            downloads: ress!.download.map((v) => {
                return {
                    name: v.name,
                    size: v.size,
                    quality: v.quality,
                    id: v.id,
                    url: config.url + '/download/' + v.id,
                    download: config.url + '/download/' + v.id,
                }
            }),
        }
        return movie
   
}


export {getMovie,router}