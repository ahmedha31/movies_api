import { default as axios } from 'axios'
import cheerio from 'cheerio'
import express from 'express'
import https from 'https'
import { HttpsProxyAgent } from 'https-proxy-agent'
const router = express.Router()
import { DownLoad, GetEp } from '../../../middlewaer/getdetails'
import { PrismaClient } from '@prisma/client'
const Prisma = new PrismaClient()
const root = process.cwd()
var config = require(root + '/config.json')

router.get('/:id', async (req, res) => {
    var rs = await axios.get(config.url + '/episode/' + req.params.id, {})
    var $ = cheerio.load(rs.data)
    var data = GetEp(rs.data)
    // var episode = $(".col-lg-8.mx-auto .row ").children().map(function (i, elem) {
    //       function asd(a) {if (a === "السابقة") return "prev";
    //         if (a === "التالية") return "next";}
    //       return {
    //         id: $(elem)
    //           .find("a")
    //           .attr("href")
    //           .split("/episode/")[1]
    //           .split("/")[0],
    //         name: $(elem).find("h3").text(),
    //         type: asd($(elem).find("h3").text().split("الحلقة ")[1]),
    //       };
    //     })
    //     .get();
    const downloads = DownLoad(rs.data)
    res.send({
        status: true,
        info: data,
        downloads: downloads,
    })
    await Prisma.episodes
        .upsert({
            where: {
                id: parseInt(req.params.id),
            },
            create: {
                id: parseInt(req.params.id),
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
            },
        })
        .then((x) => {
            console.log(x)
        })
})

module.exports = router
