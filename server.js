const schedule = require('node-schedule');
const checker = require('./lib/checker');
const RunModel = require('./models/run');
const ENA = require('./lib/ena');

const checkerJob = schedule.scheduleJob('0 0 * * *', function () {
    checker.checkAll()
        .then(results => {
            console.log(`${results.studies.length} new studies found`);
            console.log(`${results.samples.length} new samples found`);
            console.log(`${results.experiments.length} new experiments found`);
            console.log(`${results.runs.length} new runs found`);


            results.runs.map(runID => {

                ENA.Run.GetRun(runID)
                    .then(runObject => {
                        //TODO runObject.getStack() (returns run:{experiment:{sample:{study:{}}}}

                        runObject.getStack()
                            .then(runStack => {

                                // ensureFolder(path.join(config.dataRoot, runStack.study.accession));
                                // ensureFolder(path.join(config.dataRoot, runStack.study.accession, runStack.sample.accession));
                                // ensureFolder(path.join(config.dataRoot, runStack.study.accession, runStack.sample.accession, runStack.experiment.accession));
                                // ensureFolder(path.join(config.dataRoot, runStack.study.accession, runStack.sample.accession, runStack.experiment.accession, runStack.accession));

                                //TODO get run files

                                // let fileDestinationDir = path.join(config.dataRoot, runStack.study.accession, runStack.sample.accession, runStack.experiment.accession, runStack.accession);

                                // getRunFiles(runStack, fileDestinationDir);


                                console.log('done stack');
                                // process.exit();

                            })
                            .catch(err => {
                                console.error(err);
                            })

                    })

            });


            // results.studies.map(studyID => {
            //     ENA.Study.GetStudy(studyID)
            //         .then(study => {
            //             let newPath = path.resolve(path.join(config.dataRoot, study.accession));
            //             ensureFolder(newPath);
            //         })
            //         .catch(err => console.error(err));
            // });
            //
            // results.samples.map(sampleID => {
            //     ENA.Sample.GetSample(sampleID)
            //         .then(sample => {
            //
            //         })
            // })

            // process.exit();
        })
        .catch(err => {
            console.error(err);
            process.exit();
        });


});

const app = require('./app');
const log = require('./lib/log');
const config = require('./config.js');

const port = process.env.PORT || config.port || 1337;

app.listen(port, '0.0.0.0', () => {
    log.success('Listening on port', port);
});