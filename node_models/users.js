const mongoose = require("mongoose");

const UserSch = new mongoose.Schema(
    {
        name: {
            type: String
        },
        token: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        email_is_verified: {
            type: Boolean,
            default: false
        },
        password_hash: {
            type: String,
            default: false
        },
        password: {
            type: String,
            default: false
        },
        date_created: {
            type: Date,
            default: Date.now
        },
        login_time:{
            type:Date
        },
        image_url:{
            type:String
        }
    },
    { strict: false }
);

module.exports = User = mongoose.model("users", UserSch);
