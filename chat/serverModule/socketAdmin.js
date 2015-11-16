'use strict';
/*
	
	signUpEmailModel = null, // 회원가입시 저장하는 model
	talkMegModel = null, // 채팅방에서 서로 대화한 것을 저장하는 model
	userInfoModel = null // 개인 정보 model
	
	회원가입 페이지	 
	signUp email에서 저장버튼을 누른 후, 데이터를 받음.
 */
exports.signUpEmail = function(data, socket){
	// data는 username, email, password
	console.log('회원가입 버튼을 클릭했당!!');		
	
	signUpEmailModel.find({email : data.email}, function(err, isAlreadySignUp){
		switch(isAlreadySignUp.length){
			case 0 : 				
				console.log('없으므로 저장합니다.');
				// 여기에 지금 맞게 들어갔는지 체크는 하나도 없음. validation은 추후에 추가.
				// 회원가입-email & 개인정보 저장
				var signUpEmailSchema = new signUpEmailModel({
					username : data.username,
					email : data.email,
					password : data.password
				});
				var userInfoSchema = new userInfoModel({
					_myId : data.username,
					username : data.username,	
					email : data.email,	
					profileMsg : null,
					profileBg : 'default_bg.jpg',
					profilePic : 'default.jpg',
					friendsList : []
				});				
				
				signUpEmailSchema.save();
				userInfoSchema.save();
				
				return socket.emit('signUp_email_succ');
			case 1 :
				console.log('이미 존재하네요. 저장 안 함ㅋ')
				return socket.emit('signUp_email_fail');
		};
	});
};


/*
	로그인 페이지.
	signIn email에서 Sign in 버튼을 누른 후, 데이터를 받음. 
*/
exports.loginCheck = function(data, socket){
	// data는 username, email, password
	console.log('로그인 버튼을 클릭했당!!');
	
	// 여기에 지금 맞게 들어갔는지 체크는 하나도 없음. validation은 추후에 추가.
	// 이메일과 pw가 맞으면 로그인 시킴.
	// 로그인 후에 친구목록 화면과 대화 목록 화면을 뿌려줌.
	signUpEmailModel.find({email : data.email, password : data.password}, function(err, isValue){
		switch(isValue.length){
			case 0 : 				
				// 실패했을 때 넘김.
				console.log('실패')
				return socket.emit('signIn_email_fail');
			case 1 :
				// 성공했을 때 넘김.
				console.log('성공');				
				// 개인의 룸 초기화.
				return exports.roomInit(data, socket)				
		};			
	});
};

exports.roomInit = function(data, socket){
	/*
	signUpEmailModel = null, // 회원가입시 저장하는 model
	talkMegModel = null, // 채팅방에서 서로 대화한 것을 저장하는 model
	userInfoModel = null // 개인 정보 model
	var userInfoSchema = new userInfoModel({
		_myId : data.username,
		username : data.username,	
		email : data.email,	
		profileMsg : null,
		profilePic : 'person.jpg',
		friendsList : []
	});	
	var signUpEmailSchema = new Schema({
		username : String,
		email : String,
		password : String,
		friends : Object,
		talkList : Object		
	});
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
		lastIndex : Object // 객체의 프로퍼티로 id, 값에 마지막에 본 숫자.
	});
	*/
	
	// 데이터를 저장할 객체.
	var nowDate = new Date();
	var allData = {
		data : null, // 로그인한 사람의 username
		friendData : null, // 친구 목록
		talkMegData : [], // 대화 목록
		date : 
			{
				year : nowDate.getFullYear(), // getYear는 비표준 폐기됨.
				month : nowDate.getMonth(), // day처럼 0부터 시작하는 듯.
				date : nowDate.getDate(), 
				day : nowDate.getDay(), // 일요일부터 시작 0~6까지의 값.
				hours : nowDate.getHours(),
				minutes : nowDate.getMinutes(),
				seconds : nowDate.getSeconds()
			}
	};
	// 개인정보에 해당하는 모델을 읽음. 친구목록 뿌리기.
	userInfoModel.findOne({email : data.email}, function(err, users){
		if (err){ return console.error(err);}
		var data = {};
		
		// 개인 유저의 친구들의 정보 & 나의 정보를 data 객체에 저장.
		data._myId = users._myId;
		data.username = users.username;
		data.profilePic = users.myProfilePic;
		data.profileMsg = users.myProfileMsg;
		
		allData.data = data;
		allData.friendData = users.friendsList;
		
		// 만든 데이터 저장.
		return findTalkModelFunc();
	});
	
	// 대화방에 해당하는 모델을 읽음.
	function findTalkModelFunc(){
		var talkMegSearchQuery = allData.data.username,
			roomData = [];
			
		talkMegModel.find({users : talkMegSearchQuery}, function(err, findTalkRoom){
			if (err){return console.error(err);}
			socket.rooms = [];
			
			for(var i = 0, list = findTalkRoom, len = list.length ; i < len ; i +=1){
				roomData[i] = {};
				roomData[i].roomname = list[i].roomname;
				roomData[i].users = list[i].users
				roomData[i].Content = list[i].Content;
				allData.talkMegData[i] = roomData[i];
				//socket.join(list[i].roomname)
				//console.log("ididiid", socket.id)
				socket.join(list[i].roomname);
				socket.rooms.push(list[i].roomname);
			};
			return socket.emit('signInEnd', allData);
		});
	};
};

