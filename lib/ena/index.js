module.exports = {
    Experiment: require('./experiment'),
    Run: require('./run'),
    Sample: require('./sample'),
    Study: require('./study'),
    Util: require('./util')
};


// module.exports = class ENA {
//     constructor(username, password) {
//         this.Experiment = require('./experiment');
//         this.Run = require('./run');
//         this.Sample = require('./sample');
//         this.Study = require('./study');
//         this.Util = require('./util');
//
//         this.username = username;
//         this.password = password;
//
//         this.base_url = 'https://www.ebi.ac.uk/ena/submit/drop-box/';
//     }
// };