const thinky = require('../lib/thinky.js');
const r = thinky.r;
const type = thinky.type;
// const ENA = require('../lib/ena');

const Read = thinky.createModel("Read", {
    id: type.string(),
    runID: type.string().required(),
    createdAt: type.date().default(r.now()),
    // url: type.string().required(),
    fileName: type.string().required(),
    ftpPath: type.string().required(),
    // accession: type.string().required(),
    // xml: type.string().required()


    ascii_offset: type.string(),
    checksum: type.string(),
    checksum_method: type.string(),
    filetype: type.string(),
    quality_encoding: type.string(),
    quality_scoring_system: type.string()
});

module.exports = Read;


// Run.ensureIndex("accession");

// Run.define('getObject', function () {
//     return ENA.Util.XML2Object(this.xml)
// });


const Run = require('./run');
Run.belongsTo(Run, 'run', 'runID', 'id');