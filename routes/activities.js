const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = mongoose.model('activities');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Activities Index
router.get('/', (req, res) => {
    Activity.find({ status: 'public' })
        .populate('user')
        .sort({date: 'desc'})
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

// Edit Activity Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Activity.findOne({
        _id: req.params.id
    })
        .then(activity => {
            if(activity.user != req.user.id){
                res.redirect('/activities');
            } else {
                res.render('activities/edit', {
                    activity: activity
                });
            }
        });
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
    Activity.find({user: req.params.userId, status: 'public'})
        .populate('user')
        .sort({date: 'desc'})
        .then(activities => {
            res.render('activities/index', {
                activities: activities
            });
        });
});

// My user stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Activity.find({user: req.user.id})
        .populate('user')
        .then(activities => {
            res.render('activities/index', {
                activities: activities
            });
        });
});

// Process Add Activities
router.post('/', (req, res) => {
    let allowComments;
    if (req.body.allowComments) {
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
        .populate('user')
        .populate('comments.commentUser')
        .then(activity => {
            if(activity.status == 'public'){
                res.render('activities/show', {
                    activity: activity
                });
            } else {
                if(req.user){
                    if(req.user.id == activity.user._id){
                        res.render('activities/show', {
                            activity: activity
                        })
                    } else {
                        res.redirect('/activities');
                    }
                } else {
                    res.redirect('/activities');
                }
            }
        });
});


// Edit Form Process
router.put('/:id', (req, res) => {
    Activity.findOne({
        _id: req.params.id
    })
        .then(activity => {
            let allowComments;
            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }

            // New Values
            activity.title = req.body.title;
            activity.body = req.body.body;
            activity.status = req.body.status;
            activity.allowComments = allowComments;

            activity.save()
                .then(activity => {
                    res.redirect('/dashboard');
                });
        });

});

// Delete Activity
router.delete('/:id', (req, res) => {
    Activity.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard');
        });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
    Activity.findOne({_id: req.params.id})
        .then((activity) => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }

            // Add to comments array
            activity.comments.unshift(newComment);

            activity.save()
                .then(activity => {
                    res.redirect(`/activities/show/${activity.id}`)
                });
        });
});

module.exports = router;