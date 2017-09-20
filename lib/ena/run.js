const Util = require('./util');
const Experiment = require('./experiment');


module.exports = class Run {
    /**
     *
     * @param xml
     */
    constructor(xml) {
        this.xml = xml;
        this.object = Util.XML2Object(this.xml);

        this.accession = this.object.RUN_SET.RUN.accession;
        this.experimentID = this.object.RUN_SET.RUN.EXPERIMENT_REF.accession;

        this.files = []; //or undef?

        if (this.object.RUN_SET.RUN.DATA_BLOCK) {
            this.files = Array.from(this.object.RUN_SET.RUN.DATA_BLOCK.FILES.FILE).map(f => {
                return {
                    ascii_offset: f.ascii_offset,
                    checksum: f.checksum,
                    checksum_method: f.checksum_method,
                    filename: f.filename,
                    filetype: f.filetype,
                    quality_encoding: f.quality_encoding,
                    quality_scoring_system: f.quality_scoring_system
                }
            });
        }
    }


    /**
     *
     * @returns {Promise}
     * @constructor
     */
    static ListAllRuns() {
        return new Promise((good, bad) => {
            Util.DoRequest('runs')
                .then(html => {
                    let ids = Util.ProcessHtmlList('runs', html);
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
    static GetAllRuns() {
        return new Promise((good, bad) => {
            this.ListAllRuns()
                .then(runIDS => {
                    Promise.all(runIDS.map(rid => {
                        return this.GetRun(rid)
                    }))
                        .then(runs => {
                            return good(runs)
                        })
                        .catch(err => bad(err));

                })
                .catch(err => bad(err));
        })
    }

    /**
     *
     * @param runID
     * @returns {Promise}
     * @constructor
     */
    static GetRun(runID) {
        return new Promise((good, bad) => {
            Util.DoRequest(`runs/${runID}?format=xml`)
                .then(xml => {
                    return good(new Run(xml));
                })
                .catch(err => bad(err));
        })
    }

    getStack() {
        return new Promise((good, bad) => {
            let run = this;
            this.getExperiment()
                .then(experiment => {
                    experiment.getSample()
                        .then(sample => {
                            experiment.getStudy()
                                .then(study => {
                                    run.study = study;
                                    run.experiment = experiment;
                                    run.sample = sample;
                                    return good(run);
                                }).catch(err => bad(err));
                        }).catch(err => bad(err));
                }).catch(err => bad(err));
        })
    }

    /**
     *
     * @returns {*}
     */
    getExperiment() {
        return Experiment.GetExperiment(this.experimentID);
    }
};