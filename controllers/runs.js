const RunModel = require('../models/run');

const renderError = require('../lib/renderError');

const config = require("../config");
const path = require('path');
const fs = require('fs-extra');
const Client = require('ftp');
const {URL} = require('url');

//TODO move this!


module.exports = {
    show(req, res, next) {
        const myGroupShortName = req.user.group.shortName;
        RunModel.filter({accession: req.params.accession})
            .getJoin({experiment: true, reads: true})
            .then(runs => {

                if (runs && runs.length) {

                    if (runs[0].experiment.groupHasAccess(myGroupShortName)) {

                        return res.render('runs/show', {run: runs[0]});

                    } else {
                        return renderError(new Error(`You do not have access to run ${run.accession}`))

                    }


                } else {
                    return next();
                }


            })
            .catch(err => renderError(err, res));

    },
    downloadReads(req, res, next) {

        const runAccession = req.params.accession;

        RunModel.filter({
            accession: runAccession
        }).getJoin({experiment: true, reads: true})
            .then(runs => {

                if (runs && runs.length) {

                    const run = runs[0];

                    run.downloadReads
                        .then(() => {//TODO make symlinks
                            return res.send('downloaded');
                        })

                } else {
                    return next(); //no runs found for accession
                }

            })


    }
};