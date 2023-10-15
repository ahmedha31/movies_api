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
const axios = require('axios').default;
const cheerio_1 = __importDefault(require("cheerio"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const getdetails_1 = require("../../../middlewaer/getdetails");
const root = process.cwd();
var config = require(root + '/config.json');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rs = yield axios.get(config.url + '/movies', {
            params: {
                page: req.query.page,
            },
        });
        const $ = cheerio_1.default.load(rs.data);
        var movies = $('.entry-box')
            .map(function (i, elem) {
            var _a;
            return {
                name: $(elem).find('.entry-title').children().text(),
                id: (_a = $(elem)
                    .find('.entry-title')
                    .children()
                    .attr('href')) === null || _a === void 0 ? void 0 : _a.toString().split('movie/')[1].split('/')[0],
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
                    return $(elem).text();
                })
                    .get(),
                type: 'movie',
            };
        })
            .get();
        res.send({
            status: true,
            data: movies,
        });
    }
    catch (err) {
        res.send({
            status: false,
            msg: 'Something went wrong',
            err: err,
        });
    }
}));
router.get('/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        var rs = yield axios.get(config.url + '/one');
        var $ = cheerio_1.default.load(rs.data);
        var entry = $('.entry-box-2').eq(0);
        var data = {
            title: entry
                .find('.entry-body')
                .find('.entry-title')
                .children()
                .first()
                .text(),
            id: (_a = entry
                .find('.entry-body')
                .find('.entry-title')
                .children()
                .first()
                .attr('href')) === null || _a === void 0 ? void 0 : _a.toString().split('movie/')[1].split('/')[0],
            description: entry
                .find('.entry-body')
                .find('.entry-desc')
                .first()
                .text()
                .split('مشاهدة و تحميل فيلم ')[1],
            Image: entry.find('.entry-poster').find('img').attr('data-src'),
            banner: (_b = entry
                .attr('style')) === null || _b === void 0 ? void 0 : _b.toString().split("background-image: url('")[1].split("')")[0],
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
        };
        res.send({
            status: true,
            data: data,
        });
    }
    catch (e) {
        res.send({
            status: false,
            msg: 'Something went wrong',
            err: e,
        });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    try {
        var rs = yield axios.get(config.url + '/movie/' + req.params.id);
        var $ = cheerio_1.default.load(rs.data);
        var actors = $('.entry-box-3')
            .map(function (i, elem) {
            return {
                id: i++,
                name: $(elem).find('img').attr('alt'),
                image: $(elem).find('img').attr('src'),
            };
        })
            .get();
        var downloads = (0, getdetails_1.DownLoad)(rs.data);
        var data = (0, getdetails_1.GetMovie)(rs.data);
        res.send({
            status: true,
            info: data,
            actors: actors,
            downloads: downloads,
        });
    }
    catch (e) {
        res.send({
            status: false,
            msg: 'something went wrong',
            err: e,
        });
    }
}));
module.exports = router;
