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
				var signUpSchema = new signUpEmailModel({
					_id : data.username,
					username : data.username,
					email : data.email,
					password : data.password					
				});				
				var userInfoSchema = new userInfoModel({
					_id : data.username,
					username : data.username,
					email : data.email,
					_myId : data.username,
					profileMsg : null,
					profileBg : 'default_bg.jpg',
					profilePic : 'default.jpg',
					socketId : socket.id,
					lastRoomIndex : '',
					friendsList : [],
					signUp : data.username,
					talkMsg : data.username
				});				
								
				signUpSchema.save();
				userInfoSchema.save();
				
				var clientData = {
					email : data.email,
					password : data.password // yhlee 추후 이 부분은 제거해야 하는데.. 지금은 귀차니즘.		
				};	
	
				return socket.emit('signUp_email_succ', clientData);
			case 1 :
				console.log('이미 존재하네요. 저장 안 함ㅋ');				
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
	console.log('로그인 버튼을 클릭했당!!', data.email, socket.id);
	
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
				// socket.id 변경.
				userInfoModel.update( {email:data.email}, {$set:{socketId:socket.id}}, {upsert:true}, function(err, doc){
					if(err) { return console.error('Failed to update'); }
					console.log('로그인을 했기 때문에 socket을 변경합니다!', doc)
				});	
				// 개인의 룸 초기화.
				return exports.roomInit(data, socket)
		};			
	});
};
// 개인 룸 초기화.
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
	userInfoModel.findOne({email : data.email}).populate('friendsList talkMsgs').exec(function(err, users){
		if (err){ return console.error(err);}
		console.log('정보를 검색합니다.', users)
		
		var data = {},
			talkMsg = users.talkMsgs,
			friendsData;
		// 개인 유저의 친구들의 정보 & 나의 정보를 data 객체에 저장.
		data._myId = users._myId;
		data.username = users.username;
		data.profilePic = users.profilePic;
		data.profileBg = users.profileBg;
		data.profileMsg = users.profileMsg;
		
		friendsData = users.friendsList;
		
		allData.data = data;
		allData.friendData = users.friendsList;
		// 보안상 제거해야 하는 건지.. 아직은 의문.
		//allData.friendData.socketId = "";
		
		// 만든 데이터 저장.
		if(talkMsg === undefined){return socket.emit('signInEnd', allData);}
		
		socket.rooms = [];
		for(var i = 0, list = talkMsg, len = list.length, roomData = {} ; i < len ; i +=1){
			roomData = {};
			roomData.roomname = list[i].roomname;
			roomData.users = list[i].users;
			roomData.Content = list[i].Content;
			allData.talkMegData[i] = roomData;
			//socket.join(list[i].roomname)
			//console.log("ididiid", socket.id)
			socket.join(list[i].roomname);
			socket.rooms.push(list[i].roomname);
		};
		return socket.emit('signInEnd', allData);
	});
	
};

// 룸 가입하기.
exports.joinRoom = function(socket, roomname){
	socket.join(roomname);
	socket.rooms.push(roomname);
};

exports.newRoomCreate = function(data, socket){
	var nowDate = new Date();
	console.log('newRoomCreate를 실행.', data);
	
	var allUsers = data.createInfo;
	allUsers.unshift(data.userInfo.username);
				
	/*
	var data = {
		userInfo : _cg.userInfo,
				userInfo : {
					username : null,
					profilePic : null,
					_myId : null,
					profileMsg : null,
					nowRoom :null
				},
		
		textValue : sendText,
		createInfo : ["박신혜"],
		isMe : null
	};
	*/
	var allData = {
		roomname : data.userInfo.username,
		users : allUsers,
		Content : [
			{
				idx : 0,
				date : {
					year : nowDate.getFullYear(),
					month : nowDate.getMonth(),
					date : nowDate.getDate(), 
					day : nowDate.getDay(),
					hours : nowDate.getHours(),
					minutes : nowDate.getMinutes(),
					seconds : nowDate.getSeconds()
				},
				talkCnt : data.textValue
			}
		],
		lastIndex : {}
	};
	var _data = {
		userInfo : data.userInfo,
		textValue : data.textValue,
		date : allData.Content[0].date,
		allUsers : allUsers,
		isDouble : false,
		isNewRoom : true
	};
	// lastIndex 추가용.
	for(var i = 0, list = allData.users, len = list.length ; i < len ; i += 1){
		allData.lastIndex[list[i]] = 0;
	};
	// 개인정보에 해당하는 모델을 읽음. 친구목록 뿌리기.
	userInfoModel.findOne({username : data.userInfo.username}).populate('friendsList').exec(function(err, searchUser){		
		if (err){ return console.error(err);}
		//console.log('개인정보 검색 후', searchUser, data)
		
		var roomIndex = 0, newRoomName;
		if(searchUser.lastRoomIndex >=0){
			roomIndex = searchUser.lastRoomIndex + 1
		};
		_data.userInfo.nowRoom = newRoomName = allData.roomname + '_' + roomIndex;		
		// db에 room을 생성하고, 나를 join 시킴.
		exports.roomCreate(socket, newRoomName, allData.users, allData.Content[0], allData.lastIndex);
		userInfoModel.update(
			{username : {$in : allUsers}},
			{$push: {talkMsgs : newRoomName}},
			{multi : true},
			function(err, doc){
				if (err){return console.error(err);}
				// 저장한 데이터를 전송
				//console.log('자 친구들을 찾아봅시다.', doc, allUsers, newRoomName)
			}
		);
				
    	for(var i = 0, list = searchUser.friendsList, len = list.length ; i < len ; i += 1){    		
    		for(var j = 0, jList = data.createInfo, jLen = jList.length ; j < jLen ; j += 1){
    			// 내가 대화방을 만들려는 사람과 일치할 때(내 친구목록 중에서 가입을 시켜야하는 사람만 해야하므로)
	    		if(list[i].username === jList[j]){
	    			//console.log("room 가입했다!!!", newRoomName, list[i].socketId, socket.rooms);
	    			// socket.id에 해당하는 그 사람에게 room을 가입시킴.
	    			io.sockets.connected[list[i].socketId].join(newRoomName)
	    			//console.log("room 가입했다!!!", newRoomName, list[i].socketId, socket.rooms, socket.manager.rooms);
	    			
	    			userInfoModel.findOneAndUpdate(
	    				{username : data.userInfo.username},
    					{
    						'$set':{lastRoomIndex : roomIndex}
    					}, {upsert:true, overwrite: true},
	    				function(err, doc){
							if(err) { return console.error('Failed to update lastRoomIndex'); }
	    					socket.broadcast.to(newRoomName).emit('sendMsgOtherPeople', _data);
						}
					);
					
	    		};
    		};    			
    	};
				
	});
};

