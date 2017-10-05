const express = require('express');
const router = express.Router();
const AuthLib = require('../lib/auth');
const AuthController = require('../controllers/auth');
const ExperimentsController = require('../controllers/experiments');
const RunsController = require('../controllers/runs');
const StudiesController = require('../controllers/studies');
const SamplesController = require('../controllers/samples');
const GroupsController = require('../controllers/groups');
const HelpController = require('../controllers/help');
router.route('/')
    .get((req, res) => res.render('index'));

router.route(['/signin', '/login'])
    .get(AuthController.signIn)
    .post(AuthController.signInPost);

router.route(['/signout', '/logout'])
    .get(AuthController.signOut);

router.route('/groups')
    .all(isAuthenticated)
    .get(GroupsController.index);


router.route('/experiments')
    .all(isAuthenticated)
    .get(ExperimentsController.index);
router.route('/experiments/:accession')
    .all(isAuthenticated)
    .get(ExperimentsController.show);
router.route('/experiments/:accession/claim')
    .all(isAuthenticated)
    .post(ExperimentsController.claim);

router.route('/studies')
    .all(isAuthenticated)
    .get(StudiesController.index);

router.route('/samples')
    .all(isAuthenticated)
    .get(SamplesController.index);

router.route('/runs/:accession')
    .all(isAuthenticated)
    .get(RunsController.show);
router.route('/runs/:accession/download')
    .all(isAuthenticated)
    .get(RunsController.downloadReads);


router.route('/help')
    .get(HelpController.index);


router.route('*')
    .all(function (req, res, next) {
        return res.status(404).render('404');

    });

module.exports = router;

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.returnTo = req.path;
        return res.redirect('/signin');
    }
}

function isAdmin(req, res, next) {
    if (AuthLib.isAdmin(req.user.username)) {
        return next();
    } else {
        return res.send('You cannot access this page, you are not an admin.');
    }
}