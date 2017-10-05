const ExperimentModel = require('../models/experiment');

const renderError = require('../lib/renderError');

module.exports = {
    index(req, res, next) {

        const myGroupShortName = req.user.group.shortName;

        ExperimentModel
            .filter(function (experiment) {
                return experiment.hasFields('group').not().or(experiment('group').eq(myGroupShortName))
            })
            .then(experiments => {

                // if (experiments && experiments.length) {
                const mine = [];
                const unclaimed = [];

                experiments.map(experiment => {

                    if (experiment.group) {
                        if (experiment.group === myGroupShortName) {
                            mine.push(experiment);
                        }
                    } else {
                        unclaimed.push(experiment);
                    }

                });

                return res.render('experiment/index', {experiments: {mine, unclaimed}});
                // } else {
                //     return next();
                // }


            })
            .catch(err => {
                return renderError(err, res);
            })

    },
    show(req, res, next) {


        //if claimed but not your group, dont show
        const myGroupShortName = req.user.group.shortName;

        ExperimentModel.filter({accession: req.params.accession})
            .getJoin({runs: true})
            .then(experiments => {

                if (experiments && experiments.length) {


                    if (experiments[0].groupHasAccess(myGroupShortName)) {
                        return res.render('experiment/show', {experiment: experiments[0]});
                    } else {
                        return renderError(new Error(`You do not have access to experiment ${experiments[0].accession}`))
                    }
                } else {
                    return next();
                }


            })
            .catch(err => renderError(err, res));

    },
    claim(req, res, next) {

        const group = req.body.group;
        const experimentAccession = req.params.accession;

        if (!group) {
            return renderError(new Error('No group provided'), res)
        }

        ExperimentModel.filter({accession: experimentAccession})
            .then(experiments => {

                const experiment = experiments[0];

                experiment.group = group;
                experiment.save()
                    .then(() => {

                        return res.redirect(`/experiments/${experiment.accession}`);

                    })
                    .catch(err => renderError(err, res));
            })
            .catch(err => renderError(err, res));
    }
};