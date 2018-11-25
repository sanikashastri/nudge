const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/database');

router.post('/register', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to register user'});
        } else {
            res.json({ success: true, msg: 'User registered'});
        }
    });
});

router.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUser(username, (err, user) => {
        if (err) {
            throw err;
        }

        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                throw err;
            }

            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'})
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({user: req.user});
});

router.put('/update', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username
    });
    let id = req.body._id;

    User.changeUser(newUser, id, (err, user) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to change user'});
        } else {
            const token = jwt.sign(newUser.toJSON(), config.secret, {
                expiresIn: 604800 // 1 week
            });

            res.json({
                success: true,
                token: 'JWT ' + token,
                user: {
                    id: id,
                    name: newUser.name,
                    username: newUser.username,
                    email: newUser.email
                }
            });
        }
    });
});

module.exports = router;