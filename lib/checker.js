const ENA = require("./ena");
const RunModel = require('../models/run');


module.exports = {
    checkRuns() {
        return new Promise((good, bad) => {
            //Check for new Runs
            ENA.Run.ListAllRuns()
                .then(runsIDS => {
                    RunModel.run()
                        .then(dbRuns => {
                            //see if we already know about that runID
                            let notFound = runsIDS.filter(rid => {
                                return dbRuns.filter(dbr => dbr.accession === rid).length < 1
                            });
                            return good(notFound);
                        })
                        .catch(err => bad(err))
                })
                .catch(err => bad(err));
        })
    },
    processNewRuns(newRunIDS) {
        return Promise.all(newRunIDS.map(nrID => {
                return new Promise((good, bad) => {
                    ENA.Run.GetRun(nrID)
                        .then(runObject => {

                            //TODO create folders

                            //TODO download xml

                            //TODO create model
                            new RunModel({
                                accession: runObject.accession,
                                xml: runObject.xml
                            })
                                .save()
                                .then(savedRun => good(savedRun))
                                .catch(err => bad(err))
                        })

                        //TODO download files

                        .catch(err => bad(err))
                });

            })
        )
    }
};