const Util = require('./util');
const Study = require('./study');
const Sample = require('./sample');

module.exports = class Experiment {
    /**
     *
     * @param xml
     */
    constructor(xml) {
        this.xml = xml;
        this.object = Util.XML2Object(this.xml);

        this.studyID = this.object.EXPERIMENT_SET.EXPERIMENT.STUDY_REF.accession;
        this.sampleID = this.object.EXPERIMENT_SET.EXPERIMENT.DESIGN.SAMPLE_DESCRIPTOR.accession;
    }

    /**
     *
     * @returns {Promise}
     * @constructor
     */
    static ListAllExperiments() {
        return new Promise((good, bad) => {
            Util.DoRequest('experiments')
                .then(html => {
                    let ids = Util.ProcessHtmlList('experiments', html);
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
    static GetAllExperiments() {
        return new Promise((good, bad) => {
            this.ListAllExperiments()
                .then(experimentIDS => {
                    Util.PromiseAllSync(experimentIDS.map(eid => {
                        return this.GetExperiment(eid)
                    }))
                        .then(experiments => {
                            return good(experiments)
                        })
                        .catch(err => bad(err));

                })
                .catch(err => bad(err));
        })
    }

    /**
     *
     * @param experimentID
     * @returns {Promise}
     * @constructor
     */
    static GetExperiment(experimentID) {
        return new Promise((good, bad) => {
            Util.DoRequest(`experiments/${experimentID}?format=xml`)
                .then(xml => {
                    return good(new Experiment(xml));
                })
                .catch(err => bad(err));
        })
    }

    /**
     *
     * @returns {*}
     */
    getStudy() {
        return Study.GetStudy(this.studyID)
    }

    /**
     *
     * @returns {*}
     */
    getSample() {
        return Sample.GetSample(this.sampleID);
    }
};