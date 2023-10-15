import { load } from 'cheerio'
const root = process.cwd()
var config = require(root + '/config.json')
type series = {
    name: string
    sesson: string
    image: string | undefined
    banner: string | undefined
    description: string
    rating: string
    language: string
    translate: string
    quality: string
    country: string
    year: string
    category: string[]
}

export const getseries = (rs: any) => {
    var $ = load(rs)
    var entry = $('.movie-cover')
        .find('.container')
        .find('.col-lg-7.pr-lg-4.col-md-5.col-sm-8.mb-4.mb-sm-0.px-4.px-sm-0')
        .children()
        .find('span')
        .map(function (i, elem) {
            return {
                name: $(elem).text().split(' : ')[0],
                value: $(elem).text().split(' : ')[1],
            }
        })
        .get()
    var detail: series = {
        name: $('.page .movie-cover')
            .find('.entry-title')
            .text()
            .split(' الموسم ')[0],
        sesson: $('.page .movie-cover')
            .find('.entry-title')
            .text()
            .split(' الموسم ')[1],
        image: $('.page .movie-cover').find('a[data-fancybox]').attr('href'),
        banner: $('.movie-cover')
            .find('image[filter="url(#blur-effect-1)"]')
            .attr('href'),
        description: $('.movie-cover').next().find('p').first().text(),
        rating: $('.movie-cover')
            .find('.icon-star.text-orange')
            .prev()
            .text()
            .split('10 / ')[1],
        language: entry.find((x) => x.name === 'اللغة')
            ? entry.find((x) => x.name === 'اللغة')!.value
            : '',
        translate: entry.find((x) => x.name === 'الترجمة')
            ? entry.find((x) => x.name === 'الترجمة')!.value
            : '',
        quality: entry.find((x) => x.name === 'الجودة')
            ? entry.find((x) => x.name === 'الجودة')!.value
            : '',
        country: entry.find((x) => x.name === ' انتاج')
            ? entry.find((x) => x.name === ' انتاج')!.value
            : '',
        year: entry.find((x) => x.name === ' السنة')
            ? entry.find((x) => x.name === ' السنة')!.value
            : '',
        category: $('.movie-cover')
            .find('.container')
            .find('.badge.badge-pill.badge-light')
            .map(function (i, elem) {
                return $(elem).text()
            })
            .get(),
    }
    return detail
}

export const GetEp = (rs: any) => {
    var $ = load(rs)
    var entry = $('.movie-cover')
        .find('.container')
        .find('.col-lg-7.pr-lg-4.col-md-5.col-sm-8.mb-4.mb-sm-0.px-4.px-sm-0')
        .children()
        .find('span')
        .map(function (i: any, elem: any) {
            return {
                name: $(elem).text().split(' : ')[0],
                value: $(elem).text().split(' : ')[1],
            }
        })
        .get()
    var aes = JSON.parse(
        JSON.stringify($('script').attr('type', 'application/ld+json').eq(1).text().split("[",1).join('').split("]",1).join(''))
    )[0].containsSeason.episode.position
    var detail = {
        name: $('h1.entry-title')
            .text()
            .split($('.breadcrumb.mb-0').find('li').last().text())[1]
            .trim()
            .split(` ${aes} `)[1],
        episode: aes,
        image: $('.page .movie-cover').find('a[data-fancybox]').attr('href'),
        duration: entry.find((x: { name: string }) => x.name === 'مدة المسلسل')
            ? entry
                  .find((x: { name: string }) => x.name === 'مدة المسلسل')!
                  .value.split(' دقيقة')[0]
            : 's',
    }
    return detail
}

export const GetMovie = (rs: any) => {
    var $ = load(rs)
    var entry = $('.movie-cover')
        .find('.container')
        .find('.col-lg-7.pr-lg-4.col-md-5.col-sm-8.mb-4.mb-sm-0.px-4.px-sm-0')
        .children()
        .find('span')
        .map(function (i: any, elem: any) {
            return {
                name: $(elem).text().split(' : ')[0],
                value: $(elem).text().split(' : ')[1],
            }
        })
        .get()
    return {
        title: $('h1.entry-title').text(),
        image: $('a[data-fancybox]').attr('href'),
        description: $('h2 p').first().text(),
        rating: $('.icon-star.text-orange')
            .prev()
            .text()
            .split('10 / ')[1]
            .split(' ')[0],
        language: entry.find((x: { name: string }) => x.name === 'اللغة')
            ? entry.find((x: { name: string }) => x.name === 'اللغة')!.value
            : '',
        translate: entry.find((x: { name: string }) => x.name === 'الترجمة')
            ? entry.find((x: { name: string }) => x.name === 'الترجمة')!.value
            : '',
        quality: entry.find((x: { name: string }) => x.name === 'جودة الفيلم')
            ? entry.find((x: { name: string }) => x.name === 'جودة الفيلم')!
                  .value
            : '',
        country: entry.find((x: { name: string }) => x.name === ' انتاج')
            ? entry.find((x: { name: string }) => x.name === ' انتاج')!.value
            : '',
        year: entry.find((x: { name: string }) => x.name === ' السنة')
            ? entry.find((x: { name: string }) => x.name === ' السنة')!.value
            : '',
        duration: entry.find((x: { name: string }) => x.name === 'مدة الفيلم')
            ? entry
                  .find((x: { name: string }) => x.name === 'مدة الفيلم')!
                  .value.split(' دقيقة')[0]
            : 's',
        category: $('.movie-cover')
            .find('.container')
            .find('.badge.badge-pill.badge-light')
            .map(function (i: any, elem: any) {
                return $(elem).text()
            })
            .get(),
        trailer:
            confog.youtube_link +
                $('.btn.btn-light.btn-pill.d-flex.align-items-center').attr(
                    'href'
                ) || '?v='.split('?v=')[1],
    }
}

export const DownLoad = function (rs: any) {
    var $ = load(rs)
    var qq = $('#downloads')
        .nextAll('.widget-body')
        .find('li')
        .map(function (i: any, elem: any) {
            return {
                id: $(elem).find('a').attr('href')!.split('#')[1],
                name: $(elem).children().text(),
            }
        })
        .get()

    return $('.tab-content.quality')
        .map(function (i: any, elem: any) {
            var q = qq.find((x: { id: any }) => x.id == $(elem).attr('id'))
            return {
                name: confog.find((x: { quality: any }) => x.quality == q!.name)
                    .name,
                quality: q!.name,
                size: $(elem).find('.link-download').children().eq(1).text(),
                id: $(elem)
                    .find('.link-download')
                    .attr('href')!
                    .split('/link/')[1],
            }
        })
        .get()
}

var confog: any = [
    {
        name: 'High',
        quality: '1080p',
    },
    {
        name: 'Medium',
        quality: '720p',
    },
    {
        name: 'Low',
        quality: '480p',
    },
    {
        name: 'Very Low',
        quality: '360p',
    },
]
