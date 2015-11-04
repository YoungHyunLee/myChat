(function(){	
'use strict';
/*
	공통 기능 정의 & 화면 스크립트
 */
var g = (function(){
	var all = {};
	// lQuery 정의
	var lQuery, L = null;
	
	all.global = {
		// 공통 기능 정의
		init : function(){
			all.lQuery = all.L = lQuery = L = all.global.lQuery;			 
		},
		lQuery : function(obj){
			if(!obj) obj = {};
			return all.global.inheritMethod(obj)
		},
		inheritMethod : function(obj){
			for(var i in all.global.common){				
				obj[i] = all.global.common[i];
			};
			return obj;
		},
		common : {			
			on : function(a,b,c){
				var _ieEvent = "on"+a;
				c ? c : false;	
				if(document.addEventListener){
					this.addEventListener(a,b,c);
				} else if (document.attachEvent) {
					this.attachEvent(_ieEvent,b)
				};
				return false;
			},
			addClass : function(a){
				var _a = arguments.length === 0 || typeof a === String ? a : String(a);
				var _tar = this,
					_classSpace = " "+_a;
				if(!_tar.className){
					_tar.className = _a;
					return this
				};
				var _className = _tar.className,
					_classText,_classSplit,_classLastAdd = false
				if(a && !!_tar.className){
					_classSplit = _className.split(" ");
					if(_classSplit.length === 1 && _classSplit[0] === _a){
						return this
					};			
					_tar.className = ""
					for(var i=0,_ind = _classSplit.length;i<_ind;i+=1){
						if(_classSplit[i] === _a){
							continue;
						}
						if(i===0){
							_tar.className = _classSplit[i]
						} else {
							_tar.className += (" " + _classSplit[i])
						};			
					};
					_tar.className += _classSpace;
				};
				
				return this
			},
			removeClass : function(a){	
				var a = arguments.length === 0 || typeof a === String ? a : String(a);
				var _tar = this;
				var _className = _tar.className,
					_classText,_classSplit;
				if(a && _tar.className){
					_classSplit = _className.split(" ");		
					_tar.className = ""
					
					for(var i=0,_ind = _classSplit.length;i<_ind;i+=1){
						if(_classSplit[i] === a)continue;
						if(i===0){
							_tar.className += _classSplit[i]
						} else {
							_tar.className += (" " + _classSplit[i])
						};			
					};		
				};
				return this	
			}, 
			hasClass : function(a){
				var _a = arguments.length === 0 || typeof a === String ? a : String(a);
				var _tar = this,
					_className = this.className,
					_classSplit;
				_classSplit = _className.split(" ");
				
				if(_a && _tar.className){			
					for(var i=0,_ind = _classSplit.length;i<_ind;i+=1){
						if(_classSplit[i] === _a)return true				
					};
					return false
				};
				return false			
			},
			append : function(a){
				/*
					element.insertAdjacentHTML(position, text);
					'beforebegin'
					element 앞에 
					'afterbegin'
					element 안에 가장 첫번째 child
					'beforeend'
					element 안에 가장 마지막 child
					'afterend'
					element 뒤에				
				*/
				this.insertAdjacentHTML('beforeend', a);
				return this;			
			},
			eq : function(a){
				a
			},
			index : function(a){// a는 사용하지 않음.
				console.log(this)
				for(var i = 0, list = this.parentNode.children, len = list.length ; i < len ; i +=1 ){
					if(list[i] === this){
						return i
					}
				}
			}
		}
	};
	
	// global 전체 정의
	var g = {
		obj : {
			startPage : null,
			mainSection : null,
			friendsArea : null,
			talkListArea : null,
			talkArea : null,
			waitArea : null,
			gnbArea : null,
			gnbAreaList : null
		},
		// 전체적인 init(front)
		init : function(){
			var _obj = this.obj;			
			_obj.startPage = document.getElementById('startPage');
			_obj.mainSection = document.getElementById('mainSection');
			_obj.friendsArea = document.getElementById('friendsArea');
			_obj.talkListArea = document.getElementById('talkListArea');
			_obj.talkArea = document.getElementById('talkArea');
			_obj.waitArea = document.getElementsByClassName('waitArea');			
			_obj.gnbArea = document.getElementById('gnbArea');
			_obj.gnbAreaList = document.querySelectorAll('.gnbBtn');			
			
			all.global.init();
			g.startPage.init();
		},
		// 첫 시작 페이지 정의
		startPage : {
			obj : {
				isLoginPage : false,
				isLoginPageSendServer : false,
				isSignUpPage : false,
				isSignUpPageSendServer : false,
				fbSignInBtn : null,
				emailSignInBtn : null,
				signUpBtn : null,
				startPage : null,
				friendsArea : null,			
				helpBtn : null,
				email_signUpPage : null,
				email_loginPage : null,
				email_signInForm : null,
				email_signInClose : null,
				email_signInSubmitBtn : null,
				email_signInForgotPwBtn : null,
			},
			init : function(){
				var _this = this,
					_obj = this.obj;
					
				// obj 객체 초기화
				_obj.fbSignInBtn = document.getElementById('fbSignIn');
				_obj.emailSignInBtn = document.getElementById('emailSignIn');
				_obj.signUpBtn = document.getElementById('signUp');
				_obj.startPage = document.getElementById('startPage');
				_obj.friendsWrap = document.getElementById('friendsArea');		
				_obj.helpBtn = document.getElementById('help');	
				_obj.email_signUpPage = document.getElementById('email_signUpPage');
											
				
				// 초기 객체 바인딩
				L(_obj.fbSignInBtn).on('click', function(){
					_this.loginSuc();
					return g.mainControl.init();
				});
				L(_obj.emailSignInBtn).on('click', function(){	
					if(_obj.isLoginPage){
						return L(_obj.email_loginPage).addClass('on');
					} else {
						return _this.loginPage_email();	
					};
				});
				L(_obj.signUpBtn).on('click', function(){
					return _this.signUpPage();	
				});		
							
			},
			// email 회원가입 페이지로 넘어갈 때
			signUpPage : function(){
				var _this = this,
					_obj = this.obj,
					_cg = cg;
				
				var submitBtn = document.getElementById('email_signUpSubmitBtn'),
					signUpForm = document.getElementById('signUpForm_email');
								
				L(_obj.email_signUpPage).addClass('on');
								
				// 폼 이벤트 바인딩
				L(submitBtn).on('click', function(e){
					e.preventDefault();					
					if(_obj.isSignUpPageSendServer){						
						return _cg.signUpPage.secondClick(e, signUpForm);
					} else {
						_obj.isSignUpPageSendServer = true;						
						return _cg.signUpPage.sendServer(e, signUpForm, _obj.email_signUpPage);
					}
				}, false)
				
			},
			// email에서 로그인 페이지로 넘어갈 때 사용.
			loginPage_email : function(){
				var _this = this,
					_obj = this.obj,
					_cg = cg;
				
				_obj.isLoginPage = true;
				_obj.email_signInForm = document.getElementById('email_signInForm');	
				_obj.email_loginPage = document.getElementById('email_loginPage');			
				_obj.email_signInClose = document.getElementById('email_signInClose');
				_obj.email_signInSubmitBtn = document.getElementById('email_signInSubmitBtn');
				_obj.email_signInForgotPwBtn = document.getElementById('email_signInForgotPwBtn');
												
				// 기본 동작.	
				L(_obj.email_loginPage).addClass('on');
				
				// 이벤트 바인딩.				
				L(_obj.email_signInSubmitBtn).on('click', function(e){
					e.preventDefault();
					if(_obj.isLoginPageSendServer){						
						return _cg.signInPage.secondClick(e, _obj.email_signInForm);
					} else {
						_obj.isLoginPageSendServer = true;
						return _cg.signInPage.sendServer(e, _obj.email_signInForm, _obj.email_loginPage);
					}									
				}, false);			
				
				L(_obj.email_signInForgotPwBtn).on('click', function(e){
					alert('비밀번호 찾기 페이지는 준비중입니다.')
				});
				
				L(_obj.email_signInClose).on('click', function(e){
					e.preventDefault();
					_obj.email_loginPage.removeClass('on')
				}, false);
				
			},
			// 로그인 성공시 사용할 함수
			loginSuc : function(){
				var _this = this,
					_obj = this.obj;		
			}
		},
		// 친구목록, 대화목록, 더보기 등 기본 정의.
		mainControl : {
			obj : {				
				startPage : null,
				mainSection : null,
				friendsArea : null,
				talkArea : null,
				friendList : null				
			},		
			init : function(){
				var _main = this,
					_obj = this.obj,
					_cg = cg;					
					
				// obj 객체 초기화			
				_obj.startPage = g.obj.startPage;
				_obj.mainSection = g.obj.mainSection;
				_obj.friendsArea = g.obj.friendsArea;
				_obj.talkArea = g.obj.talkArea;
				_obj.friendList = document.querySelectorAll('#friendsArea .friendList>a'); 
				
				
				L(_obj.mainSection).addClass('on');				
				L(_obj.startPage).removeClass('on');
				L(_obj.friendsArea).addClass('on');
				// 기본 이벤트 정의
								
				
				// gnb 
				this.gnbControl.init();
				
				
			}, 
			gnbControl : {
				obj : {				
					mainSection : null,
					friendsArea : null,
					talkArea : null,
					talkListArea : null,
					waitArea : null,	
					gnbArea : null,
					gnbAreaList : null
				},
				init : function(){
					var _main = this,
					_obj = this.obj;
					
					// obj 객체 초기화
					for(var i in _obj){
						g.obj[i] !== undefined ? _obj[i] = g.obj[i] : true;
					};
										
					// 이벤트 바인딩 - gnb 
					for(var i = 0, list = _obj.gnbAreaList, len = list.length ; i < len ; i +=1){
						L(_obj.gnbAreaList[i]).on('click', function(e){						
							
							L(_obj.gnbAreaList).removeClass('on');	
							L(this).addClass('on');
							
							for(var i = 0, list = _obj.waitArea, len = list.length ; i < len ; i +=1){
								L(_obj.waitArea[i]).removeClass('on');								
							};
							
							if(L(this).hasClass('friends')){
								L(_obj.friendsArea).addClass('on');
								g.friendsPage.view();
							} else if(L(this).hasClass('talkListArea')){	
								L(_obj.talkListArea).addClass('on');
								g.talkListAreaPage.view();
							} else if(L(this).hasClass('more')){	
								alert('더보기 준비중입니다.')
							};
							
						}, false)
					}
					
					//gnbAreaList
				}
			}
		},	
		// Friends 페이지 정의
		friendsPage : {
			obj : {
				mainSection : null,
				friendsArea : null,
				talkArea : null,
				friendList : null
			},
			init : function(){
				var _friends = this,
					_obj = this.obj,
					_cg = cg;					
				// obj 객체 초기화			
				_obj.mainSection = g.obj.mainSection;
				_obj.friendsArea = g.obj.friendsArea;
				_obj.talkArea = g.obj.talkArea;
				_obj.friendList = document.querySelector('#friendsArea .friendList>a'); 
				
				_cg.friendsPage.obj = _obj;
				// 화면 정의.
				L(_obj.mainSection).addClass('on');
				
				// 초기 객체 바인딩
								
			},
			view : function(){
				this.init();
			},
			// 친구 검색 이벤트시 사용
			searchFriendEvent : function(){
				
			},
			// 대화방으로 이동할 때 사용.
			goToTalkPage : function(){
				g.talkPage.init();
			}
			// 채팅방으로 넘어갈 때 사용.
		},
		// 대화 목록 페이지 정의
		talkListAreaPage : {
			obj : {
				isView : false,
				mainSection : null,
				friendsArea : null,
				talkArea : null,
				talkListLink : null				
			},
			init : function(){
				var _talkListArea = this,
					_obj = this.obj,
					_cg = cg;					
				// obj 객체 초기화
				_obj.isView = true;				
				for(var i in _obj){
					g.obj[i] !== undefined ? _obj[i] = g.obj[i] : true;
				};
				_obj.talkListLink = document.querySelectorAll('.area_talkListLink');
				
				_cg.talkListAreaPage.obj = _obj;
				
				// 화면 정의.
				
				
				// 기본 이벤트 정의
				for(var i = 0, list = _obj.talkListLink, len = list.length ; i < len ; i +=1){
					L(_obj.talkListLink[i]).on('click', function(e){	
						console.log(g)	
						e.preventDefault();
						// 대화방으로 이동
						g.talkPage.view();
					}, false)
				};				
					
				
			},
			view : function(e){
				
				if(this.obj.isView === false) this.init();
				
				
			},
			// 친구 검색 이벤트시 사용
			searchFriendEvent : function(){
					
			},
			// 대화방으로 이동할 때 사용.
			goToTalkPage : function(){
				g.talkPage.init();
			}
			// 채팅방으로 넘어갈 때 사용.
		},
		// 채팅방 정의
		talkPage : {
			obj : {
				isView : false,
				talkListArea : null,
				talkArea : null,
				talkScrollArea : null,				
				
				// 메시지 전송영역
				sendMsgForm : null,
				textInput : null,
				emoticon : null,
				sendBtn : null
			},
			init : function(){
				var _talk = this,
					_obj = this.obj,
					_cg = cg;			
				// obj 객체 초기화
				_obj.isView = true;				
				for(var i in _obj){
					 g.obj[i] !== undefined ? _obj[i] = g.obj[i] : true;
				};
				_obj.talkListArea = document.querySelector('.mainWrap .talkArea .talkListArea');
				_obj.talkScrollArea = _obj.talkListArea.parentNode;
				_obj.mainSection = document.getElementById('sendMsgForm');
				_obj.textInput = _obj.mainSection.elements.textInput;
				_obj.emoticon = _obj.mainSection.elements.emoticon;
				_obj.sendBtn = _obj.mainSection.elements.sendBtn;
				
				_cg.talkPage.obj = _obj;
				_cg.talkPage.init();
				
				// 이벤트 중에서 chat.js로 넘겨서 서버로 보낼 이벤트 체크.
				L(_obj.sendBtn).on('click', function(e){
					e.preventDefault();
					
					// _cg에게 obj 객체를 보내고, 
					_cg.talkPage.sendMsg(_obj.mainSection);
					
				}, false);
				
			},
			view : function(){
				var _obj = this.obj;
				if(_obj.isView === false) this.init();
				
				L(_obj.talkArea).addClass('on');
			}
		}
		
	};
	// g 끝
	
	// 실행
	g.init();
	return all;
})();


/* 
	chat 관련 시작 
*/
var lQuery ,L = g.L;

var socket = io.connect();
socket.on('connect', function (data) {
	var _data = {};
	_data.name = 'myRoom2';
	_data.id = new Date().getTime() + 'start';
		
    socket.emit('init', _data);
});
// 채팅관련 함수를 넘기기 위해 전역변수 추가.
var cg = {
	userInfo : {
		name : null,
		id : null
	},
	init : function(){
		// name & id 설정
		this.userInfo.name = 'myRoom2';
		this.userInfo.id = new Date().getTime() + 'start';
		
		// 초기화
		
		var _this = this;
		socket.on('joinRoomEnd', function (data) {
			console.log('f룸 가입했당!' + data)
			
		});
		// 누군가가 글을 보낸 후 내 화면에 그릴 때.
		socket.on('sendMsgOtherPeople', function (data) {
			var _tPage = _this.talkPage;
			
			console.log('sendMsgOtherPeople의 메시지를 받았당');
			console.log(_tPage, _tPage.obj.talkListArea)
			_tPage.paintOtherMsg(_tPage.obj.talkListArea, data);		
		}); 
	},
	// 로그인 - email 페이지 정의
	signInPage : {
		sendServer : function(e, formObj, signInPage){
			var data = {},
				_this = this,
				obj = formObj.elements;
			console.log('로그인 버튼을 눌렀당')
			
			data.email = obj.signInEmail_email.value;
			data.password = obj.signInEmail_password.value;
			
			// 서버로 signInSubmitBtn 클릭했을 때 입력정보를 서버로 넘김.	
			socket.emit('signIn_email', data);
			
			socket.on('signIn_email_succ', function (data) {
				console.log('로그인 성공했당');
				_this.signInSucc(signInPage);
			}); 			
			socket.on('signIn_email_fail', function (data) {
				console.log('로그인 실패했당');
				_this.signInFail(signInPage);
			}); 			
		},
		secondClick : function(e, formObj){
			var data = {},
				_this = this,
				obj = formObj.elements;
			console.log('로그인 버튼을 2번 이상 눌렀당');
						
			data.email = obj.signInEmail_email.value;
			data.password = obj.signInEmail_password.value;
			
			socket.emit('signIn_email', data);
		},		
		signInSucc : function(signInPage){
			L(signInPage).removeClass('on')
			alert('로그인 성공')
		},
		signInFail : function(signInPage){
			console.log(signInPage)
			alert('아이디와 비밀번호를 다시 확인해주세요.')
		}			
	},
	// 회원가입-email 페이지 정의
	signUpPage : {
		sendServer : function(e, formObj, signUpPage){
			var data = {},
				_this = this,
				obj = formObj.elements;			
			data.username = obj.signUpEmail_username.value;
			data.email = obj.signUpEmail_emailAddress.value;
			data.password = obj.signUpEmail_password.value;
			
			// 서버로 signUpSubmitBtn 클릭했을 때 가입정보를 서버로 넘김.
			socket.emit('signUp_email', data);
			
			socket.on('signUp_email_succ', function (data) {
				console.log('회원가입 성공했당');
				_this.signUpSucc(signUpPage);
			}); 
		},
		secondClick : function(e, formObj){
			var data = {},
				_this = this,
				obj = formObj.elements;			
			console.log('회원가입 버튼을 2번 이상 클릭했당.')
			data.username = obj.signUpEmail_username.value;
			data.email = obj.signUpEmail_emailAddress.value;
			data.password = obj.signUpEmail_password.value;
			
			socket.emit('signUp_email', data);
		},
		signUpSucc : function(signUpPage){
			console.log(signUpPage)
			L(signUpPage).removeClass('on');
			alert('회원가입이 완료되었습니다.\n 로그인을 해주세요!');
		}		
		
	},
	// Friends 페이지 정의
	friendsPage : {
		obj : {
			mainSection : null,
			waitArea : null,
			talkArea : null,
			topMenuBtn : null,
			searchFireBtn : null,
			searchFriendArea : null,
			searchFriendAreaClose : null,
			friendList : null
		}
	},
	// 대화 목록 페이지 정의
	talkListAreaPage : {
		obj : {
			
		}
	},
	// 채팅방에서 함수 정의.
	talkPage : {
		obj : {
			talkListArea : null,
			talkScrollArea : null,
			sendMsgForm : null,
			textInput : null,
			emoticon : null,
			sendBtn : null
		},
		init : function(){	
			var _obj = this.obj,
				_this = this;
			// 초기 채팅방 입장 시 대화글을 가져옴. 구현 안 됨.
			this.paintInitMsg('init');
			
			return this;
		},
		sendMsg : function(formObj){
			// obj 할당.
			var fpObj = cg.friendsPage.obj,
				_obj = this.obj,			
				_id = cg.userInfo.name,// + e.srcElement.name;
				sendText = formObj.elements.textInput.value;
			
			var data = {
				id : _id,
				text : sendText
			};
			
			// 서버로 전송.
			socket.emit('sendMsg', data);	
			
			// 서버에 넘긴 후 client는 사용자에게 바로 띄워줌.
			this.paintMyMsg(_obj.talkListArea, sendText);			
		},
		paintMyMsg : function(obj, sendText, meInfo){
			var _last = obj.lastElementChild;
			
			if(L(_last).hasClass('me')){
				// 내가 쓴 글이 마지막일 경우
				L(_last.querySelector('ol')).append(					
					'<li class="talkText">' +
						'<span class="msg">' + sendText + '</span>' +
					'</li>'
				);
				obj.parentNode.scrollTop = 99999;				
			} else {
				// 상대가 쓴 글이 마지막일 경우				
				L(obj).append(
					'<li class="talkList me">' +
						'<div class="talkFriendImg">' +
							'<img src="./images/person1.jpg" />' +
						'</div>' +
						'<div class="talkTextArea">' +
							'<em class="name">' + '김종석' + '</em>' +
							'<ol>' +
								'<li class="talkText">' +
									'<span class="msg">' + sendText + '</span>' +
								'</li>' +
							'</ol>' +					
						'</div>' + 
					'</li>'
				);
				obj.parentNode.scrollTop = 99999;
			};
			
			/*
					
					<li class="talkList me">
						<div class="talkFriendImg">
							<img src="./images/person1.jpg" />	
						</div>
						<div class="talkTextArea">
							<em class="name">김종석</em>
							<ol>
								<li class="talkText">
									<span class="msg">그래?? 구럼 기꺼이 해줄게ㅋㅋㅋㅋ 뭔데?</span>
								</li>
							</ol>								
						</div>
					</li>				
					<li class="talkList">
						<div class="talkFriendImg">
							<img src="./images/person1.jpg" />	
						</div>
						<div class="talkTextArea">
							<em class="name">박신혜</em>
							<ol>
								<li class="talkText">
									<span class="msg">연락.. 안 했으면 좋겠어...</span>
								</li>
							</ol>								
						</div>
					</li>
			*/
		},
		paintOtherMsg : function(obj, data){
			console.log(obj)
			var _last = obj.lastElementChild;
			if(L(_last).hasClass('me')){
				// 내가 쓴 글이 마지막일 경우				
				L(obj).append(
					'<li class="talkList">' +
						'<div class="talkFriendImg">' +
							'<img src="./images/person1.jpg" />' +
						'</div>' +
						'<div class="talkTextArea">' +
							'<em class="name">' + '박신혜' + '</em>' +
							'<ol>' +
								'<li class="talkText">' +
									'<span class="msg">' + data.text + '</span>' +
								'</li>' +
							'</ol>' +					
						'</div>' + 
					'</li>'
				);
				obj.parentNode.scrollTop = 99999;
			} else {
				// 상대가 쓴 글이 마지막일 경우				
				L(_last.querySelector('ol')).append(					
					'<li class="talkText">' +
						'<span class="msg">' + data.text + '</span>' +
					'</li>'
				);
				obj.parentNode.scrollTop = 99999;
			};
			
			
			
		},
		// 초기 대화방 입장 시 화면 그리는 함수.
		paintInitMsg : function(a){
			
		}
	}
};

// 시작
cg.init();

})()
	
	
	
	
	

