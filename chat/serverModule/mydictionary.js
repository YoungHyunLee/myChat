(function(){
'use strict';

/*
해야할 일.

친구추가시 바로 추가한 친구를 클릭하면 팝업이 안 뜸.


*/


/*
 * 
 * 아래는 JS의 기본 관련 스크립트.
 * 
 */

/*
documentFragment 사용법
a = u.createDocumentFragment();
d = u.createElement("div");
d.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";
a.appendChild(d.firstChild);
*/

/*
 * 
 * 아래는 node의 기본 관련 스크립트.
 * 
 */
/*
어떤 파일을 만들어서(js) 그 파일 안에서 새로운 메서드를 정의할 때.
exports.test = function(){
	console.log('test를 실행했다!')
};

위처럼 한 후에 사용하고 싶을 때는 아래처럼 사용할 수 있다.
var testJs = require('./serverModule/exam.js');
testJs.test();

*/

/* 
전역변수를 사용하고 싶으면 아래처럼 사용할 수 있다. 
global.test = 'testval';  
 */

/*
node에서 콘솔창에 보여주는 websocket writing의 숫자의미.
var packets = exports.packets = {
      'disconnect': 0
    , 'connect': 1
    , 'heartbeat': 2
    , 'message': 3
    , 'json': 4
    , 'event': 5
    , 'ack': 6
    , 'error': 7
    , 'noop': 8
  }
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

/*
// id값으로 room을 가입시킴	
socket.on('init', function (data) {
    var clientInfo = {};
    clients[0]['_'+socket.id]  = ind;
    ind+=1;
    clientInfo.customId = data.id;
    clientInfo['_'+socket.id] = socket.id;
    clients.push(clientInfo);
    //console.log('바인딩 완료!', socket.id)
});

socket.on('init', function(data){
	roomId = data.name;
	socket.join(roomId);
	//console.log('현재 가입된 소켓 목록 리턴', io.sockets.manager.rooms, data.name)
	socket.emit('joinRoomEnd', '가입했당');
});
*/

/*
어떤 룸에서 룸에 있는 client 전체에게 메시지를 보낼 때
어떤 룸을 원하는 지는 roomId로 지정할 수 있음.
socket.on('sendMsg', function (data) {	
	io.sockets.in(roomId).emit('sendMsgOtherPeople', data); // 나를 포함한 룸 전체에게 보낼 때	
	socket.broadcast.to(roomId).emit('sendMsgOtherPeople', data); // 나를 제외한 룸 전체에게 보낼 때	
});	
*/
	
	
	
	

/*
 *
 * 아래는 express 관련.
 *  
 */

/*
// get 요청이 일어났을 때 호출됨.(보통은 주소에서 엔터쳤을 때)
// post는 .post 메서드를 사용.
app.get('/user', function(req, res){
	// everything~~~
})
*/


/*
 * 
 * 아래는 fs 관련 스크립트.
 * 
 */

/*
해당 파일의 내용을 수정할 때 사용.
var filename = "myFile-01.txt";
fs.writeFile(filename, 'This is text file. Hello, Node.js', 'utf8', function(err) {
	if (err) {
        throw err;
    }
    console.log(filename + ' writeFile OK');
}); 
*/

/*
해당 파일의 내용을 불러올 때 사용.
여기서 exists는 해당 파일이 존재여부를 확인하는 메서드, readFile은 지정한 파일의 내용을 불러옴.
var filename = "myFile-01.txt";
fs.exists(filename, function(isExists) {
	if (isExists) {
		fs.readFile(filename, 'utf8', function(err, data) {
			if (err) {
				throw err;
			}
			console.log(filename + ' readFile OK');
			console.log(data);
		});            
	};
});
*/



	
/*
 * 
 * 아래는 mongoDB 관련 스크립트.
 * 
 */

/* 

// 전체적인 것들

// ?
module.exports = mongoose.model('User', userSchema);

// mongoose 연결해제
mongoose.disconnect(); 


*/


/*
// 이것은 신규 유저가 회원가입시 사용할 것.
var UserInfo1 = new UserInfo({
	username : '숫자놀이',		
	myProfileMsg : '나는 하루 종일 서있는다. 그래서 김종서다.',
	myProfilePic : 'person1.jpg'
});
UserInfo1.save();

var TalkMeg1 = new TalkMeg({
	roomname : '숫자놀이_1',
	users : [
		'숫자놀이', '박신혜'
	],
	Content : [
		{
			_id : 0,
			idx : '0',
			date : {
				year : Number,
				month : String,
				day : String,
				week : String,
				hours : Number,
				minutes : Number,
				seconds : Number
			},
			talkCnt : '테스트 메시지 처음'
		}
	],
	lastIndex : 0		
});
TalkMeg1.save();
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
}); 
*/

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

// 배열에 push할 때 사용.
userInfoModel.findOneAndUpdate(
	{username : myUsername},
	{$push: {friendsList : savingData}},
	{upsert:true}, function(err, doc){
		if (err){return console.error(err);}
		// 저장한 데이터를 전송
		savingData.socketId = '';
		socket.emit('saveSearchFriendResult', savingData);
	}
);

// 배열에 pull할 때 사용.
userInfoModel.findOneAndUpdate({username : '숫자놀이'}, {'$pull' : {friendsList : '박신혜'}}, function(err, doc){
	console.log(doc)
})
	
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

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
})();