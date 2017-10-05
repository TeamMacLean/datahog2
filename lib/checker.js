const ENA = require("./ena");
const RunModel = require('../models/run');
const SampleModel = require('../models/sample');
const ExperimentModel = require('../models/experiment');
const StudyModel = require('../models/study');
const ReadModel = require('../models/read');

function check(listPromise, Model) {
    return new Promise((good, bad) => {
        listPromise()
            .then(ids => {
                Model.run()
                    .then(dbItem => {
                        let notFound = ids.filter(id => {
                            return dbItem.filter(dbi => dbi.accession === id).length < 1
                        });
                        return good(notFound);
                    })
                    .catch(err => bad(err))
            })
            .catch(err => bad(err));
    })
}

function checkExperiments() {
    return check(ENA.Experiment.ListAllExperiments, ExperimentModel)
}

function checkSamples() {
    return check(ENA.Sample.ListAllSamples, SampleModel)
}


function checkStudies() {
    return check(ENA.Study.ListAllStudies, StudyModel)
}


function checkRuns() {
    return check(ENA.Run.ListAllRuns, RunModel)
}


function checkAll() {
    return new Promise((good, bad) => {
        Promise.all([checkStudies(), checkSamples(), checkExperiments(), checkRuns()])
            .then(results => {
                return good({
                    studies: results[0],
                    samples: results[1],
                    experiments: results[2],
                    runs: results[3]
                })
            })
            .catch(err => bad(err));
    })

}

function processStudy(accessionObj) {
    return new Promise((good, bad) => {
        StudyModel({
            accession: accessionObj.accession,
            xml: accessionObj.xml
        })
            .save()
            .then(model => good(model))
            .catch(err => bad(err))
    })
}

function processSample(accessionObj) {
    return new Promise((good, bad) => {
        SampleModel({
            accession: accessionObj.accession,
            xml: accessionObj.xml
        })
            .save()
            .then(model => good(model))
            .catch(err => bad(err))
    })
}

function processExperiment(accessionObj) {
    return new Promise((good, bad) => {
        ExperimentModel({
            accession: accessionObj.accession,
            xml: accessionObj.xml
        })
            .save()
            .then((model) => good(model))
            .catch(err => bad(err))
    })
}

function processRun(accessionObj) {
    return new Promise((good, bad) => {
        ExperimentModel.filter({accession: accessionObj.experimentAccession})
            .then(experiments => {

                if (experiments && experiments.length) {

                    RunModel({
                        accession: accessionObj.accession,
                        xml: accessionObj.xml,
                        experimentID: experiments[0].id
                    }).save()
                        .then(model => {

                            Promise.all(
                                accessionObj.urls.map(url => {
                                    return new ReadModel({
                                        runID: model.id,
                                        url: url
                                    }).save()
                                })
                            ).then(reads => {
                                return good(model);
                            })
                                .catch(err => bad(err));


                        })
                        .catch(err => bad(err));
                } else {
                    return bad(new Error(`no experiments found for run, ${accessionObj.accession}`))
                }
            })
    })
}

// const promiseSerial = funcs => {
//     funcs.reduce((promise, func) =>
//             promise.then(result => func().then(Array.prototype.concat.bind(result))),
//         Promise.resolve([]));
// };

function process() {

    return new Promise((good, bad) => {

        checkAll()
            .then(results => {

                console.log('\nstudies:');
                Promise.all(
                    results.studies.map(studyID => {
                        return new Promise((g2, b2) => {
                            ENA.Study.GetStudy(studyID)
                                .then(studyObject => {
                                    processStudy(studyObject)
                                        .then(studyModel => g2())
                                        .catch(err => b2(err));
                                })
                                .catch(err => b2(err));
                        })

                    })
                )
                    .then(() => {
                        console.log('\nsamples:');
                        return Promise.all(
                            results.samples.map(sampleID => {
                                return new Promise((g2, b2) => {
                                    ENA.Sample.GetSample(sampleID)
                                        .then(sampleObject => {
                                            processSample(sampleObject).then(studyModel => g2())
                                                .catch(err => b2(err));
                                        })
                                        .catch(err => b2(err));
                                })
                            })
                        )
                    })
                    .then(() => {
                        console.log('\nexperiments:');
                        return Promise.all(
                            results.experiments.map(experimentID => {
                                return new Promise((g2, b2) => {
                                    ENA.Experiment.GetExperiment(experimentID)
                                        .then(experimentObject => {
                                            processExperiment(experimentObject).then(studyModel => g2())
                                                .catch(err => b2(err));
                                        })
                                        .catch(err => b2(err));
                                });
                            })
                        )
                    })

                    .then(() => {
                        console.log('\nruns:');
                        return Promise.all(
                            results.runs.map(runID => {
                                return new Promise((g2, b2) => {
                                    ENA.Run.GetRun(runID)
                                        .then(runObject => {
                                            processRun(runObject)
                                                .then(() => {
                                                    return g2();
                                                })
                                                .catch(err => b2(err));

                                        })
                                        .catch(err => b2(err));

                                })
                            })
                        )
                    })





                    // Promise.all(
                    //     [Promise.all(
                    //         results.studies.map(studyID => {
                    //             return ENA.Study.GetStudy(studyID)
                    //                 .then(studyObject => processStudy(studyObject))
                    //         })
                    //     ),
                    //
                    //         Promise.all(
                    //             results.samples.map(sampleID => {
                    //                 return ENA.Sample.GetSample(sampleID)
                    //                     .then(sampleObject => processSample(sampleObject))
                    //             })
                    //         ),
                    //
                    //         Promise.all(
                    //             results.experiments.map(experimentID => {
                    //                 return ENA.Experiment.GetExperiment(experimentID)
                    //                     .then(experimentObject => processExperiment(experimentObject))
                    //             })
                    //         ),
                    //
                    //         Promise.all(
                    //             results.runs.map(runID => {
                    //                 return ENA.Run.GetRun(runID)
                    //                     .then(runObject => processRun(runObject));
                    //             })
                    //         )
                    //     ]
                    // )
                    .then(() => {
                        return good()
                    })
                    .catch(err => bad(err));

            })
            .catch(err => {
                console.error(err);
                return bad(err);
            });


    })
}

module.exports = {
    process
};