const schedule = require('node-schedule');
const checker = require('./lib/checker');
const RunModel = require('./models/run');
const ENA = require('./lib/ena');

const checkerJob = schedule.scheduleJob('0 0 * * *', function () {
    checker.checkRuns()
        .then(newRunIDS => {





        })
        .catch(err => {
            //TODO run again in 10 mins?
        })
});