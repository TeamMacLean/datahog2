const thinky = require('../lib/thinky.js');
const r = thinky.r;
const type = thinky.type;
const ENA = require('../lib/ena');
const config = require("../config");
const path = require('path');
const fs = require('fs-extra');

const Run = thinky.createModel("Run", {
    id: type.string(),
    experimentID: type.string().required(),
    createdAt: type.date().default(r.now()),
    accession: type.string().required(),
    xml: type.string().required()
});

module.exports = Run;

Run.ensureIndex("accession");

Run.define('getObject', function () {
    return ENA.Util.XML2Object(this.xml)
});


Run.define('downloadReads', function () {
    return new Promise((good, bad) => {

        // const run = this;

        //TODO re get this run but with .getJoin()
        Run.get(this.id)
            .getJoin()
            .run()
            .then(run => {

                const dataRoot = config.dataRoot;
                const experimentsFolderPath = path.join(dataRoot, 'experiments');
                const experimentFolderPath = path.join(experimentsFolderPath, run.experiment.accession);
                const runFolderPath = path.join(experimentFolderPath, run.accession);
                const readsFolderPath = path.join(runFolderPath, 'reads');

                //TODO ensure experiments folder
                fs.ensureDir(dataRoot)
                    .then(() => {
                        console.log('making', experimentsFolderPath);
                        return fs.ensureDir(experimentsFolderPath);
                    })
                    .then(() => {
                        //TODO ensure experiment folder
                        console.log('making', experimentFolderPath);
                        return fs.ensureDir(experimentFolderPath);
                    })
                    .then(() => {
                        //TODO ensure run folder
                        console.log('making', runFolderPath);
                        return fs.ensureDir(runFolderPath);
                    })
                    .then(() => {
                        //TODO ensure reads folder
                        console.log('making', readsFolderPath);
                        return fs.ensureDir(readsFolderPath);
                    })
                    .then(() => {
                        //TODO download reads to ${}
                        return Promise.all(
                            run.reads.map(read => {
                                return ENA.Util.ftpDownload(read.url, readsFolderPath);
                            })
                        )

                    })
                    .then(() => {
                        //TODO respond
                        return good();
                    })
                    .catch(err => {
                        console.error(err)
                    })
            })
            .catch(err => bad(err));


    })
});


const Experiment = require('./experiment');
Run.belongsTo(Experiment, 'experiment', 'experimentID', 'id');

const Read = require('./read');
Run.hasMany(Read, 'reads', 'id', 'runID');
