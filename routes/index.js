const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = mongoose.model('activities');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Activity.find({user: req.user.id})
        .sort({date:'desc'})
        .then(activities => {
            res.render('index/dashboard', {
                activities: activities
            });
        });
});


module.exports = router;