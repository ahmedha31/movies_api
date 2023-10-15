"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const getdetails_1 = require("../../../middlewaer/getdetails");
const root = process.cwd();
var config = require(root + '/config.json');
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var rs = yield axios_1.default.get(config.url + '/episode/' + req.params.id);
    var $ = cheerio_1.default.load(rs.data);
    var data = (0, getdetails_1.GetEp)(rs.data);
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
        downloads: (0, getdetails_1.DownLoad)(rs.data),
    });
}));
module.exports = router;
