import { default as axios } from 'axios'
import cheerio from 'cheerio'
import express from 'express'
const router = express.Router()
import { DownLoad, GetEp } from '../../../middlewaer/getdetails'
const root = process.cwd()
var config = require(root + '/config.json')

router.get('/:id', async (req, res) => {
    var rs = await axios.get(config.url + '/episode/' + req.params.id)
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

    res.send({
        status: true,
        info: data,
        downloads: DownLoad(rs.data),
    })
})

module.exports = router
