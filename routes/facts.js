const express = require('express');
const router = express.Router();

const Fact = require('../models/fact');

router.post('/', (req, res) => {
    let newFact = defineFact(req);

    Fact.addFact(newFact, (err, fact) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to create fact'});
        } else {
            res.json({ success: true, msg: 'Fact created'});
        }
    })
});

function defineFact(req) {
    let newFact = new Fact({
        _id: req.params._id,
        name: req.body.name,
        value: req.body.value
    });
    return newFact;
}

router.get('/:name', (req, res) => {
    let name = req.params.name;

    Fact.showFact(name, (err, fact) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to show fact'});
        } else {
            res.json({ success: true, msg: 'Fact shown'})
        }
    })
});

router.put('/:_id', (req, res) => {
    let newFact = defineFact(req);
    let _id = req.params._id;

    Fact.changeFact(newFact, (err, fact) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to change fact'});
        } else {
            res.json({ success: true, msg: 'Fact changed'})
        }
    })
});

module.exports = router;