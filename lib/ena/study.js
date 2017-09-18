const Util = require('./util');

module.exports = class Study {
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
     * @returns {Promise}
     * @constructor
     */
    static ListAllStudies() {
        return new Promise((good, bad) => {
            Util.DoRequest('studies')
                .then(html => {
                    let ids = Util.ProcessHtmlList('studies', html);
                    return good(ids);
                })
                .catch(err => bad(err));


        })
    }

    /**
     *
     * @returns {Promise}
     * @constructor
     */
    static GetAllStudies() {
        return new Promise((good, bad) => {
            this.ListAllStudies()
                .then(studyIDS => {
                    Util.PromiseAllSync(studyIDS.map(sid => {
                        return this.GetStudy(sid)
                    }))
                        .then(studies => {
                            return good(studies)
                        })
                        .catch(err => bad(err));

                })
                .catch(err => bad(err));
        })
    }

    /**
     *
     * @param studyID
     * @returns {Promise}
     * @constructor
     */
    static GetStudy(studyID) {
        return new Promise((good, bad) => {
            Util.DoRequest(`studies/${studyID}?format=xml`)
                .then(xml => {
                    return good(new Study(xml));
                })
                .catch(err => bad(err));
        })
    }


};