exports.roomCreate = function(socket, roomname, users, content, lastIndex){	
	var talkMegSchema = new talkMegModel({
		_id : roomname,
		roomname : roomname,
		users : users,
		Content : [
			{
				idx : content.idx,
				date : {
					year : content.date.year,
					month : content.date.month,
					date : content.date.date,
					day : content.date.day,
					hours : content.date.hours,
					minutes : content.date.minutes,
					seconds : content.date.seconds
				},
				talkCnt : content.talkCnt + ''
			}
		],
		lastIndex : lastIndex // 객체의 프로퍼티로 id, 값에 마지막에 본 숫자.
	});
	talkMegSchema.save();
	socket.rooms.push(roomname);
			
	return socket.join(roomname);
};

exports.searchFriend = function(data, socket){
	console.log("서버에서 friend 검색 요청을 받았당.", data);
	var searchValue = data + '';
	
	userInfoModel.findOne({username : searchValue}).exec(function(err, users){
		if (err){return console.error(err);}
		if(users === undefined || users === null){
			return socket.emit('friendSearchResult', null);
		};
		var data = {};
		// 개인 유저의 친구들의 정보 & 나의 정보를 data 객체에 저장.
		data._myId = users._myId;
		data.username = users.username;
		data.email = users.email;
		data.profileMsg = users.profileMsg;
		data.profileBg = users.profileBg;
		data.profilePic = users.profilePic;	
				
		// 검색한 데이터를 전송
		socket.emit('friendSearchResult', data);
	});	
};

exports.saveSearchFriend = function(data, socket){
	console.log("서버에서 friend 저장 요청을 받았당.", data);
	var myUsername = data.myData.username + '',
		username = data.data.username + '';
	
	/*
	서버에서 friend 저장 요청을 받았당. 
	{ 
		data:
	   		{ 
		   		_myId: '박신혜',
			     username: '박신혜',
			     email: 'shp@gmail.com',
			     profileMsg: null,
			     profileBg: 'default_bg.jpg',
			     profilePic: 'default.jpg' 
		     },
	  myData:
		   { 
			   	username: '숫자놀이',
			     profilePic: 'default.jpg',
			     _myId: '숫자놀이',
			     profileMsg: null,
			     nowRoom: null 
		     } 
		}
	  */ 
	userInfoModel.findOne({username : myUsername}).populate('friendsList').exec(function(err, users){
		console.log(users)
		var _data = {},
			userEmail = data.data.email;
		
		// 이미 존재하면 바로 리턴.
		console.log("users.friendsList", users.friendsList)
		if(users.friendsList.length === 0){
			console.log('친구 목록이 있네요!! 실행!')
			for(var i = 0, list = users.friendsList, len = list.length ; i < len ; i += 1){
				if(list[i] && list[i].email === userEmail){				
					return socket.emit('saveSearchFriendResult', false);
				};
			};
		};
				
		// 나의 friendsList에 상대방을 추가함.
		userInfoModel.findOneAndUpdate({username : myUsername}, {'$push' : {friendsList : username}}, function(err, doc){
			console.log('push를 했습니다!', doc);
		});
		
		// 저장하려는 상대의 정보를 조회 후에 client로 넘김.
		userInfoModel.findOne({username : username}, function(err, doc){
			console.log("등록을 원하는 사람을 검색해봅니다.", username, doc)
			_data._myId = doc._myId;
			_data.email = doc.email;
			_data.profileMsg = doc.profileMsg;
			_data.profileBg = doc.profileBg;
			_data.profilePic = doc.profilePic;
			_data.username = doc.username;
			
			return socket.emit('saveSearchFriendResult', _data);
		});
	}) 
	
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
			data.profilePic = users.profilePic;
			
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
		console.log('자 이제 보낸 msg 업데이트 합니다.', findTalkCentent, data.userInfo.nowRoom, talkMeg)
		talkMegModel.findOneAndUpdate(
			{roomname : data.userInfo.nowRoom}, 
			{$push: {Content: talkMeg}},
			{upsert:true}, function(err, doc){
				if(err) { return console.error('Failed to update'); }
				console.log('Update Success');
				var content = doc.Content,
					idx = content.length-2 < 0 ? '' : content[content.length-2].idx;
				var isDouble =  idx === userInd;
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



































