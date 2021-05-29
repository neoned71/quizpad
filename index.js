const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
// const router = require("");

//only for mutipart forms( having forms as enctype="multipart/form-data"), other forms are not modified!
const multer = require("multer");

//middleware: upload.array()
var upload = multer();





var passportSocketio=require("passport.socketio");

var express = require('express');

var cookieParser=require("cookie-parser");

const uuid = require('uuid');

var app = express();
const http = require('http');
//var expressWs = require('express-ws')(app);

const passport = require("./passport/setup");
const apiAuth = require("./routes/api/auth");
const webAuth = require("./routes/web/auth");
const apiQuiz = require("./routes/api/quiz");
const webQuiz = require("./routes/web/quiz");

const MONGO_URI = "mongodb://127.0.0.1:27017/mixed";

//initialize mongo
mongoose
    .connect(MONGO_URI, { useUnifiedTopology: true,useNewUrlParser: true })
    .then(console.log(`MongoDB connected ${MONGO_URI}`))
    .catch(err => console.log(err));




// for json post form data
app.use(express.json());

// for url encoded post form data
app.use(express.urlencoded({ extended: false }));


var port=12000;
var sessionStore=new MongoStore({ mongooseConnection: mongoose.connection });

//initialize session middleware
var sessionMiddleWare=session({
		key:'express.sid',
        secret: "neoned71",
        resave: false,
        saveUninitialized: true,
        store: sessionStore
    });

// Express Session
app.use(sessionMiddleWare);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine","ejs");

function isAuthenticated(req, res, next) {
  if (req.user) 
  {
    next();
  } 
  else 
  {
        res.redirect('/login');
  }
}

//router redirects
app.use("/api/auth",apiAuth);
app.use("/api/quiz",apiQuiz);

const Quizes = require('./node_models/quiz');
app.use("/quiztime/:id",async function (req, res) {
	var quizId=req.params.id;
	//console.log(quizId);
	var quiz = await Quizes.getQuiz(quizId);
	// quiz = quiz.to;
	// console.log("quiz:");
	// console.log(quiz.toObject());
	// res.json(quiz);
	res.render("pages/quiztime",{quiz:quiz});
	// res.render("pages/",{name:req.user.name});
});

app.use("/web",isAuthenticated,webQuiz);

function yye(req,res,next)
{
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log(fullUrl);
	// console.log(!req.user);
	next();
}
//static redirects
app.use('/static', express.static(__dirname + '/static/'));
app.use('/img', express.static(__dirname + '/views/img/'));
app.use('/pdfs', express.static(__dirname + '/views/pdfs/'));
app.use('/fonts', express.static(__dirname + '/views/fonts'));
app.use('/web/js', express.static(__dirname + '/views/js/'));
app.use('/web/css', express.static(__dirname + '/views/css/'));
app.use('/css', express.static(__dirname + '/views/css/'));
app.use('/js', express.static(__dirname + '/views/js/'));

let count=1;
var rooms = new Map();// to store room data!!



app.get('/', isAuthenticated,function (req, res) {

	res.redirect("/web/home");
	// res.render("pages/",{name:req.user.name});

});

app.get('/create_quiz',isAuthenticated,function (req, res) {

	res.render("pages/create_quiz",{name:req.user.name});

});

app.get('/create_question',isAuthenticated,function (req, res) {

	res.render("pages/create_question",{name:req.user.name});

});


app.get("/login",(req, res) => {
	if(req.user)
	{
		res.redirect("/");
	}
	else{
		res.render('pages/login');
	}
	
});
app.get("/register",(req, res) => {res.render('pages/register');});

app.get('/logout', function(req, res){
	if(req.user)
	{
		req.user.token="";
		req.user.save();
	}
	
  	req.logout();
  	res.redirect('/login');
});

const server = http.createServer(app);
const options = { path:'/socket.io'/*,transports: ['websocket', 'polling']*/ };


//socket io
const io = require('socket.io')(server, options);
io.use(passportSocketio.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
  secret:       'neoned71',    		// the session_secret to parse the cookie
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));


function onAuthorizeSuccess(data, accept){
	console.log("success");
	accept();
}

function onAuthorizeFail(data, message, error, accept){
	if(error)
	{
		accept(new Error(message));
	}
	console.log("failed");
}

io.on('connection', socket => {
	let roomId=socket.handshake.query.room_id;
	// console.log("roomId: " +roomId);
	// console.log("roomID: "+roomId);

	if(roomId && mongoose.Types.ObjectId.isValid(roomId) )
	{
    	rooms.get(roomId).handleSocket(socket,io);
	}
	else
	{
		console.log("room_id not present");

		return;
	}
});

server.listen(port);
console.log("server started at port:"+port);
