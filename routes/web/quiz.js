const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = require('../../node_models/questions'); // includes our model
const Quizes = require('../../node_models/quiz');
// const Subject = require('../node_models/Subject')

//Everything works
// get all user questions
router.get('/questions', async (req, res) => {
    var ret = {status:"failed",message:"",code:-1};
    // var user_id=req.user.id;
    var user_id="60918652f0dea91fce297dbd";
    try {
        const questions = await Questions.getAllQuestions({owner_id:user_id});
        ret.data=questions;
        ret.status="success";
        ret.code=1;
        return res.status(200).json(ret);
    }
    catch (error) {
        ret.message=error;
        return res.status(500).json(ret);
    }
})

// get one question
router.get('/question/:id', async (req, res) => {
    
    const _id = req.params.id;
    var ret = {status:"failed",message:"",code:-1};
    try {
        const question = await Questions.getQuestion(_id);
        ret.data=question;
        ret.status="success";
        ret.code=1;
        return res.status(200).json(ret);
    }
    catch (error) {
        ret.message=error;

        return res.status(500).json(ret);
    } 
});

router.get('/create_question', async (req, res) => {
    // var ret = {status:"failed",message:"",code:-1};
    var user_id=req.user.id;
    var name =req.user.name;
    // var user_id="60918652f0dea91fce297dbd";
    // const quizes = await Quizes.getAllQuiz({owner_id:user_id});
    try{
        const questions = await Questions.getAllQuestions({owner_id:user_id});
        res.render("pages/create_question",{user:req.user});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).end("Some error occured and soon will be fixed!");
    }
   
});

//quiz
router.get('/home', async (req, res) => {
    // var ret = {status:"failed",message:"",code:-1};
    var user_id=req.user._id;
    var name =req.user.name;
    // var user_id="60918652f0dea91fce297dbd";
    const quizes = await Quizes.getAllQuiz({owner_id:user_id});
    try{
        res.status(200).render("pages/",{quizes:quizes,name:name});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).end("Some error occured and soon will be fixed!");
    }
   
});

//quiz
router.get('/create_quiz', async (req, res) => {
    // var ret = {status:"failed",message:"",code:-1};
    var user_id=req.user.id;
    var name =req.user.name;
    // var user_id="60918652f0dea91fce297dbd";
    // const quizes = await Quizes.getAllQuiz({owner_id:user_id});
    try{
        const questions = await Questions.getAllQuestions({owner_id:user_id});
        res.render("pages/create_quiz",{questions:questions,name:name,user:req.user});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).end("Some error occured and soon will be fixed!");
    }
   
});

// get one quiz
router.get('/quiztime/:id', async (req, res) => {
    // const _id = req.params.id;
    // var user_id="60918652f0dea91fce297dbd";
    var ret = {status:"failed",message:"",code:-1};
    console.log("starting");
    try {
        const quiz = await Quizes.getQuiz(req.params.id);
        if(quiz)
        {
            res.render("pages/quiztime",{quiz:quiz});
        }
        else{
            res.status(404).render("pages/404");
        }
       

    }
    catch (error) {
        ret.message=error;
        return res.status(500).json(ret);
    }
})




module.exports = router