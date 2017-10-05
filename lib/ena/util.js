const cheerio = require('cheerio');
const xmlParser = require('xml2json');
const request = require('request');
const queue = require('queue');
const config = require('../../config');
const path = require('path');
const fs = require('fs-extra');
const Client = require('ftp');
const {URL} = require('url');

const requestQueue = queue();
requestQueue.autostart = true;
requestQueue.concurrency = 1;


const ftpQueue = queue();
ftpQueue.autostart = true;
ftpQueue.concurrency = 1;


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
     * @param html
     * @constructor
     */
    ProcessHtmlFiles(html) {
        let $ = this.HTMLToJQuery(html);
        return Array.from($('a')).filter(f => f.attribs.href.indexOf('ftp://') > -1).map(e => e.attribs.href) //TODO should be @ 0
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
    },
    ftpDownload(url, dir) {
        return new Promise((good, bad) => {

            ftpQueue.push(function (endFtpQueueItem) {

                const fileName = path.basename(url);
                const newPath = path.join(dir, fileName);

                const myURL = new URL(url);

                const c = new Client();
                c.on('ready', function () {
                    // console.log('want to download', myURL.pathname);
                    c.get(myURL.pathname, function (err, stream) {
                        if (err) {
                            endFtpQueueItem();
                            return bad(new Error(`Could not get file ${url}`));
                        } else {
                            console.log('Downloading to', newPath);
                            stream.pipe(fs.createWriteStream(newPath))
                            endFtpQueueItem();
                            return good();
                        }
                    });
                });

                const ftpServerAddress = myURL.origin.replace(/(^\w+:|^)\/\//, '');

                console.log('Connecting to', ftpServerAddress);
                c.connect({host: ftpServerAddress});
            })
        })
    }

};