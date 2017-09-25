const express = require('express');
const router = express.Router();
const AuthLib = require('../lib/auth');
const AuthController = require('../controllers/auth');
const ExperimentsController = require('../controllers/experiments');
const RunsController = require('../controllers/runs');
const StudiesController = require('../controllers/studies');
const SamplesController = require('../controllers/samples');
router.route('/')
    .get((req, res) => res.render('index'));

router.route(['/signin', '/login'])
    .get(AuthController.signIn)
    .post(AuthController.signInPost);

router.route(['/signout', '/logout'])
    .get(AuthController.signOut);


router.route('/experiments')
    .all(isAuthenticated)
    .get(ExperimentsController.index);

router.route('/studies')
    .all(isAuthenticated)
    .get(StudiesController.index);

router.route('/samples')
    .all(isAuthenticated)
    .get(SamplesController.index);

router.route('/runs')
    .all(isAuthenticated)
    .get(RunsController.index);

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