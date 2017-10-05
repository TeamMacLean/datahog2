const schedule = require('node-schedule');
const checker = require('./lib/checker');

const checkerJob = schedule.scheduleJob('0 0 * * *', function () {
    checker.process()
        .then(() => {
            console.log('DONE UPDATING');
            // process.exit();
        })
        .catch(err => {
            console.error(err);
            // process.exit();
        })

});

const app = require('./app');
const log = require('./lib/log');
const config = require('./config.js');

const port = process.env.PORT || config.port || 1337;

app.listen(port, '0.0.0.0', () => {
    log.success('Listening on port', port);
});