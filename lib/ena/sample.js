const Util = require('./util');

module.exports = class Sample {
    /**
     *
     * @param xml
     */
    constructor(xml) {
        this.xml = xml;
        this.object = Util.XML2Object(this.xml);
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
};