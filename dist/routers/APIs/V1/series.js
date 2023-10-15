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
const cheerio_1 = require("cheerio");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const getdetails_1 = require("../../../middlewaer/getdetails");
const root = process.cwd();
var config = require(root + '/config.json');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rs = yield axios_1.default.get(config.url + '/series', {
            params: {
                page: req.query.page,
            },
        });
        const $ = (0, cheerio_1.load)(rs.data);
        var search = {
            section: $('#filter')
                .children()
                .children()
                .eq(0)
                .find('select')
                .children()
                .map(function (i, elem) {
                return { name: $(elem).text(), value: $(elem).val() };
            })
                .get(),
            category: $('#filter')
                .children()
                .children()
                .eq(1)
                .find('select')
                .children()
                .map(function (i, elem) {
                return { name: $(elem).text(), value: $(elem).val() };
            })
                .get(),
            rating: $('#filter')
                .children()
                .children()
                .eq(2)
                .find('select')
                .children()
                .map(function (i, elem) {
                return { name: $(elem).text(), value: $(elem).val() };
            })
                .get(),
            year: $('#filter')
                .children()
                .children()
                .eq(3)
                .find('select')
                .children()
                .map(function (i, elem) {
                return { name: $(elem).text(), value: $(elem).val() };
            })
                .get(),
            language: $('#filter')
                .children()
                .children()
                .eq(4)
                .find('select')
                .children()
                .map(function (i, elem) {
                return { name: $(elem).text(), value: $(elem).val() };
            })
                .get(),
            quality: $('#filter')
                .children()
                .children()
                .eq(5)
                .find('select')
                .children()
                .map(function (i, elem) {
                return { name: $(elem).text(), value: $(elem).val() };
            })
                .get(),
            resolution: $('#filter')
                .children()
                .children()
                .eq(6)
                .find('select')
                .children()
                .map(function (i, elem) {
                return { name: $(elem).text(), value: $(elem).val() };
            })
                .get(),
        };
        var series = $('.entry-box')
            .map(function (i, elem) {
            var _a;
            return {
                name: $(elem).find('.entry-title').children().text(),
                id: (_a = $(elem)
                    .find('.entry-title')
                    .children()
                    .attr('href')) === null || _a === void 0 ? void 0 : _a.toString().split('series/')[1].split('/')[0],
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
                    return $(elem).text();
                })
                    .get(),
                type: 'series',
            };
        })
            .get();
        res.send({
            status: true,
            search: search,
            data: series,
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
        var rs = yield axios_1.default.get(config.url + '/one');
        var $ = (0, cheerio_1.load)(rs.data);
        var entry = $('.entry-box-2').eq(1);
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
                .attr('href')) === null || _a === void 0 ? void 0 : _a.toString().split('series/')[1].split('/')[0],
            description: entry
                .find('p.entry-desc')
                .text()
                .split('مشاهدة و تحميل مسلسل')[1],
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
            type: 'series',
        };
        res.send({
            status: true,
            data: data,
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
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var rs = yield axios_1.default.get(config.url + '/series/' + req.params.id);
        var $ = (0, cheerio_1.load)(rs.data);
        console.log($('#series-episodes').find('.row').children().length);
        if ($('#series-episodes').length === 1) {
            var episodes = $('#series-episodes')
                .eq(0)
                .find('.widget-body')
                .children()
                .children()
                .map(function (i, ele) {
                var _a;
                var elem = $(ele).find('a').first();
                return {
                    name: $(elem).text().split(' : ')[0],
                    cont: i + 1,
                    image: $(ele).find('img').attr('src'),
                    id: (_a = $(elem)
                        .attr('href')) === null || _a === void 0 ? void 0 : _a.toString().split('episode/')[1].split('/')[0],
                };
            })
                .get()
                .reverse();
        }
        else if ($('#series-episodes').length === 2) {
            var sessions = $('#series-episodes')
                .eq(0)
                .children()
                .last()
                .children()
                .map(function (i, elem) {
                var _a;
                return {
                    name: $(elem).text().split(' الموسم ')[0],
                    session: $(elem).text().split(' الموسم ')[1],
                    id: (_a = $(elem)
                        .attr('href')) === null || _a === void 0 ? void 0 : _a.toString().split('/series/')[1].split('/')[0],
                };
            })
                .get();
            var episodes = $('#series-episodes')
                .eq(1)
                .find('.widget-body')
                .children()
                .children()
                .map(function (i, ele) {
                var _a;
                var elem = $(ele).find('a').first();
                return {
                    name: $(elem).text().split(' : ')[0],
                    cont: i + 1,
                    image: $(ele).find('img').attr('src'),
                    id: (_a = $(elem)
                        .attr('href')) === null || _a === void 0 ? void 0 : _a.toString().split('episode/')[1].split('/')[0],
                };
            })
                .get()
                .reverse();
        }
        var actors = $('.entry-box-3')
            .map(function (i, elem) {
            return {
                id: i++,
                name: $(elem).find('.entry-title').text(),
                image: $(elem).find('img').attr('src'),
            };
        })
            .get();
        const detail = (0, getdetails_1.getseries)(rs.data);
        res.send({
            status: true,
            detail: detail,
            sessions: sessions,
            episodes: episodes,
            actors: actors,
        });
    }
    catch (err) {
        if (err.status === 404) {
            res.send({
                status: false,
                msg: 'Series Not Found',
            });
            return;
        }
        res.send({
            status: false,
            msg: 'Something went wrong on our side',
            err: err.message,
        });
    }
}));
module.exports = router;