// 룸 가입하기.
exports.joinRoom = function(){
	
};


exports.roomCreate = function(){
	
	var talkMegSchema = new talkMegModel({
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
		lastIndex : Object // 객체의 프로퍼티로 id, 값에 마지막에 본 숫자.
	});
	talkMegSchema.save();
};

// 대화 목록을 클릭했을 때 대화 내용 검색.
// 대화 목록의 Content 프로퍼티 안에는 idx라는 것을 사용하는데, idx 0인 값은 항상 방에서 먼저 대화한 사람을 기준으로 작성.
exports.searchContent = function(data, socket){
	console.log("서버에서 Content 검색 요청을 받았당");
	
	var totalInd = 0,
		inter = {
			timeout : null,
			interVal : null,
			allValue : 0,
			isForEnd : false
		},
		allData = {
			clickInd : data.clickInd,
			content : null,
			friendsData : []
		};
	var roomName = data.roomname;
	inter.timeout = function(){
		if(inter.allValue === totalInd -1 && inter.isForEnd){
			// 조회가 끝났으니 데이터를 client로 보냄.
			socket.emit('talkRoomContentSearchData', allData);
		};
	};
	
	talkMegModel.find({roomname : roomName}, function(err, findTalkCentent){
		if (err){return console.error(err);}
		var users = findTalkCentent[0].users;
		totalInd = users.length;
		
		for(var i = 0, len = totalInd ; i < len ; i +=1){
			console.log(i, data.username, users[i] === data.username)	
			if(users[i] === data.username) {
				allData.friendsData[i] = undefined;				
				continue;
			};	
			console.log(users, i, data.username)
			searchUserInfo(users[i], i);
		};
		allData.content = findTalkCentent;
		inter.isForEnd = true;
		inter.timeout();
	});
	
	function searchUserInfo(ctmData, ind){
		userInfoModel.findOne({username : ctmData}, function(err, users){
			if (err){return console.error(err);}
			var data = {};
			
			// 개인 유저의 친구들의 정보 & 나의 정보를 data 객체에 저장.
			data._myId = users._myId;
			data.username = users.username;
			data.profilePic = users.myProfilePic;
			
			allData.friendsData[ind] = data;
			inter.allValue +=1;
			// 만든 데이터 저장.
			inter.timeout();
		});
	}
	
};

// 누군가가 메시지를 보냈을 때 사용.
exports.sendMsgRoom = function(data, socket){
	/*
	 	{
	 		userInfo : {
	 			_myId: "숫자놀이"
				id: "1447481855106start"
				name: "myRoom2"
				nowRoom: "숫자놀이_0"
				profileMsg: "핑크는 핑크핑크해!!"
				profilePic: "person1.jpg"
				username: "숫자놀이"
	 		},
	 		textValue : '123'
	 	}	 	 	
	 */
	console.log("서버에서 메시지 받았당 roomId는 ", data)
	var date = new Date();
	talkMegModel.find({roomname : data.userInfo.nowRoom}, function(err, findTalkCentent){
		var userInd,
			content = findTalkCentent[0].Content;
		for(var i = 0, list = findTalkCentent[0]["users"], len = list.length ; i < len ; i +=1){		
			if(list[i] === data.userInfo.username){
				userInd = i;
				break;
			};
		};
		var talkMeg = {
			_id : 0,
			idx : userInd, // 누가 보냈냐.
			date : {
				year : date.getFullYear(), // getYear는 비표준 폐기됨.
				month : date.getMonth(), // day처럼 0부터 시작하는 듯.
				date : date.getDate(), 
				day : date.getDay(), // 일요일부터 시작 0~6까지의 값.
				hours : date.getHours(),
				minutes : date.getMinutes(),
				seconds : date.getSeconds()
			},
			talkCnt : data.textValue
		};
		
		talkMegModel.findOneAndUpdate(
			{roomname : data.userInfo.nowRoom}, 
			{$push: {Content: talkMeg}},
			{upsert:true}, function(err, doc){
				if(err) { return console.error('Failed to update'); }
				console.log('Update Success');
				var content = doc.Content,
					idx = content.length-2 < 0 ? '' : content[content.length-2].idx;
				var isDouble =  idx === userInd
				console.log('idx', idx, userInd)
				// data를 만들어서 클라이언트에게 보냄
				var _data = {
					userInfo : data.userInfo,
					textValue : data.textValue,
					date : talkMeg.date,
					isDouble : isDouble,
					idx : idx
				};
				
				socket.broadcast.to(data.userInfo.nowRoom).emit('sendMsgOtherPeople', _data);
				
			}
		);		
	});
	
};










































