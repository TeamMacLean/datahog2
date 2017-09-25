const check = require('./lib/checker');
const fs = require('fs');
const path = require('path');
const http = require('http');
const ENA = require('./lib/ena');
const config = require('./config');

// const Util = require('./lib/ena/util');

check.process()
    .then(() => {
        console.log('DONE');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit();
    })