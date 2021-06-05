var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        name: String,
        lastname: String,
        email: String,
        couponcode: String,
        password: String,
        phone: String,
        referralcode: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        username: String,
    },
    linkedin: {
        id: String,
        token: String,
        name: String,
        email: String,
        profilepictureurl: String,
        any: {},
        anyupdated: {}
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String,
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
    },
    email: String,
    added: String,
    unsubscribed: String,
    isadmin: String,
    storiesread: Array,
    storiesshared: Array,
    elementswatched: [{ type : String }],
    countstories: Number,
    sharedstories: Number,
    courses: Array,
    batches: Array,
    batchesformatted: Array,
    certificates: Array,
    paymentids: Array,
    notifications: Array,
    role: String,
    company: String,
    token: String,
    date: Date,
    city: String,
    collegename: String,
    collegestream: String,
    collegeyear: String,
    hiringrationale: String,
    promotionrationale: String,
    approved: Boolean,
    createddate: {
        type: Date,
        default: new Date()
    },
    loggedin: Date
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
