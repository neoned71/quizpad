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
    var user_id=req.user.id;
    // var user_id="60918652f0dea91fce297dbd";
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

    
})

// create one question
router.post("/question",async (req, res, next) => {

    const user_id = req.user.id;
    console.log(req.body);

    // var user_id="60918652f0dea91fce297dbd";

    var ret = {status:"failed",message:"",code:-1};
    try {
        var data=req.body.question;
        data.owner_id=user_id;
        const question = new Questions(data);
        var t=await question.save();
        console.log(t);
        ret.data=question;
        ret.status="success";
        ret.code=1;
        ret.message = "question added successfully";
        return res.status(200).json(ret);
    } 
    catch (error) {
        ret.message=error;
        return res.status(500).json(ret);
    }
    
    
});

// delete one quiz question
router.delete('/question/:id', async (req, res) => {
    const user_id = req.user.id;
    // var user_id="60918652f0dea91fce297dbd";

    var ret = {status:"failed",message:"",code:-1};
    try {
        await Questions.removeQuestion(req.params.id,user_id);
        
        ret.status="success";
        ret.code=1;
        ret.message = "question deleted successfully";
        return res.status(200).json(ret);
    } 
    catch (error) {
        ret.message=error;
        return res.status(500).json(ret);
    }
});


//quiz
router.get('/quizes', async (req, res) => {
    var ret = {status:"failed",message:"",code:-1};
    var user_id=req.user.id;
    // var user_id="60918652f0dea91fce297dbd";
    try {
        const quizes = await Quizes.getAllQuiz({owner_id:user_id});
        ret.data=quizes;
        ret.status="success";
        ret.code=1;
        return res.status(200).json(ret);
    }
    catch (error) {
        ret.message=error;

        return res.status(500).json(ret);
    }
})

// get one quiz
router.get('/quiz/:id', async (req, res) => {
    // const _id = req.params.id;
    // var user_id="60918652f0dea91fce297dbd";
    var ret = {status:"failed",message:"",code:-1};
    console.log("starting");
    try {
        const quiz = await Quizes.getQuiz(req.params.id);
        ret.data=quiz;
        ret.status="success";
        ret.code=1;
        return res.status(200).json(ret);
    }
    catch (error) {
        ret.message=error;
        return res.status(500).json(ret);
    }
})

// create one quiz
router.post("/quiz", async (req, res, next) => {

    
    // var user_id="60918652f0dea91fce297dbd";
    
    var ret = {status:"failed",message:"",code:-1};
    try {
        const user_id = req.user.id;
        var data=req.body.quiz;
        data.owner_id=user_id;
        console.log(data);
        const quiz = new Quizes(data);
        await quiz.save();
        // await quiz.populate('questions');
        ret.data=quiz;
        ret.status="success";
        ret.code=1;
        ret.message = "quiz added successfully";
        return res.status(200).json(ret);
    } 
    catch (error) {
        ret.message=error;
        return res.status(500).json(ret);
    }
    
    
});

// delete one quiz
router.delete('/quiz/:id', async (req, res) => {
    const user_id = req.user.id;
    // var user_id="60918652f0dea91fce297dbd";

    var ret = {status:"failed",message:"",code:-1};
    try {
        var t = await Quizes.removeQuiz(req.params.id,user_id);
        
        ret.status="success";
        ret.code=t.ok;
        ret.message = "question deleted successfully";
        return res.status(200).json(ret);
    } 
    catch (error) {
        ret.message=error;
        return res.status(500).json(ret);
    }
});

module.exports = router