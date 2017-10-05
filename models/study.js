const thinky = require('../lib/thinky.js');
const r = thinky.r;
const type = thinky.type;

const Study = thinky.createModel("Study", {
    id: type.string(),
    createdAt: type.date().default(r.now()),
    accession: type.string().required(),
    xml: type.string().required()
});

module.exports = Study;

Study.ensureIndex("accession");