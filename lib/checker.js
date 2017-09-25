const ENA = require("./ena");
const RunModel = require('../models/run');
const SampleModel = require('../models/sample');
const ExperimentModel = require('../models/experiment');
const StudyModel = require('../models/study');

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

    return StudyModel({
        accession: accessionObj.accession,
        xml: accessionObj.xml
    })
        .save()

}

function processSample(accessionObj) {

    return SampleModel({
        accession: accessionObj.accession,
        xml: accessionObj.xml
    })
        .save()

}

function processExperiment(accessionObj) {

    return ExperimentModel({
        accession: accessionObj.accession,
        xml: accessionObj.xml
    })
        .save()

}

function processRun(accessionObj) {

    return RunModel({
        accession: accessionObj.accession,
        xml: accessionObj.xml
    }).save()

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

                Promise.all(
                    [Promise.all(
                        results.studies.map(studyID => {
                            return ENA.Study.GetStudy(studyID)
                                .then(studyObject => processStudy(studyObject))
                        })
                    ),

                        Promise.all(
                            results.samples.map(sampleID => {
                                return ENA.Sample.GetSample(sampleID)
                                    .then(sampleObject => processSample(sampleObject))
                            })
                        ),

                        Promise.all(
                            results.experiments.map(experimentID => {
                                return ENA.Experiment.GetExperiment(experimentID)
                                    .then(experimentObject => processExperiment(experimentObject))
                            })
                        ),

                        Promise.all(
                            results.runs.map(runID => {
                                return ENA.Run.GetRun(runID)
                                    .then(runObject => processRun(runObject));
                            })
                        )
                    ]
                )
                    .then(() => {
                        return good()
                    })
                    .catch(err => bad(err));

            })
            .catch(err => {
                console.error(err);
                return bad(err);
                // process.exit();
            });


    })
}

module.exports = {
    process
};