const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    department: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    }
})

userSchema.methods.createUser = function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
        if(err) throw err;
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            return user.save(cb);
        })
    })
}

userSchema.statics.comparePassword = function(password, hash, cb) {
    return bcrypt.compare(password, hash, cb);
}

module.exports = User = mongoose.model('user', userSchema);