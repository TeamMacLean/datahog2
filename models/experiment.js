const thinky = require('../lib/thinky.js');
const r = thinky.r;
const type = thinky.type;
const ENA = require('../lib/ena');
const config = require('../config');

const Experiment = thinky.createModel("Experiment", {
    id: type.string(),
    createdAt: type.date().default(r.now()),
    accession: type.string().required(),
    xml: type.string().required(),
    group: type.string()
});

module.exports = Experiment;

Experiment.define('getObject', function () {
    return ENA.Util.XML2Object(this.xml)
});

Experiment.define('getGroup', function () {
    return config.groups.reduce((p, c) => {
        return c.shortName === this.group ? c : p;
    }, {})
});

Experiment.define('groupHasAccess', function (group) {
    return !this.group || group === this.group;
});

Experiment.ensureIndex("accession");

// const Study = require('./study');
// const Sample = require('./sample');
const Run = require('./run');

Experiment.hasMany(Run, 'runs', 'id', 'experimentID');
