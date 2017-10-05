const StudyModel = require('../models/study');

const renderError = require('../lib/renderError');

module.exports = {
    index(req, res) {
        const myGroupShortName = req.user.group.shortName;
        StudyModel
            .filter(function (study) {
                return study.hasFields('group').not().or(study('group').eq(myGroupShortName))
            })
            .then(studies => {

                const mine = [];
                const unclaimed = [];

                studies.map(study => {

                    if (study.group) {
                        if (study.group === myGroupShortName) {
                            mine.push(study);
                        }
                    } else {
                        unclaimed.push(study);
                    }

                });

                return res.render('studies/index', {studies: {mine, unclaimed}});
            })
            .catch(err => {
                return renderError(err, res);
            })

    }
};