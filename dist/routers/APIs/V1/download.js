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
const puppeteer_1 = __importDefault(require("puppeteer"));
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
var https = require('https');
const router = express_1.default.Router();
const root = process.cwd();
var config = require(root + '/config.json');
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout: chromiumPath } = yield (0, node_util_1.promisify)(node_child_process_1.exec)("which chromium");
    const browser = yield puppeteer_1.default.launch({
        headless: false,
        userDataDir: './tmp',
        waitForInitialPage: true,
        executablePath: chromiumPath.trim(),
        timeout: 0,
        args: [
            //    '--proxy-server=192.168.1.9:44355',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
    const page = yield browser.pages().then((pages) => pages[0]);
    yield page.goto(config.url + '/download/' + req.params.id + '/56151');
    const html = yield page.content();
    const title = yield page.title();
    if (!title.startsWith('تحق')) {
        var $ = cheerio_1.default.load(html);
        var rss = {
            link: $('.link.btn.btn-light').attr('href'),
            name: $('a[download]').last().text().split('.AKWAM.')[0],
        };
        const response = yield axios_1.default.get(rss.link, {
            responseType: 'stream',
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        const stream = response.data;
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'content-name': rss.name + '.mp4',
            'Content-Disposition': `attachment; filename=${rss.name}.mp4`,
            'content-length': response.headers['content-length'],
        });
        stream.on('data', (data) => {
            res.write(data);
        });
        stream.on('end', () => {
            res.end();
            console.log('stream done');
        });
    }
    else {
        res.json({
            status: false,
            msg: 'app need verification',
        });
    }
}));
router.get('/:id/info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // config.url + '/download/' + req.params.id + '/56151',
    const { stdout: chromiumPath } = yield (0, node_util_1.promisify)(node_child_process_1.exec)("which chromium");
    const browser = yield puppeteer_1.default.launch({
        headless: false,
        userDataDir: './tmp',
        waitForInitialPage: true,
        executablePath: chromiumPath.trim(),
        timeout: 0,
        args: [
            //  '--proxy-server=192.168.1.9:44355',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
    const page = yield browser.pages().then((pages) => pages[0]);
    yield page.goto(config.url + '/download/' + req.params.id + '/56151');
    const html = yield page.content();
    const title = yield page.title();
    if (!title.startsWith('تحق')) {
        const $ = cheerio_1.default.load(html);
        var rss = {
            link: $('.link.btn.btn-light').attr('href'),
            name: $('a[download]').last().text().split('.AKWAM.')[0],
        };
        yield browser.close();
        res.json({
            name: rss.name,
            link: rss.link,
            size: 0,
        });
    }
    else {
        res.json({
            status: false,
            msg: 'app need verification',
        });
    }
}));
module.exports = router;
