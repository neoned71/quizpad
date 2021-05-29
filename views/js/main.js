
// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  // Example POST method implementation:
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

  async function deleteMethod(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'delete', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
      } 
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }


function attemptLogin(){
    var email=document.forms['login_form']['email'].value;
    var password=document.forms['login_form']['password'].value;
    var body = { email:email , password:password } ;
    postData('/api/auth/login',body).then(checkResponse);
}


function checkResponse(data){
    if(data.status=="success"){
        window.location.href="/";
    }
    else{
        alert("username or password not valid");
    }
}

function composeQuiz()
{
    location.href = "create_quiz";
}

function composeQuestion()
{
    location.href = "create_question";
}


//create quiz page
function toggleOptions(id)
{
  var element = document.getElementById(id);
  element.classList.toggle("w3-hide");
  element.classList.toggle("w3-show");

}
var quizList=[];

function toggleQuestionSelection(id)
{
  var element = document.getElementById(id);
  element.classList.toggle("w3-dark-gray");
  element.classList.toggle("w3-green");

  if(quizList.includes(id))
  {
    quizList.splice(quizList.indexOf(id),1);

  }
  else{
    quizList.push(id);
  }

  console.log("added to the system: "+id);
}

// quiz_title
function attemptAddQuiz(){
  var title = document.getElementById('quiz_title').value;
  var data={quiz:{title:title,questions:quizList}};
  postData('../api/quiz/quiz',data).then(function(data){
    if(data.status=="success")
    {
      alert("Successfully created the Quiz!");
      location.href="/";
    }
    else{
      alert("Failed");
      console.log(data.message);
    }
  });
}


function createQuestion(){
  var text = document.getElementById('text').value;
  var alternatives = [];
  for(var i =1; i<5; i++)
  {
    var txt = document.getElementById("op"+i+"t").value;
    var chckbx = document.getElementById("op"+i+"c").checked;
    alternatives.push({text:txt,isCorrect:chckbx});
  }

  
  var data={question:{description:text,alternatives:alternatives}};
  console.log(data);
  postData('../api/quiz/question',data).then(function(data){
    if(data.status=="success")
    {
      alert("Successfully created the Question!");
      location.href="/web/create_quiz";
    }
    else{
      alert("Failed");
      console.log(data.message);
    }
  });
}


//deleting methods
function deleteQuestion(id)
{
  var a =confirm("are you sure you want to delete this question?");
  if(a){
    deleteMethod('../api/quiz/question/'+id).then(function(data){
      if(data.status=="success")
      {
        alert("Successfully deleted the Question!");
        location.reload();
      }
      else{
        alert("Failed");
        console.log(data.message);
      }
    });
  }
}

function deleteQuiz(id)
{
  var a =confirm("are you sure you want to delete this quiz?");
  if(a){
    deleteMethod('../api/quiz/quiz/'+id).then(function(data){
      if(data.status=="success")
      {
        alert("Successfully deleted the Quiz!");
        location.reload();
      }
      else{
        alert("Failed");
        console.log(data.message);
      }
    });
  }
  
}


function copyy(str)
{
  str="https://quizpad.neoned71.com/quiztime/"+str;
  
  navigator.clipboard.writeText(str).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}