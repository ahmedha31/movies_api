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
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const content_disposition_1 = __importDefault(require("content-disposition"));
const https_1 = __importDefault(require("https"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const root = process.cwd();
var config = require(root + '/config.json');
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { stdout: chromiumPath } = yield (0, node_util_1.promisify)(node_child_process_1.exec)("which chromium");
    const browser = yield puppeteer_1.default.launch({
        headless: false,
        userDataDir: './tmp',
        waitForInitialPage: true,
        executablePath: chromiumPath.trim(),
        timeout: 0,
        args: [
            // '--proxy-server=192.168.1.9:44355',
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
            name: $('meta')
                .filter(function (i, el) {
                return $(el).attr('property') === 'og:title';
            })
                .last()
                .attr('content'),
        };
        const response = yield axios_1.default.get(rss.link, {
            responseType: 'stream',
            headers: {
                Range: (_a = req.headers.range) !== null && _a !== void 0 ? _a : 0,
            },
            httpsAgent: new https_1.default.Agent({
                rejectUnauthorized: false,
            }),
        });
        response.headers['Content-Type'] = 'video/mp4';
        response.headers['Content-name'] = (0, content_disposition_1.default)(rss.name);
        (response.headers['Content-Disposition'] = (0, content_disposition_1.default)(rss.name)),
            res.writeHead(206, response.headers);
        response.data.on('data', (data) => {
            res.write(data);
        });
        console.log(rss.name);
        response.data.on('end', () => {
            console.log('stream done');
            res.end();
        });
        response.data.on('error', (err) => {
            console.log(err);
        });
    }
    else {
        res.send({
            status: false,
            message: 'app need  to verify',
        });
    }
}));
module.exports = router;
