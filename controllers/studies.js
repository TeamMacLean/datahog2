const StudyModel = require('../models/study');

const renderError = require('../lib/renderError');

module.exports = {
    index(req, res) {

        StudyModel
            .then(studies => {
                return res.render('studies/index', {studies});
            })
            .catch(err => {
                return renderError(err, res);
            })

    }
};