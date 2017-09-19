const cheerio = require('cheerio');
const xmlParser = require('xml2json');
const request = require('request');
const queue = require('queue');
const config = require('../../config');


const requestQueue = queue();
requestQueue.autostart = true;
requestQueue.concurrency = 1;

module.exports = {
    /**
     *
     * @param html
     * @returns {*}
     * @constructor
     */
    HTMLToJQuery(html) {
        return cheerio.load(html);
    },
    /**
     *
     * @param body
     * @constructor
     */
    JSONToObject(body) {
        return JSON.parse(body);
    },
    /**
     *
     * @param xml
     * @returns {*}
     * @constructor
     */
    XML2Object(xml) {
        return this.JSONToObject(xmlParser.toJson(xml));
    },
    /**
     *
     * @param type
     * @param html
     * @returns {Array}
     * @constructor
     */
    ProcessHtmlList(type, html) {
        let $ = this.HTMLToJQuery(html);
        let dd = config.ena.url + type + '/';
        let experiments = Array.from($('a')).filter(f => f.attribs.href.indexOf(dd) > -1);

        return experiments.map(e => {
            let url = e.attribs.href;
            return url.substring(dd.length, url.lastIndexOf('?format=html'))
        });

    },
    /**
     *
     * @param type
     * @returns {Promise}
     * @constructor
     */
    DoRequest(type) {
        return new Promise((good, bad) => {
            requestQueue.push(function (endQueueItem) {
                process.stdout.write('.');
                request({
                    url: config.ena.url + type,
                    auth: {user: config.ena.username, pass: config.ena.password, sendImmediately: true}
                }, function (error, response, body) {

                    endQueueItem(); //IMPORTANT!

                    if (error) {
                        console.error('Error when getting', config.ena.url + type);
                        return bad(error);
                    } else {
                        if (response && response.statusCode === 200) {
                            return good(body);
                        } else {
                            return bad(new Error(`Got a non "200" status code: "${response.statusCode || 'unknown'}"`));
                        }
                    }
                });
            })
        })
    }
};