const express = require("express");
const router = express.Router();
const passport = require("passport");
const { v4: uuidv4 } = require('uuid');
var validator = require("email-validator");
var crypto = require('crypto');
////////////////////////////////////////////////////////////////
// Code:

const User = require("../../node_models/users");
const { exitCode } = require("process");

router.post("/login",performLogin);
router.post("/register", (req, res, next) => {

    //absxyz is the name of the localstrategy
    var sha256 = crypto.createHash('sha256');
    sha256.update(req.body.password);
    if(validator.validate(req.body.email.length) && req.body.password.length>6){
        const newUser = new User({ email:req.body.email,password:req.body.password, password_hash:sha256.digest('hex'), name:req.body.name});
        newUser.save().then(function(){
            console.log("user has been registered");
            performLogin(req,res,next);
        }).catch((err)=>res(err));
    }
    else{
        res.status(400).json({status:"failed",message:"improper email or password"});
    }
    
});


function performLogin(req, res, next)
{
    //this callback function is called after setup.js file function has returned, its just later in that pipeline, actually, the immediate next...
    passport.authenticate("local_strategy_normal", function(err, user, info) {
        console.log("Entered authenticate");
        if (err) {
            console.log("err authenticate"+err);
            return res.status(400).json({ status:"failed",message:err });
        }

        if (!user) {
            console.log(info);
            return res.status(400).json({ status:"failed",message:info.message });
        }

        req.logIn(user, function(err) {
            if (err) {
                console.log("err login");
                return res.status(400).json({ status:"failed",message : err });
            }
            console.log("done authenticate");
            return res.status(200).json({ status:"success",message: `logged in ${user.id}` });
        });
    })(req, res, next);
}


router.post("/forgot_password/initiate", (req, res, next) => {

    //absxyz is the name of the localstrategy
    // var sha256 = crypto.createHash('sha256');
    // sha256.update(req.body.password);
    if(validator.validate(req.body.email.length)){
        var token=uuidv4();
        //find user and set in his database a link uuid code will be present there...
        User.updateOne({email: req.body.email},{$set:{"token":token}});
        
        //TODO: email the link with new token in the res object!
        res.json({status:"success"});
    }
    else{
        res.status(400).json({status:"failed",message:"improper email or password"});
    }
});



router.post("/forgot_password/set_password/:token", (req, res, next) => {
    //TODO: Create valid view partner file(.ejs file)
    User.findOne({token: token}).then(user => {
        if(!user) {
            console.log("setup.js:user not found");
            return done(null, false, { message: "Please Sign Up" });
            
        } else {

            if(req.body.password.length>6 && (req.body.password == req.body.password_re)){
                //find user and set in his database a the password...
                //also disable the link
                user.password=req.body.password;
                user.token=null;
                user.save().then(()=>res.json({status:"success"}).catch((err)=>res.json({status:"failed",message:err})));
            }
            else{
                res.status(400).json({status:"failed",message:"Check your passwords."});
            }
           
            
        }
    })
    .catch(err => {
        console.log("setup.js:"+err);
        return done(null, false, { message: err });
    });

    
});

//////////////////////////////////
// Exports:
module.exports = router;
