const cheerio = require('cheerio');
const xmlParser = require('xml2json');
const request = require('request');
// var Promise = require("bluebird");
const config = require('../../config');


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
     * @param listOfPromises
     * @returns {Promise.<*[]>}
     * @constructor
     */
    PromiseAllSync(listOfPromises) {
        // return new Promise(async (resolve, reject) => {
        //     let results = [];
        //     for (let promise of listOfPromises.map(Promise.resolve, Promise)) {
        //             await promise.then(out => results.push(out))
        //                 .catch(err => reject(err));
        //             if (results.length === listOfPromises.length) {
        //                 resolve(results)
        //             }
        //     }
        // })
        return Promise.all(listOfPromises);

    },
    /**
     *
     * @param type
     * @returns {Promise}
     * @constructor
     */
    DoRequest(type) {
        return new Promise((good, bad) => {
            request({
                url: config.ena.url + type,
                auth: {user: config.ena.username, pass: config.ena.password, sendImmediately: true}
            }, function (error, response, body) {
                if (error) {
                    console.error('Error when getting', config.ena.url + type);
                    return bad(error);
                } else {

                    if (response && response.statusCode === 200) {
                        return good(body);
                    } else {
                        return bad(new Error(`Got a non "200" status code: "${response.statusCode || 'unknown'}"`));
                    }

                    // console.log(config.ena.url + type);

                }
            });
        })
    }
};