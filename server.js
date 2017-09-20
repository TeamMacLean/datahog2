// const schedule = require('node-schedule');
// const checker = require('./lib/checker');
// const RunModel = require('./models/run');
// const ENA = require('./lib/ena');
//
// const checkerJob = schedule.scheduleJob('0 0 * * *', function () {
//     checker.checkRuns()
//         .then(newRunIDS => {
//
//
//
//
//
//         })
//         .catch(err => {
//             //TODO run again in 10 mins?
//         })
// });

const app = require('./app');
const log = require('./lib/log');
const config = require('./config.js');

const port = process.env.PORT || config.port || 1337;

app.listen(port, '0.0.0.0', () => {
    log.success('Listening on port', port);
});