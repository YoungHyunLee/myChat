var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  ,mongo = require("mongoskin")
  ,path = require('path')
  var port = process.env.PORT ||80;
//var mongoUrl = process.env.MONGOHQ_URL || "127.0.0.1:27017/data";

// mongoDB native 버젼.
var mongoose = require('mongoose');
mongoose.connect('mongodb://test:testpw@ds049744.mongolab.com:49744/numbernoridb1'); // 포트번호(27017) 생략가능
// var connection1 = mongoose.createConnection('mongodb://localhost/mydatabase'); 여러 개의 db에 연결할 때 사용.

// mongodb 설정 부분.
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
	
var db = mongoose.connection,
	signUpEmailModel = null;
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
	signUpEmailModel = SignUpEmail;
	// 이것은 신규 유저가 회원가입시 사용할 것.
	var signUpEmail = new SignUpEmail({
		username : '테스트이름',
		email : 'test@email.com',
		password : 'testPassword',
		friends : {},
		talkList : {}	
	});
	signUpEmail.save();
	
})



// express 설정
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {	
	res.sendfile(__dirname + '/index.html', function (error, data) {});
});

server.listen(process.env.PORT ||80);
/*
 * 아래는 express 관련 스크립트.
 */







/*
SignTest2.findOne({name : "이것은 테스트명"}, function(err, data){
	console.log(data)
	data.count++;
	data.save(function(err){
		//res.render('my_first_ejs', data);
	});
})
*/




/*
 * 아래는 socket.io 관련 스크립트.
 * 
 * socket.join('exam); // exam이라는 룸에 입장.
 * socket.leave('exam); // exam이라는 룸에서 퇴장.
 * 
 * io.sockets.in(‘exam’).emit(‘event’,message)  // exam 룸 안에 있는 모든 client에게 이벤트 보내기 
 * socket.broadcast.to(‘exam’).emit(‘event’,message) // 룸 exam안에 있는 나를 제외한 다른 client에게 이벤트 보내기
 * 
 * io.sockets.manager.rooms // 현재 생성되어 있는 모든 room의 목록을 리턴.
 * io.sockets.clients(‘exam’) // 룸 exam안에 있는 모든 client 소켓 목록을 리턴
 */
// 초기 client들 편성.
var clients =[
		{} // customId값 담기.
	],
	ind = 0; // 원래 이런 건 DB에서 id값 받아서 저장해야 함. 지금은 임시로 숫자로 넣음.
var roomId;

io.sockets.on('connection', function(socket){
	// 초기 설정.	
	socket.on('init', function (data) {
        var clientInfo = {};
        clients[0]['_'+socket.id]  = ind;
        ind+=1;
        clientInfo.customId = data.id;
        clientInfo['_'+socket.id] = socket.id;
        clients.push(clientInfo);
        //console.log('바인딩 완료!', socket.id)
    });	
	
	// 룸 가입	
	socket.on('init', function(data){
		roomId = data.name;
		socket.join(roomId);
		//console.log('현재 가입된 소켓 목록 리턴', io.sockets.manager.rooms, data.name)
		socket.emit('joinRoomEnd', '가입했당');
	});
	
	// 룸 메시지 보내기.
	
	/*
		회원가입 페이지	 
		signUp email에서 저장버튼을 누른 후, 데이터를 받음.
	 */
	socket.on('signUp_email', function(data){
		// data는 username, email, password
		console.log('회원가입 버튼을 클릭했당!! data는 ', data);
		
		// 여기에 지금 맞게 들어갔는지 체크는 하나도 없음. validation은 추후에 추가.
		var signUpEmailSchema = new signUpEmailModel({
			username : data.username,
			email : data.email,
			password : data.password
		});
		signUpEmailSchema.save();
				
		// 성공했을 때 넘김.
		socket.emit('signUp_email_succ');		
	});
	
	/*
		로그인 페이지.
		signIn email에서 Sign in 버튼을 누른 후, 데이터를 받음. 
	*/
	socket.on('signIn_email', function(data){
		// data는 username, email, password
		console.log('로그인 버튼을 클릭했당!! data는 ', data);
		
		// 여기에 지금 맞게 들어갔는지 체크는 하나도 없음. validation은 추후에 추가.
		signUpEmailModel.find({email : data.email, password : data.password}, function(err, isValue){
		
			switch(isValue.length){
				case 0 : 				
					// 실패했을 때 넘김.
					console.log('실패')
					return socket.emit('signIn_email_fail');
				case 1 :
					// 성공했을 때 넘김.
					console.log('성공')
					return socket.emit('signIn_email_succ');
			}
			
		});
					
	});
	
	
	// 누군가가 메시지를 보냈을 때 사용.
	socket.on('sendMsg', function (data) {
		
		console.log('서버에서 메시지 받았당')
		//io.sockets.in(roomId).emit('sendMsgOtherPeople', data);
		socket.broadcast.to(roomId).emit('sendMsgOtherPeople', data);
		//io.sockets.in(roomId).emit('sendMsgOtherPeople', roomId);
	});
		
	
	// 접속이 종료되면 trigger
  	socket.on('disconnect', function () {
  		socket.leave(roomId);
		io.sockets.emit('user disconnected');
		
		var ind = clients[0]['_'+socket.id] + 1;
		clients.splice( ind ,1);
 	});
 	
 	
});


