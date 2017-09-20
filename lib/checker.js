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

module.exports = {

    checkExperiments() {
        return check(ENA.Experiment.ListAllExperiments, ExperimentModel)
    },
    checkSamples() {
        return check(ENA.Sample.ListAllSamples, SampleModel)
    },
    checkStudies() {
        return check(ENA.Study.ListAllStudies, StudyModel)
    },
    checkRuns() {
        return check(ENA.Run.ListAllRuns, RunModel)
    },
    checkAll() {
        return new Promise((good, bad) => {
            Promise.all([this.checkStudies(), this.checkSamples(), this.checkExperiments(), this.checkRuns()])
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

        // return Promise.all([this.checkStudies(), this.checkSamples(), this.checkExperiments(), this.checkRuns()])
    },
    processNewItems(array, Model) {

        //if its a run

        //if its a experiment
        //get its study and sample

        //if its a sample


        //if its a study
        //put it at the top


        // return Promise.all(newRunIDS.map(nrID => {
        //         return new Promise((good, bad) => {
        //             ENA.Run.GetRun(nrID)
        //                 .then(runObject => {
        //
        //                     //TODO create folders
        //
        //                     //TODO download xml
        //
        //                     //TODO create model
        //                     new RunModel({
        //                         accession: runObject.accession,
        //                         xml: runObject.xml
        //                     })
        //                         .save()
        //                         .then(savedRun => good(savedRun))
        //                         .catch(err => bad(err))
        //                 })
        //
        //                 //TODO download files
        //
        //                 .catch(err => bad(err))
        //         });
        //
        //     })

    }
};