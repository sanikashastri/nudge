const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Group = require('../models/group');

router.post('/create', (req, res) => {
    let newGroup = new Group({
        name: req.body.name,
        admin: req.body.admin,
        members: req.body.members
    });

    Group.addGroup(newGroup, (err, group) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to create group'});
        } else {
            res.json({ success: true, msg: 'Group created'});
        }
    });
});

router.get('/:admin', (req, res) => {
    Group.getGroups(req.params.admin, (err, groups) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to show groups'});
        } else {
            res.json({groups: groups});
        }
    });
});

router.put('/update', (req, res) => {
    let newGroup = new Group({
        name: req.body.name,
        admin: req.body.admin,
        members: req.body.members
    });
    let id = req.body._id;

    Group.changeGroup(newGroup, id, (err, group) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to change group'});
        } else {
            res.json({ success: true, msg: 'Group changed'});
        }
    });
});

router.post('/authenticate', (req, res) => {
    const email = req.body.email;

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            throw err;
        }

        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        } else {
            return res.json({success: true, msg: 'User found'});
        }
    });
});

module.exports = router;