// 버튼 클릭 시 넘어오는 부분
// 서버는 바로 msg를 넘김.





/*
 * 아래는 express 관련.
 */

/*
// get 요청이 일어났을 때 호출됨.(보통은 주소에서 엔터쳤을 때)
// post는 .post 메서드를 사용.
app.get('/user', function(req, res){
	// everything~~~
})
*/




/*
 * 아래는 mongoDB 관련 스크립트.
 */

/* 

// 전체적인 것들

// ?
module.exports = mongoose.model('User', userSchema);

// mongoose 연결해제
mongoose.disconnect(); 


*/

/*
// db에 무엇을 담을 것인지에 대한 논리적인 내용을 담은 객체. 그냥 뭐 담을 건지 말하는 객체.
// db 테이블의 header를 만드는 과정
var userSchema= new Schema({
	_id: String,
	name: String,
	phone: String,
	age: Number }, { versionKey:false} //__v 버전키 필드제거
);
*/


/*
// 생성자함수 이므로 대문자 권장
// 여기서 User는 어떤 db(위에서 지정한 data db)의 메서드까지 담은 전체 객체.
// 'User 단수형의 이름은 내부적으로 복수형으로 사용됨
var User = mongoose.model('Users', userSchema);
// 만약 mongolab같은 것을 사용할 때 model명을 단수로(s가 없는) 사용할 경우 자동으로 s가 붙은 모델이 생성되며 거기로 저장된다.
var myUser = mongoose.model('myUser', userSchema); // 이러면 myUsers에 저장이 됨.
*/

/*
// Users 컬렉션에 저장할 모델 인스턴스 생성.
// 모델을 생성할 때 new도 되지만. .create를 사용해도 된다.
var myModel = new User({ name: 'fluffy' });
var myModel2 = User.create({ name: 'fluffy' }, function(err){ })
*/

/*
모델 인스턴스의 속성을 Users 컬렉션에 저장
myModel.save(function(err, newUser){
	if (err) { return console.error(err); }
	  console.log(newUser);
});
*/

/* 
저장하는 다른 방법.
이 방법은 직접적으로 저장하는 방법임.
myModel.create({name : 'otherSaveMethod'}, function(err){
	if(err) throw err;
}); 
*/


/*
// Users 컬렉션에서 가져오기
User.find ( function (err, users) {
	if (err){ return console.error(err);}
	//console.log('a', users);
});
*/

/*
// Find a single User by name.
User.findOne({ name: 'ward' }, function(err, scott) {
  if (err) { return console.error(err); }
  console.log(scott);
}); */

/*
// Update 1
// 첫번째 인자(찾을값 _id), 두번째 인자(바꿀 값, name), 세번째 인자(옵션, upsert), 네번째 인자(콜백함수)
User.update( {_id:'usr01'}, {$set:{name:'king'}}, {upsert:true}, function(err, doc){
	if(err) { return console.error('Failed to update'); }
	console.log('Update Success');
});
*/

/*
// findOneAndUpdate
User.findOneAndUpdate ( {_id:'usr03'}, {$set:{name:'king', age:50} }, {upsert:true}, function(err, doc){
	if(err) { return console.error('Failed to update'); }
	console.log('Update Success');
}); 
*/

/*
// 삭제만 하는 메서드. 첫번째 인자(찾을 값), 두번째 인자(옵션 생략), 세번째 인자(콜백함수)
User.remove({_id: '55617a808ad65e80188e541a'}, function(err) {    
 if(err) throw err;
 console.log("remove");
});

// findById : 내부 ID를 검색한다. 검색한 데이터는 searchData에 들어가게된다.
User.findById('55617a808ad65e80188e541b', function(err, searchData) {
	if(err) throw err;
	searchData.remove(); // 검색된 데이터를 삭제
});

// 찾아서 삭제한다.
User.findByIdAndRemove('usr03', function(err){
	if(err) { return console.error(err); }
	console.log('Remove Success');
});

*/























