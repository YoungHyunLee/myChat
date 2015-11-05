var express = require('express')
  , multer = require('multer')
  , upload = multer({ dest : './uploads/'})
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , mongo = require("mongoskin")
  , path = require('path')
  , fs = require('fs')
  , bodyParser = require('body-parser');

//var port = process.env.PORT ||80;
//var mongoUrl = process.env.MONGOHQ_URL || "127.0.0.1:27017/data";

// mongoDB native 버젼.
var mongoose = require('mongoose');
mongoose.connect('mongodb://numberTest:test@ds049744.mongolab.com:49744/numbernoridb1'); // 포트번호(27017) 생략가능
// var connection1 = mongoose.createConnection('mongodb://localhost/mydatabase'); 여러 개의 db에 연결할 때 사용.

// mongodb 설정 부분.
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
	
var db = mongoose.connection,
	signUpEmailModel = null, // 회원가입시 저장하는 model
	talkMegModel = null, // 채팅방에서 서로 대화한 것을 저장하는 model
	userInfoModel = null // 개인 정보 model
// 첫 연결했을 때.
db.once('open', function(){
	console.log("db 연결!!")
	
	// 회원가입 - email 스키마 생성
	var signUpEmailSchema = new Schema({
		username : String,
		email : String,
		password : String,
		friends : Object,
		talkList : Object		
	});
	// 그 스키마를 가진 모델 생성
	var SignUpEmail = mongoose.model('signUpEmails', signUpEmailSchema);
	global.signUpEmailModel = signUpEmailModel = SignUpEmail;
	
	// 개인 회원 정보 스키마 생성
	var userInfoSchema = new Schema({
		username : String,
		myProfileMsg : String,
		myProfilePic : String
	});
	// 그 스키마를 가진 모델 생성
	var UserInfo = mongoose.model('userInfos', userInfoSchema);
	global.userInfoModel = userInfoModel = UserInfo;
	
	// 대화방 스키마 생성
	var talkMegSchema = new Schema({
		roomname : String,
		users : Array,
		Content : [
			{
				_id : 0,
				idx : Number,
				date : String,
				talkCnt : String
			}
		],
		lastIndex : Number	
	});
	// 그 스키마를 가진 모델 생성
	var TalkMeg = mongoose.model('talkMegs', talkMegSchema);
	global.talkMegModel = talkMegModel = TalkMeg;	
})


// express 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // DOM에 접근하기 위한 코드.
app.use(bodyParser.urlencoded({extended : false}));

// 파일 업로드 & 다운로드
var fileAdmin = require('./serverModule/fileAdmin.js');
app.post('/upload', upload.single('myfile'), fileAdmin.uploadFile);
app.post('/download', upload.single('myfile'), fileAdmin.downloadFile);

// 첫 페이지 로딩.
app.get('/', function (req, res) {	
	fs.readfile(__dirname + '/index.html', function (error, data) {
		res.writeHead(200, {'Content-Type' : 'test/html'});
		res.end(data, function(error){
			console.log(error)
		})
	});
});

// 서버 시작.
server.listen(process.env.PORT ||80);


// 파일 업로드 & 다운로드
var socketAdmin = require('./serverModule/socketAdmin.js');

// 소켓 통신 정의
io.sockets.on('connection', function(socket){
	
	// 초기 설정.	
	socket.on('init', function (data) {
		
    });	
	
	// 룸 가입	
	socket.on('roomInit', function(data){
		
	});
	
	/*
		회원가입 페이지	 
		signUp email에서 저장버튼을 누른 후, 데이터를 받음.
	 */
	socket.on('signUp_email', function(data){
		socketAdmin.signUpEmail(data, socket)
	});
	
	/*
		로그인 페이지.
		signIn email에서 Sign in 버튼을 누른 후, 데이터를 받음. 
	*/
	socket.on('signIn_email', function(data){
		socketAdmin.loginCheck(data, socket)
	});
		
	// 누군가가 메시지를 보냈을 때 사용.(룸 전용)
	socket.on('sendMsg', function(data){
		socketAdmin.sendMsgRoom(data, socket)
	});
			
	// 접속이 종료되면 trigger
  	socket.on('disconnect', function () {
  		io.sockets.emit('user disconnected');
  		/*
	  	그냥 대충 roomid 만들었던 때에 사용했음.	
  		socket.leave(roomId);
		io.sockets.emit('user disconnected');
		
		var ind = clients[0]['_'+socket.id] + 1;
		clients.splice( ind ,1);
		*/
 	});
 	
 	
 	
});





























