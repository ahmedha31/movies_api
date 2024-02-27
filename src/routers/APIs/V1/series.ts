import { default as axios } from 'axios'
import { load } from 'cheerio'
import express from 'express'
const router = express.Router()
import { getseries } from '../../../middlewaer/getdetails'
import { PrismaClient } from '@prisma/client'
const Prisma = new PrismaClient()
const root = process.cwd()
var config = require(root + '/config.json')
router.get('/', async (req, res) => {
    try {
        const rs = await axios.get(config.url + '/series', {
            params: {
                page: req.query.page,
            },
        })
        const $ = load(rs.data)
        var search = {
            section: $('#filter')
                .children()
                .children()
                .eq(0)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return { name: $(elem).text(), value: $(elem).val() }
                })
                .get(),

            category: $('#filter')
                .children()
                .children()
                .eq(1)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return { name: $(elem).text(), value: $(elem).val() }
                })
                .get(),

            rating: $('#filter')
                .children()
                .children()
                .eq(2)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return { name: $(elem).text(), value: $(elem).val() }
                })
                .get(),

            year: $('#filter')
                .children()
                .children()
                .eq(3)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return { name: $(elem).text(), value: $(elem).val() }
                })
                .get(),

            language: $('#filter')
                .children()
                .children()
                .eq(4)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return { name: $(elem).text(), value: $(elem).val() }
                })
                .get(),

            quality: $('#filter')
                .children()
                .children()
                .eq(5)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return { name: $(elem).text(), value: $(elem).val() }
                })
                .get(),

            resolution: $('#filter')
                .children()
                .children()
                .eq(6)
                .find('select')
                .children()
                .map(function (i, elem) {
                    return { name: $(elem).text(), value: $(elem).val() }
                })
                .get(),
        }
        var series = $('.entry-box')
            .map(function (i, elem) {
                return {
                    name: $(elem).find('.entry-title').children().text(),
                    id: $(elem)
                        .find('.entry-title')
                        .children()
                        .attr('href')
                        ?.toString()
                        .split('series/')[1]
                        .split('/')[0],
                    image: $(elem)
                        .find('.entry-image')
                        .find('img')
                        .attr('data-src'),
                    date: $(elem).find('span.badge.badge-secondary').text(),
                    rating: $(elem).find('.label.rating').text(),
                    quality: $(elem).find('.label.quality').text(),
                    eConut: $(elem).find('.label.series').text(),
                    category: $(elem)
                        .find('span.badge.badge-light')
                        .map(function (i, elem) {
                            return $(elem).text()
                        })
                        .get(),
                    type: 'series',
                }
            })
            .get()
        res.send({
            status: true,
            search: search,
            data: series,
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
        var $ = load(rs.data)
        var entry = $('.entry-box-2').eq(1)
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
                .split('series/')[1]
                .split('/')[0],
            description: entry
                .find('p.entry-desc')
                .text()
                .split('مشاهدة و تحميل مسلسل')[1],
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
            type: 'series',
        }
        res.send({
            status: true,
            data: data,
        })
    } catch (err) {
        res.send({
            status: false,
            msg: 'Something went wrong',
            err: err,
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        await Prisma.serie
            .findFirst({
                where: {
                    id: Number.parseInt(req.params.id),
                },
                include: {
                    episodes: {
                        orderBy: {
                            episode: 'asc',
                        },
                        include: {
                            download: {
                                select:{
                                    id:true,
                                    name:true,
                                    size:true,
                                    quality:true,

                                }
                            },
                        },
                    },
                    actors: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    category:{
                        select:{
                            name:true,
                            id:true
                        }
                    }
                },
            })
            .then((data) => {
                if (data) {
                    res.send({
                        status: true,
                        data: data,
                    })
                    console.log('data from db')
                    return
                } else {
                    throw { status: 404 }
                }
            })
            .catch(async (err) => {
                var rs = await axios.get(
                    config.url + '/series/' + req.params.id
                )
                var $ = load(rs.data)
                console.log(
                    $('#series-episodes').find('.row').children().length
                )
                if ($('#series-episodes').length === 1) {
                    var episodes = $('#series-episodes')
                        .eq(0)
                        .find('.widget-body')
                        .children()
                        .children()
                        .map(function (i, ele) {
                            var elem = $(ele).find('a').first()
                            console.log($(elem).text().split(' : ')[0])

                            return {
                                name: $(elem).text().split(' : ')[0],
                                cont:parseInt($(elem).text().split(' : ')[0].split('حلقة ')[1]),
                                image: $(ele).find('img').attr('src'),
                                id: $(elem)
                                    .attr('href')
                                    ?.toString()
                                    .split('episode/')[1]
                                    .split('/')[0],
                            }
                        })
                        .get()
                        .reverse()
                } else if ($('#series-episodes').length === 2) {
                    var sessions = $('#series-episodes')
                        .eq(0)
                        .children()
                        .last()
                        .children()
                        .map(function (i, elem) {
                            return {
                                name: $(elem).text().split(' الموسم ')[0],
                                session: $(elem).text().split(' الموسم ')[1],
                                id: $(elem)
                                    .attr('href')
                                    ?.toString()
                                    .split('/series/')[1]
                                    .split('/')[0],
                            }
                        })
                        .get()
                    var episodes = $('#series-episodes')
                        .eq(1)
                        .find('.widget-body')
                        .children()
                        .children()
                        .map(function (i, ele) {
                            var elem = $(ele).find('a').first()
                            console.log($(elem).text().split(' : ')[0].split('الحلقة ')[1])
                            return {
                                name: $(elem).text().split(' : ')[0],
                                cont:parseInt($(elem).text().split(' : ')[0].split('حلقة ')[1]),
                                image: $(ele).find('img').attr('src'),
                                id: $(elem)
                                    .attr('href')
                                    ?.toString()
                                    .split('episode/')[1]
                                    .split('/')[0],
                            }
                        })
                        .get().sort((a,b)=>a.id! > b.id! ? 1 : -1)
                        .reverse()
                }
                var actors = $('.entry-box-3')
                    .map(function (i, elem) {
                        return {
                            id: i++,
                            name: $(elem).find('.entry-title').text(),
                            image: $(elem).find('img').attr('src'),
                        }
                    })
                    .get()

                const detail = getseries(rs.data)
                console.log(parseInt(detail.sesson!))

                // res.send({
                //     status: true,
                //     detail: detail,
                //     sessions: sessions!,
                //     episodes: episodes!,
                //     actors: actors,
                // })
                var reees = await Prisma.serie.create({
                    data: {
                        id: parseInt(req.params.id),
                        name: detail.name,
                        description: detail.description,
                        image: detail.image || '',
                        banner: detail.banner,
                        reating: detail.rating,
                        quality: detail.quality,
                        language: detail.language,
                        translate: detail.translate,
                        year: detail.year,
                        country: detail.country,
                        category: {
                            connectOrCreate: detail.category.map((x) => {
                                return {
                                    where: {
                                        id: x.id,
                                    },
                                    create: {
                                        id: x.id,
                                        name: x.name,
                                    },
                                }
                            }),
                        },
                        episodes: {
                            connectOrCreate: episodes!.map((x) => {
                                return {
                                    where: {
                                        id: parseInt(x.id!),
                                    },
                                    create: {
                                        id: parseInt(x.id!),
                                        name: x.name,
                                        episode: x.cont,
                                        image: x.image!,
                                    },
                                }
                            }),
                        },
                        actors: {
                            connectOrCreate: actors.map((x) => {
                                return {
                                    where: {
                                        id: x.id,
                                    },
                                    create: {
                                        id: x.id,
                                        name: x.name,
                                        image: x.image!,
                                    },
                                }
                            }),
                        },
                        trailer: detail.trailer,
                    },
                }).then((data) => {
                   var series = Prisma.serie.findFirst({
                        where: {
                            id: parseInt(req.params.id),
                        },
                        include: {
                            episodes: {
                                orderBy: {
                                    episode: 'asc',
                                },
                                include: {
                                    download: {
                                        select:{
                                            id:true,
                                            name:true,
                                            size:true,
                                            quality:true,
                                        }
                                    },
                                },
                            },
                            actors: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                },
                            },
                            category:{
                                select:{
                                    name:true,
                                    id:true
                                }
                            }
                        },
                    })
                    return series
                })
                
                       
            })
    } catch (err: any) {
        if (err.status === 404) {
            res.send({
                status: false,
                msg: 'Series Not Found',
            })
            return
        }
       throw err
    }
})

module.exports = router
