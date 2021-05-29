const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const QuestionSchema = new mongoose.Schema({
    description: String,
    alternatives: [],
    owner_id:{type: ObjectId, ref:"users"},
    timestamp:{type:Date,default:Date.now}
})

Questions =mongoose.model('questions', QuestionSchema);




Questions.getQuestion=async function(question_id)
{
    var c=await Questions.findOne({_id:question_id});
    return c;
}


Questions.getAllQuestions=async function(condition=null)
{
    var t= await Questions.find(condition,null,{sort:{timestamp:-1}});
    return t;
}

Questions.removeQuestion=async function(question_id,owner_id)
{
    var t= await Questions.deleteOne({_id:question_id,owner_id:owner_id});
    console.log(t);
    return t.ok==1;
}


module.exports = Questions;
