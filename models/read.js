const thinky = require('../lib/thinky.js');
const r = thinky.r;
const type = thinky.type;
// const ENA = require('../lib/ena');

const Read = thinky.createModel("Read", {
    id: type.string(),
    runID: type.string().required(),
    createdAt: type.date().default(r.now()),
    url: type.string().required(),
    fileName: type.string().required()
    // accession: type.string().required(),
    // xml: type.string().required()
});

module.exports = Read;


Read.pre('save', function () {
    this.fileName = this.url.split('/').pop();
});
// Run.ensureIndex("accession");

// Run.define('getObject', function () {
//     return ENA.Util.XML2Object(this.xml)
// });


const Run = require('./run');
Run.belongsTo(Run, 'run', 'runID', 'id');