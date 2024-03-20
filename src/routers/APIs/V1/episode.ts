import axios from 'axios'
import cheerio from 'cheerio'
import express from 'express'
const router = express.Router()
import { DownLoad, GetEp } from '../../../middlewaer/getdetails'
import { PrismaClient } from '@prisma/client'
import { EpisodeResponse, Eps } from '.'
import { slack } from '../../../utils/slack'
const Prisma = new PrismaClient()
const root = process.cwd()
var config = require(root + '/config.json')

router.get('/:id', async (req, res) => {

    var id = parseInt(req.params.id)
    var ress = await GetEpi(id)




    var episode: EpisodeResponse = {
        status: true,
        info: {
            name: ress!.name,
            image: ress!.image,
            episode: ress!.episode!.toString(),
            duration: ress!.duration,
        },
        downloads: ress!.download.map((x) => ({
            name: x.name,
            quality: x.quality,
            size: x.size,
            id: x.id,
        })),
    }
    res.json(episode)
})

async function GetEpi(id: number) {
    return await Prisma.episodes
        .findUnique({
            where: {
                id: id,
            },
            include: {
                download: true,
            },
        })
        .then(async (x) => {
            if (false) {
                return x
            } else {
                var rs = await axios.get(config.url + '/episode/' + id)
                var data = GetEp(rs.data)
                const downloads = DownLoad(rs.data)
                return await Prisma.episodes.upsert({
                    where: {
                        id: id,

                    },
                    update: {
                        name: data.name,
                        image: data.image!,
                        episode: data.episode,
                        duration: data.duration,
                        download: {
                            connectOrCreate: downloads.map((x) => ({
                                where: {
                                    id: x.id,
                                },
                                create: {
                                    id: x.id,
                                    name: x.name,
                                    quality: x.quality,
                                    size: x.size,

                                },
                            })),
                        },
                    }, create: {
                        id: id,
                        name: data.name,
                        image: data.image!,
                        episode: data.episode,
                        duration: data.duration,
                        download: {
                            connectOrCreate: downloads.map((x) => ({
                                where: {
                                    id: x.id,
                                },
                                create: {
                                    id: x.id,
                                    name: x.name,
                                    quality: x.quality,
                                    size: x.size,

                                },
                            })),
                        },
                    }, include: {
                        download: true
                    }


                }).then((x) => {
                    slack.send({

                        "blocks": [
                            {
                                "type": "section",
                                "text": {
                                    "type": "plain_text",
                                    "text": "New Episode Added to DB",
                                    "emoji": true
                                }
                            },
                            {
                                "type": "section",
                                "text": {
                                    "type": "plain_text",
                                    "text": "New Episode Added to DB Wih ID: " + x.id + "\n" + "Name: " + x.name + "\n" + "Episode: " + x.episode + "\n" + "Duration: " + x.duration + "\n" + "Image: " + x.image + "\n" + "Downloads: " + x.download.map((x) => x.name).join(", "),
                                    "emoji": true
                                }
                            },

                        ]

                    })

                    return x
                }).catch((x) => {
                    console.log(x)
                    return null
                })
            }


        })
}


export { router, GetEpi }
