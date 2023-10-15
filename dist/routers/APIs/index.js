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
const vonfig = require('../../../package.json');
const root = process.cwd();
var config = require(root + '/config.json');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var rs = yield axios_1.default.get(config.url + '/one');
        var $ = cheerio_1.default.load(rs.data);
        var movie = [];
        var series = [];
        $('.widget-4.widget.widget-style-1')
            .first()
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
                category: $(elem)
                    .find('span.badge.badge-light')
                    .map(function (i, elem) {
                    return $(elem).text();
                })
                    .get(),
            };
            movie.push(ele);
        });
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
                    return $(elem).text();
                })
                    .get(),
            };
            series.push(ele);
        });
        res.send({
            status: true,
            data: {
                movie,
                series,
            },
        });
    }
    catch (e) {
        res.send({
            status: false,
            error: e.message,
        });
    }
}));
router.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        status: true,
        message: 'API is working',
        version: vonfig.version,
    });
}));
router.use('/search', require('./V1/search'));
router.use('/movie', require('./V1/movies'));
router.use('/series', require('./V1/series'));
router.use('/episode', require('./V1/episode'));
router.use('/download', require('./V1/download'));
router.use('/watch', require('./V1/watch'));
module.exports = router;
