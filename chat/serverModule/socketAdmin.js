'use strict';
/*
	회원가입 페이지	 
	signUp email에서 저장버튼을 누른 후, 데이터를 받음.
 */
exports.signUpEmail = function(data, socket){
	// data는 username, email, password
	console.log('회원가입 버튼을 클릭했당!! data는 ', data);		
	// 여기에 지금 맞게 들어갔는지 체크는 하나도 없음. validation은 추후에 추가.
	var signUpEmailSchema = new signUpEmailModel({
		username : data.username,
		email : data.email,
		password : data.password
	});
	signUpEmailModel.find({email : data.email}, function(err, isAlreadySignUp){
		switch(isAlreadySignUp.length){
			case 0 : 				
				console.log('없으므로 저장합니다.');
				signUpEmailSchema.save();
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
	console.log('로그인 버튼을 클릭했당!! data는 ', data);
	
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
				console.log('성공')
				
				// 대화방에 해당하는 모델을 읽음.
				talkMegModel.find({username : data.username}, function(err, users){
					if (err){ return console.error(err);}
					console.log(users)
				});
								
				//socket.join(roomId);
				//console.log('현재 가입된 소켓 목록 리턴', io.sockets.manager.rooms, data.name)
				socket.emit('joinRoomEnd', '가입했당');
									
				return socket.emit('signIn_email_succ');
		};			
	});					
};


// 누군가가 메시지를 보냈을 때 사용.
exports.sendMsgRoom = function(data, socket){
	console.log('서버에서 메시지 받았당')
	socket.broadcast.to(roomId).emit('sendMsgOtherPeople', data);
};

