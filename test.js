// const check = require('./lib/checker');
// const fs = require('fs');
// const path = require('path');
// const http = require('http');
// const ENA = require('./lib/ena');
// const config = require('./config');
//
// const RunModel = require("./models/run");
// const ReadModel = require('./models/read');


const fileChecker = require('./lib/fileChecker');

// check.process()
//     .then(() => {
//         console.log('DONE');
//         process.exit();
//     })
//     .catch(err => {
//         console.error(err);
//         process.exit();
//     })


// RunModel
//     .getJoin()
//     .run()
//     .then(models => {
//
//         Promise.all(
//             models.map(model => {
//                 return model.downloadReads()
//             })
//         )
//             .then(() => {
//                 console.log('DONE!');
//                 process.exit();
//             })
//             .catch(err => {
//                 console.error(err);
//                 process.exit();
//             })
//
//     })
//     .catch(err => {
//         console.error(err);
//         process.exit();
//     });


const readsFolder = '/Users/pagem/Documents/workspace/datahog2/data';
fileChecker.generateReadMD5s(readsFolder)
    .then(() => {
        return fileChecker.compareMD5s(readsFolder);
    })
    .then(() => {
        console.log('done');
        process.exit();
    })
    .catch(err => {
        console.error(err);
    });
