const bcrypt = require("bcrypt");
const User = require("../node_models/users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { v4: uuidv4 } = require('uuid');

var crypto = require('crypto');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
    	// console.log("setup.js:desialize:"+err);
        done(err, user);
    });
});


passport.use('local_strategy_normal',
    new LocalStrategy({ usernameField: "email",passwordField:"password",passReqToCallback : true }, (req,email, password, done) => {
        // Match User
        sha256 = crypto.createHash("sha256");
        sha256.update(password);
        console.log("setup.js: inside localstrategy");
        User.findOne({ email: email}).then(user => {
            if (!user) {
                console.log("setup.js:user not found");
                return done(null, false, { message: "Please Sign Up" });
                
            } else {
                if(user.password==password){//password_hash:sha256.digest('hex')
                    console.log("setup.js:user found");
                    user.token=uuidv4();
                    return done(null, user);
                }
                else{
                    return done(null, false, { message: "wrong password" });
                }
                
            }
        })
        .catch(err => {
            console.log("setup.js:"+err);
            return done(null, false, { message: err });
        });
    })
);

module.exports = passport;
