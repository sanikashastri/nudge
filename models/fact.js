const mongoose = require('mongoose');

const FactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

const Fact = module.exports = mongoose.model('Fact', FactSchema);

module.exports.addFact = function(newFact, callback) {
    newFact.save(callback);
}

module.exports.showFact = function(name, callback) {
    const query = {
        name: name
    }
    Fact.findOne(query, callback);
}

module.exports.changeFact = function(newFact, callback) {
    Fact.findByIdAndUpdate(newFact._id, newFact, { upsert: true }, callback)
}