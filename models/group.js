const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        required: true
    },
    members: {
        type: Array
    }
});

const Group = module.exports = mongoose.model('Group', GroupSchema);

module.exports.addGroup = function(newGroup, callback) {
    newGroup.save(callback);
}

module.exports.getGroups = function(admin, callback) {
    const query = {
        admin: admin
    }
    Group.find(query, callback);
}

module.exports.changeGroup = function(newGroup, id, callback) {
    Group.findOneAndUpdate({_id: id}, {$set: {name: newGroup.name, admin: newGroup.admin, members: newGroup.members}}, callback);
}
