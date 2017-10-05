const check = require('./lib/checker');
const fs = require('fs');
const path = require('path');
const http = require('http');
const ENA = require('./lib/ena');
const config = require('./config');

const RunModel = require("./models/run");


// check.process()
//     .then(() => {
//         console.log('DONE');
//         process.exit();
//     })
//     .catch(err => {
//         console.error(err);
//         process.exit();
//     })


RunModel
    .getJoin()
    .run()
    .then(models => {

        Promise.all(
            models.map(model => {
                return model.downloadReads()
            })
        )
            .then(() => {
                console.log('DONE!');
                process.exit();
            })
            .catch(err => {
                console.error(err);
                process.exit();
            })

    })
    .catch(err => {
        console.error(err);
        process.exit();
    });
