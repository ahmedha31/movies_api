import { default as axios } from 'axios'
import { load } from 'cheerio'
import express from 'express'
const router = express.Router()
import { getseries } from '../../../middlewaer/getdetails'
import { PrismaClient } from '@prisma/client'
const Prisma = new PrismaClient()
const root = process.cwd()
var config = require(root + '/config.json')
import { SeriesData, Seriestype } from './index.d'
import { GetEpi } from './episode'
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
        await getserie(req.params.id).then((x) => {
            res.send({
                status: true,
                detail:{
                    name: x.name,
                    image : x.image,
                    banner : x.banner,
                    description: x.description,
                    sesson: null,
                    rating: x.reating?.toString(),
                    language: x.language,
                    translate: x.translate ?? 'غير مترجم',
                    quality: x.quality,
                    country: x.country,
                    year: x.year?.toString(),
                    category: x.category.map((x) => x.name),
                },
                actors: x.actors,
                episodes: x.episodes,

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


async function getserie(id: string){
    return await Prisma.serie
        .findUnique({
            where: {
                id: Number.parseInt(id),
            },
            include: {
                episodes: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        episode: true,
                        download: true
                    },
                },
                actors: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },

        }).then(async (x) => {
            if (x) {
                setTimeout(async() => {
                    console.log('update')
                   await GetSeriesUpdate(x.id)
                }, 1000 * 10)
                return x
            } else {
                var rs = await axios.get(
                    config.url + '/series/' + id
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
                                cont: parseInt($(elem).text().split(' : ')[0].split('حلقة ')[1]),
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
                                cont: parseInt($(elem).text().split(' : ')[0].split('حلقة ')[1]),
                                image: $(ele).find('img').attr('src'),
                                id: $(elem)
                                    .attr('href')
                                    ?.toString()
                                    .split('episode/')[1]
                                    .split('/')[0],
                            }
                        })
                        .get().sort((a, b) => a.id! > b.id! ? 1 : -1)
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

                return await Prisma.serie.create({
                    include: {
                        episodes: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                episode: true,
                                download: true
                            },
                        },
                        actors: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    data: {
                        id: parseInt(id),
                        name: detail.name,
                        description: detail.description,
                        image: detail.image || '',
                        banner: detail.banner,
                        reating: detail.rating || 0,
                        quality: detail.quality,
                        language: detail.language,
                        translate: detail.translate,
                        country: detail.country,
                        trailer: detail.trailer,
                        year: detail.year,

                        category: {
                            connectOrCreate: detail.category.map((x) => ({
                                where: {
                                    id: x.id,
                                },
                                create: {
                                    id: x.id,
                                    name: x.name,
                                },
                            })),
                        },
                        actors: {
                            connectOrCreate: actors.map((x) => ({
                                where: {
                                    id: x.id,
                                },
                                create: {
                                    id: x.id,
                                    name: x.name,
                                    image: x.image!,

                                },
                            })),
                        },
                        episodes:
                        {
                            connectOrCreate: episodes!.map((x) => ({
                                where: {
                                    id: parseInt(x.id!),
                                },
                                create: {
                                    name: x.name,
                                    image: x.image!,
                                    episode: x.cont,
                                    duration: 0,
                                    id: parseInt(x.id!),
                                },
                            }))
                        }
                    }
                })

            }
        })


}

async function GetSeriesUpdate(id: number) {

    var rs = await axios.get(
        config.url + '/series/' + id
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
                    cont: parseInt($(elem).text().split(' : ')[0].split('حلقة ')[1]),
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
                    cont: parseInt($(elem).text().split(' : ')[0].split('حلقة ')[1]),
                    image: $(ele).find('img').attr('src'),
                    id: $(elem)
                        .attr('href')
                        ?.toString()
                        .split('episode/')[1]
                        .split('/')[0],
                }
            })
            .get().sort((a, b) => a.id! > b.id! ? 1 : -1)
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

    return await Prisma.serie.upsert({
        where: {
            id: id,
        },
        include: {
            episodes: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    episode: true,
                    download: true
                },
            },
            actors: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        create: {
            id: id,
            name: detail.name,
            description: detail.description,
            image: detail.image || '',
            banner: detail.banner,
            reating: detail.rating || 0,
            quality: detail.quality,
            language: detail.language,
            translate: detail.translate,
            country: detail.country,
            trailer: detail.trailer,
            year: detail.year,

            category: {
                connectOrCreate: detail.category.map((x) => ({
                    where: {
                        id: x.id,
                    },
                    create: {
                        id: x.id,
                        name: x.name,
                    },
                })),
            },
            actors: {
                connectOrCreate: actors.map((x) => ({
                    where: {
                        id: x.id,
                    },
                    create: {
                        id: x.id,
                        name: x.name,
                        image: x.image!,

                    },
                })),
            },
            episodes:
            {
                connectOrCreate: episodes!.map((x) => ({
                    where: {
                        id: parseInt(x.id!),
                    },
                    create: {
                        name: x.name,
                        image: x.image!,
                        episode: x.cont,
                        duration: 0,
                        id: parseInt(x.id!),
                    },
                }))
            }
        },
        update: {
            name: detail.name,
            description: detail.description,
            image: detail.image || '',
            banner: detail.banner,
            reating: detail.rating || 0,
            quality: detail.quality,
            language: detail.language,
            translate: detail.translate,
            country: detail.country,
            trailer: detail.trailer,
            year: detail.year,

            category: {
                connectOrCreate: detail.category.map((x) => ({
                    where: {
                        id: x.id,
                    },
                    create: {
                        id: x.id,
                        name: x.name,
                    },
                })),
            },
            actors: {
                connectOrCreate: actors.map((x) => ({
                    where: {
                        id: x.id,
                    },
                    create: {
                        id: x.id,
                        name: x.name,
                        image: x.image!,

                    },
                })),
            },
            episodes:
            {
                connectOrCreate: episodes!.map((x) => ({
                    where: {
                        id: parseInt(x.id!),
                    },
                    create: {
                        name: x.name,
                        image: x.image!,
                        episode: x.cont,
                        duration: 0,
                        id: parseInt(x.id!),
                    },
                }))
            }
        }
    })


}

export { router }
