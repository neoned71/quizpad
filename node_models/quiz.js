const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const QuizSchema = new mongoose.Schema({
    title:String,
    questions: [{type:ObjectId,ref:'questions'}],
    owner_id:{type: ObjectId, ref:'users'},
    timestamp:{type:Date,default:Date.now},
})

Quiz =mongoose.model('quiz', QuizSchema);

Quiz.getQuiz=async function(quiz_id)
{
    console.log(quiz_id);
    var c=await Quiz.findOne({_id:quiz_id}).populate('questions').exec();
    return c;
}

Quiz.getAllQuiz=async function(condition=null)
{
    var t= await Quiz.find(condition, null, {sort: {timestamp: -1}});
    return t;
}

Quiz.removeQuiz=async function(quiz_id,user_id)
{
    console.log(quiz_id);
    console.log(user_id);
    var t = await Quiz.deleteOne({_id:quiz_id,owner_id:user_id});
    console.log(t);
    return t.ok==1;
}

module.exports = Quiz;