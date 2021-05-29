// const { initialize } = require("passport");

var marks={};
var position=0;

var HOST="http://localhost:12000";
var quiz={};

window.addEventListener('load', (event) => {
  initialize();
});

// window.addEventListener('load', (event) => {
//   console.log('23');
// });

function toggleMark(opNo)
{
  // opNo = opNo -1;
  var qNo = position-1;
  if(!marks[qNo].open)
  {
    console.log("evaluation already done");
    return;
  }
  
  var option=document.getElementById("q"+qNo+"op"+opNo);
  option.classList.toggle("w3-card");
  if(!marks[qNo].open)
  {
    console.log("question has been evaluated!");
    return;
  }
  if(marks[qNo].marked.includes(opNo)){
    marks[qNo].marked.splice(marks[qNo].marked.indexOf(opNo),1);
  }
  else{
    marks[qNo].marked.push(opNo);
  }
}


function evaluateQuestion()
{
  var qNo = position-1;
  if(!marks[qNo].open)
  {
    console.log("evaluation already done");
    return;
  }
  
  var question = quiz.questions[qNo];
  var alternatives = question.alternatives;
  var alternativesLength= question.alternatives.length;
  var allcorrect=true;
  var marking = marks[qNo].marked;
  // console.log(marking);
  marks[qNo].open=false;
  for(var i=0;i<alternativesLength;i++)
  {
    var option=document.getElementById("q"+qNo+"op"+i);
     if(alternatives[i].isCorrect)
     { 
       console.log(1);
       option.classList.toggle("w3-white");
       option.classList.toggle("w3-green");
       //correct option should be selected!
       if(!marking.includes(i+""))
       {
        allcorrect=false;
       }
     }
     else{
      console.log(2);
      //correct option should be selected!
      if(marking.includes(i+""))
      {
        option.classList.toggle("w3-white");
        option.classList.toggle("w3-red");
        allcorrect=false;
      }
     }
  }

  // changing button ui. hide evaluate, show next and show status
  // status0,next0, evaluate0
  statusd=document.getElementById("status"+qNo);
  console.log("status"+qNo);
  // status.classList.toggle("w3-hide");
  console.log(statusd);
  if(allcorrect)
  {
    statusd.innerHTML="Correct";
    
    statusd.classList.toggle("w3-text-green");
  }
  else{
    statusd.innerHTML="Incorrect";
    statusd.classList.toggle("w3-text-red");
  }

  next=document.getElementById("next"+qNo);
  next.classList.toggle("w3-hide");

  evaluate=document.getElementById("evaluate"+qNo);
  evaluate.classList.toggle("w3-hide");
}


function nextt()
{
  var pages = document.getElementsByClassName("pages");

  for(var i = 0; i<pages.length;i++)
  {
    pages[i].classList.add("w3-hide");
  }

  position++;
  pages[position].classList.toggle("w3-hide");
}

async function get(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}


function quizRecieved(new_quiz)
{
  quiz=new_quiz;
  var totalQuestions = quiz.questions.length;

  for(var i = 0; i<totalQuestions; i++)
  {
    marks[i] = {marked:[],open:true};
  }
}


function initialize(){
  console.log("initializing");
  get(HOST+'/api/quiz/quiz/'+quizId).then((data)=>{
    if(data.status=="success")
    {
      quizRecieved(data.data);
    }
    else{
      alert("Some error has occured");
    }
  });
 
}


function restart(){
  location.reload();
}