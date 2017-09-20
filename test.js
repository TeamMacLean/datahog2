const check = require('./lib/checker');
const fs = require('fs');
const path = require('path');
const http = require('http');
const ENA = require('./lib/ena');
const config = require('./config');

// const Util = require('./lib/ena/util');

function ensureFolder(path) {

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

}

function getRunFiles(runObject) {
    //
    // let dir1 = runObject.accession.substr(0, 6);
    // let dir2 = runObject.accession;
    // let rootURL = "ftp://ftp.sra.ebi.ac.uk/vol1/fastq/"
    //
    // let t = "ftp://ftp.sra.ebi.ac.uk/vol1/ERF731/ERF7316311/fastq/ERA464/ERA464959/fastq/LIB1636_ACTTGA_L001_R1_001.fastq.gz";
    //
    // runObject.files.map((fileObject, index) => {
    //     let filename = runObject.accession;
    //     if (runObject.file.length > 1) {
    //         filename = filename + `_${index}`
    //     }
    //
    //
    //     download(rootURL+dir1+dir2+filename+'fastq.gz')
    // });
    //
    // var download = function (url, dest, cb) {
    //     var file = fs.createWriteStream(dest);
    //     var request = http.get(url, function (response) {
    //         response.pipe(file);
    //         file.on('finish', function () {
    //             file.close(cb);  // close() is async, call cb after close completes.
    //         });
    //     }).on('error', function (err) { // Handle errors
    //         fs.unlink(dest); // Delete the file async. (But we don't check the result)
    //         if (cb) cb(err.message);
    //     });
    // };

}

check.checkAll()
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

                            ensureFolder(path.join(config.dataRoot, runStack.study.accession));
                            ensureFolder(path.join(config.dataRoot, runStack.study.accession, runStack.sample.accession));
                            ensureFolder(path.join(config.dataRoot, runStack.study.accession, runStack.sample.accession, runStack.experiment.accession));
                            ensureFolder(path.join(config.dataRoot, runStack.study.accession, runStack.sample.accession, runStack.experiment.accession, runStack.accession));

                            //TODO get run files

                            let fileDestinationDir = path.join(config.dataRoot, runStack.study.accession, runStack.sample.accession, runStack.experiment.accession, runStack.accession);

                            getRunFiles(runStack, fileDestinationDir);


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