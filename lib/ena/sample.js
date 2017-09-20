const Util = require('./util');

module.exports = class Sample {
    /**
     *
     * @param xml
     */
    constructor(xml) {
        this.xml = xml;
        this.object = Util.XML2Object(this.xml);
        this.accession = this.object.SAMPLE_SET.SAMPLE.accession;
    }

    /**
     *
     * @param sampleID
     * @returns {Promise}
     * @constructor
     */
    static GetSample(sampleID) {
        return new Promise((good, bad) => {
            Util.DoRequest(`samples/${sampleID}?format=xml`)
                .then(xml => {
                    return good(new Sample(xml));
                })
                .catch(err => bad(err));
        })
    }

    static ListAllSamples() {
        return new Promise((good, bad) => {
            Util.DoRequest('samples')
                .then(html => {
                    let ids = Util.ProcessHtmlList('samples', html);
                    return good(ids);
                })
                .catch(err => bad(err));


        })
    }
};