const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = mongoose.model('activities');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Activities Index
router.get('/', (req, res) => {
    Activity.find({status:'public'})
        .populate('user')
        .then(activities => {
            res.render('activities/index', {
                activities: activities
            });
        });
});

// Add Activity Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('activities/add');
});

// Process Add Activities
router.post('/', (req, res) => {
    let allowComments;
    if(req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newActivity = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    //Create Activity
    new Activity(newActivity)
        .save()
        .then(activity => {
            res.redirect(`/activities/show/${activity.id}`)
        })
});

router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('activities/edit');
});

// Show Single Activity
router.get('/show/:id', (req, res) => {
    Activity.findOne({
        _id: req.params.id
    })
    .then(activity => {
        res.render('activities/show', {
            activity: activity
        });
    });
});



module.exports = router;