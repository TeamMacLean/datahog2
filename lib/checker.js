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
        return check(ENA.Sample.ListAllExperiments, SampleModel)
    },
    checkStudies() {
        return check(ENA.Study.ListAllExperiments, StudyModel)
    },
    checkRuns() {
        return check(ENA.Run.ListAllExperiments, RunModel)
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