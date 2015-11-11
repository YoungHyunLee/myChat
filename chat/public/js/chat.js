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
			eq : function(e){
				var children = this.children;
				//	len = children.length;
				// e > len ? e = (len-1) : e;
				return children[e];				
			},
			index : function(a){// a는 사용하지 않음.
				for(var i = 0, list = this.parentNode.children, len = list.length ; i < len ; i +=1 ){
					switch (list[i] === this) {
						case true : return i;
						case false : break;
					};
				}
			}
		}
	};
	
	// global 전체 정의
	var g = all.viewGlobal = {
		obj : {
			startPage : null,
			loadingBar : null,
			mainSection : null,
			headArea : null,
			myInfoArea : null,
			friendsArea : null,
			talkListArea : null,
			talkArea : null,
			allTalkWrap : null,
			waitArea : null,
			gnbArea : null,
			gnbAreaList : null
		},
		// 전체적인 init(front)
		init : function(){
			var _obj = this.obj;			
			_obj.startPage = document.getElementById('startPage');
			_obj.loadingBar = document.getElementById('loadingBar');
			_obj.mainSection = document.getElementById('mainSection');
			_obj.headArea = document.getElementById('headArea');
			_obj.myInfoArea = document.getElementById('myInfoArea');
			_obj.friendsArea = document.getElementById('friendsArea');
			_obj.talkListArea = document.getElementById('talkListArea');
			_obj.talkArea = document.getElementById('talkArea');
			_obj.allTalkWrap = _obj.talkArea.firstElementChild;
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
				//fbSignInBtn : null,
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
				//_obj.fbSignInBtn = document.getElementById('fbSignIn');
				_obj.emailSignInBtn = document.getElementById('emailSignIn');
				_obj.signUpBtn = document.getElementById('signUp');
				_obj.startPage = document.getElementById('startPage');
				_obj.friendsWrap = document.getElementById('friendsArea');		
				_obj.helpBtn = document.getElementById('help');	
				_obj.email_signUpPage = document.getElementById('email_signUpPage');
							
				
				// 초기 객체 바인딩
				/*
				L(_obj.fbSignInBtn).on('click', function(){
					if(_obj.isLoginPage){
						return L(_obj.email_loginPage).addClass('on');
					} else {
						return _this.loginPage_email();	
					};
				});
				*/
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
					L(g.obj.loadingBar).addClass('on');
					if(_obj.isLoginPageSendServer){						
						return _cg.signInPage.secondClick(e, _obj.email_signInForm);
					} else {
						_obj.isLoginPageSendServer = true;
						return _cg.signInPage.sendServer(e, _obj.email_signInForm, _obj.email_loginPage);
					}									
				}, false);			
				
				L(_obj.email_signInForgotPwBtn).on('click', function(e){
					alert('비밀번호 찾기 페이지는 준비중입니다.');
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
				
				g.mainControl.init();
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
				_obj.friendList = document.querySelectorAll('#friendsArea .friendsList .friendList>a'); 
				
				
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
					headArea : null,
					lnbTopMenuBtn : null,
					lnbTopTalkPrevBtn : null,
					lnbHeadText : null,
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
					_obj.lnbTopMenuBtn = document.getElementById('lnbTopMenuBtn');
					_obj.lnbTopTalkPrevBtn = document.getElementById('lnbTopTalkPrevBtn');
					_obj.lnbHeadText = _obj.headArea.getElementsByClassName('lnbHeadText')[0].children[0];
					
										
					// 이벤트 바인딩 - gnb 
					for(var i = 0, list = _obj.gnbAreaList, len = list.length ; i < len ; i +=1){
						L(_obj.gnbAreaList[i]).on('click', function(e){						
							
							L(_obj.gnbAreaList).removeClass('on');	
							L(this).addClass('on');
							
							for(var i = 0, list = _obj.waitArea, len = list.length ; i < len ; i +=1){
								L(_obj.waitArea[i]).removeClass('on');								
							};
							
							if(L(this).hasClass('friends')){
								L(_obj.lnbHeadText).textContent = "Friends";
								L(_obj.friendsArea).addClass('on');
								
								g.friendsPage.view();
							} else if(L(this).hasClass('talkListArea')){
								L(_obj.lnbHeadText).textContent = "Chating";	
								L(_obj.talkListArea).addClass('on');
								
								g.talkListAreaPage.view();
							} else if(L(this).hasClass('more')){
								L(_obj.lnbHeadText).textContent = "More";
								alert('더보기 준비중입니다.')
							};
							
						}, false)
					}
					
					// 이벤트 바인딩 - lnb
					L(_obj.lnbTopTalkPrevBtn).on('click', function(){
						L(_obj.lnbHeadText).textContent = "Chating";	
						L(_obj.lnbTopTalkPrevBtn).removeClass('on');
						L(_obj.lnbTopMenuBtn).addClass('on');
						
						g.talkPage.prevTalkPage();
					})
					
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
				var _this = this,
					_obj = this.obj,
					_cg = cg;					
				// obj 객체 초기화			
				_obj.mainSection = g.obj.mainSection;
				_obj.friendsArea = g.obj.friendsArea;
				_obj.talkArea = g.obj.talkArea;
				_obj.friendList = document.querySelector('#friendsArea .friendsList .friendList>a'); 
				
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
				var _this = this,
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
						e.preventDefault();						
						_this.goToTalkPage(e);
					}, true);
				};				
								
			},
			view : function(e){				
				if(this.obj.isView === false) this.init();
				
				
			},
			// 친구 검색 이벤트시 사용
			searchFriendEvent : function(){
					
			},
			// 대화방으로 이동할 때 사용. (존재하는 것을 클릭했으므로. 앞단 처리)
			goToTalkPage : function(e){
				for(var ele = e.target, _thisEle, ind ;;){
					_thisEle = L(ele).hasClass('friendList');
					switch (_thisEle) {
						case false :
							ele = ele.parentNode 
							break;							
						case true : 
							ind = L(ele).index();
							return cg.talkPage.searchTalkRoom(ind); 				
					}
				}
				
			}
			// 채팅방으로 넘어갈 때 사용.
		},
		// 채팅방 정의
		talkPage : {
			obj : {
				isView : false,
				talkListArea : null,
				talkArea : null,
				allTalkWrap : null,
				talkScrollArea : null,				
				headArea : null,
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
				//_cg.talkPage.obj = _obj;
				_cg.talkPage.init();
				
				// 이벤트 중에서 chat.js로 넘겨서 서버로 보낼 이벤트 체크.
				L(_obj.sendBtn).on('click', function(e){
					e.preventDefault();					
					// _cg에게 obj 객체를 보내고
					_cg.talkPage.sendMsg(_obj.mainSection);					
				}, false);
				
			},
			// 각 사람들의 대화 목록 페이지 호출.
			view : function(ind){				
				var _obj = this.obj;
				if(_obj.isView === false) this.init();
				
				var leftOnBtn = _obj.headArea.getElementsByClassName('topMenuBtn on')[0];
				var leftPrevBtn = _obj.headArea.getElementsByClassName('topMenuBtn prev')[0];
				var headText =  _obj.headArea.querySelector('.lnbHeadText a');
				
				L(leftOnBtn).removeClass('on');
				L(leftPrevBtn).addClass('on');
				headText.textContent = "대화중";
				
				// 대화창 보여주기.
				L(_obj.allTalkWrap).eq(ind).addClass('on');
				cg.talkListAreaPage.	paintTalkRoom(ind);
			},
			prevTalkPage : function(){
				var _obj = this.obj;
				L(_obj.talkArea).removeClass('on');
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
			
			socket.on('signInEnd', function (data) {
				console.log('로그인 성공했당 data는 :', data);
				_this.signInSucc(signInPage, data);
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
		// 로그인 성공했을 때 호출.
		signInSucc : function(signInPage, data){
			
			// 내 프로필 그리기
			cg.friendsPage.paintMyProfile(data.data);
			// 친구 목록 그리기.
			cg.friendsPage.paintMyFriends(data);
			// 채팅 목록 그리기
			cg.talkListAreaPage.init(data);
						
			// 로그인 팝업 지우기.
			L(signInPage).removeClass('on');
			
			// 친구목록 화면 보여주기.
			g.viewGlobal.startPage.loginSuc();
			
			// 로딩 지우기.
			L(g.viewGlobal.obj.loadingBar).removeClass('on');
		},
		signInFail : function(signInPage){
			console.log(signInPage)
			// 로딩 지우기.
			L(g.viewGlobal.obj.loadingBar).removeClass('on');
			
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
			socket.on('signUp_email_fail', function (data) {
				console.log('회원가입 실패했당');
				_this.signUpFail(signUpPage);
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
		},
		signUpFail : function(signUpPage){
			console.log(signUpPage)
			alert('회원가입에 실패하였습니다.\n 이미 존재하거나, 잘못된 정보입니다. 확인해주세요!');
		}
	},
	// Friends 페이지 정의
	friendsPage : {
		obj : {
			isInit : false,
			myInfoArea : null,
			mainSection : null,
			waitArea : null,
			talkArea : null,
			topMenuBtn : null,
			searchFireBtn : null,
			searchFriendArea : null,
			searchFriendAreaClose : null,
			friendList : null
		},
		init : function(){			
			var _this = this, 
				_obj = this.obj,
				_g = g.viewGlobal.obj;
			for(var i in _obj){
				 _g[i] !== undefined ? _obj[i] = _g[i] : true;
			};
			
		},
		paintMyProfile : function(data){
			if(this.obj.isInit === false){
				this.obj.isInit = true;
				this.init();
			};
			var _this = this, 
				_obj = this.obj;
			console.log('내 프로필을 그립니당.data는', data);
			
			var friendElement = this.friendsTemp(data.myProfilePic, data._myId, data.myProfileMsg);
			_obj.myInfoArea.innerHTML = friendElement;
			_obj.myInfoArea._data = {};
			_obj.myInfoArea._data.username = data.username;
			_obj.myInfoArea._data.myProfilePic = data.myProfilePic;
			_obj.myInfoArea._data._myId = data._myId;
			_obj.myInfoArea._data.myProfileMsg = data.myProfileMsg;
		},
		paintMyFriends : function(data){			
			console.log('친구 목록을 그립니당.data는', data);
			var frag = document.createDocumentFragment(),
				div = document.createElement('div');
			var friendOl = g.viewGlobal.obj.friendsArea.getElementsByClassName('friendsList')[0];
			//친구 목록 그리기.
			for(var i = 0, list = data.friendData, len = list.length, friendElement ; i < len ; i +=1){
				friendElement = this.friendsTemp(list[i].myProfilePic, list[i]._myId, list[i].profileMsg);
				div.innerHTML = friendElement;
				frag.appendChild(div.lastChild);
			};
			friendOl.appendChild(frag);
		},
		// 친구 목록 템플릿.
		friendsTemp : function(picUrl, myId, profileMsg){
			if(picUrl === undefined) picUrl = 'default.jpg';
			var temp = 
				'<li class="friendList">' +
					'<a href="#">' +
						'<div class="friendImg">' +
							'<img src="./uploads/userUploadPicture/' + picUrl +'">' +	
						'</div>' +
						'<div class="friendText">' +
							'<em class="name">' + myId + '</em>' +
							'<span class="statusMsg">' + profileMsg + '</span>' +
						'</div>' +
					'</a>' +
				'</li>';
			return temp;
		}
	},
	// 대화 목록 페이지 정의
	talkListAreaPage : {
		obj : {
			talkListArea : null,
			talkArea : null,
			allTalkWrap : null
		},
		init : function(data){
			// 초기 객체 바인딩.
			var _this = this, 
				_obj = this.obj,
				_g = g.viewGlobal.obj;
			for(var i in _obj){
				 _g[i] !== undefined ? _obj[i] = _g[i] : true;
			};
			// 초기화 및 기존 대화 목록 초기화.
			var talkListOl = _obj.talkListArea.children[0];
			var frag = document.createDocumentFragment(),
				talkFrag = document.createDocumentFragment();
			var div = document.createElement('div');
			talkListOl.innerHTML = '';
			
			for(var i = 0, list = data.talkMegData, len = list.length, content, ol, talkElement, roomList ; i < len ; i +=1){
				content = list[i].Content;
				talkElement = this.talkListTemp(undefined, list[i].users, content[content.length-1].date, content[content.length-1].talkCnt);
				div.innerHTML = talkElement;
				div.lastChild._roomname = list[i].roomname;
				frag.appendChild(div.lastChild);
				
				// 채팅 룸 초기화.				
				roomList = cg.talkPage.talkRoomTemp();
				div.innerHTML = roomList;
				talkFrag.appendChild(div.firstChild);
			};
			talkListOl.appendChild(frag);
			_obj.allTalkWrap.appendChild(talkFrag);
			// 채팅 룸 초기화
		},
		// 채팅 목록 뿌리기.(새로운 룸이 생기거나 초대를 받을 때 처리)
		paintMyTalkList : function(data){
			var _this = this,
				_obj = this.obj;
				
			var talkListOl = g.viewGlobal.obj.talkListArea.children[0];
			var frag = document.createDocumentFragment();
			var div = document.createElement('div');
			
			for(var i = 0, list = data.talkMegData, len = list.length, content, ol, talkElement ; i < len ; i +=1){
				content = list[i].Content;
				talkElement = this.talkListTemp(undefined, list[i].users, content[content.length-1].date, content[content.length-1].talkCnt);
				div.innerHTML = talkElement;
				div.lastChild._roomname = list[i].roomname;
				frag.appendChild(div.lastChild);
				console.dir(frag);
			};
			talkListOl.appendChild(frag);
		},
		// 채팅 목록 템플릿.
		talkListTemp : function(picUrl, myId, date, lastMsg){
			if(picUrl === undefined) picUrl = 'default.jpg';
			var users = '';
			for(var i = 0, len = myId.length ; i < len ; i +=1){
				users += myId[i] + ', ' 
			};
			users = users.slice(0, -2);			
			var temp = 
				 '<li class="friendList">' +
					'<a href="#" class="area_talkListLink">' +
						'<div class="friendImg">' +
							'<img src="../uploads/userUploadPicture/' + picUrl + '">' +
						'</div>' +
						'<div class="friendText">' +
							'<em class="names">' + myId + '</em>' +
							'<span class="lastMsgDate">' + date + '</span>' +
							'<span class="talkMsg">' + lastMsg + '</span>' +
						'</div>' +
					'</a>' +
				'</li>'; 
				
			return temp;
		}
	},
	// 채팅방에서 함수 정의.
	talkPage : {
		obj : {
			isInit : false,
			myInfoArea : null,
			talkListArea : null,
			allTalkWrap : null,
			talkScrollArea : null,
			sendMsgForm : null,
			textInput : null,
			emoticon : null,
			sendBtn : null
		},
		init : function(){
			var _obj = this.obj,
				_this = this,
				_g = g.viewGlobal.obj;
			for(var i in _obj){
				 _g[i] !== undefined ? _obj[i] = _g[i] : true;
			};			
			var myObj = _obj.myInfoArea._data;
			
			socket.on('talkRoomContentSearchData', function(data){
				console.log("나 채팅방 db조회 후에 가져왔다!!", data)
				_this.paintTalkRoom(data, myObj);
			});
			
			/*
			_obj.talkListArea = document.querySelector('.mainWrap .talkArea .talkListArea');
			_obj.talkScrollArea = _obj.talkListArea.parentNode;
			_obj.mainSection = document.getElementsByClassName('sendMsgForm');
			_obj.textInput = _obj.mainSection.elements.textInput;
			_obj.emoticon = _obj.mainSection.elements.emoticon;
			_obj.sendBtn = _obj.mainSection.elements.sendBtn;
			*/
			// 초기 채팅방 입장 시 대화글을 가져옴. 구현 안 됨.
			//this.paintInitMsg('init');
			
			return this;
		},
		// db에서 해당 룸에 대한 정보를 검색.
		searchTalkRoom : function(ind){
			if(this.obj.isInit === false){
				this.obj.isInit = true;
				this.init(ind);
			};
			var _this = this, 
				_obj = this.obj;
				
			var obj = _obj.talkListArea.getElementsByClassName('friendList')[ind];
			var data = {
				clickInd : ind,
				roomname : obj._roomname,
				username : _obj.myInfoArea._data.username
			};
			
			socket.emit('talkRoomContentSearch', data);
			console.log("서버로 채팅방 컨텐츠를 검색하도록 실행합니다.")
		},
		// 채팅방 목록 그리기
		paintTalkRoom : function(data, myObj){				
			// 초기화 및 기존 채팅룸 초기화.
			var _this = this, 
				_obj = this.obj;
			var talkRoomOl;
			var frag = document.createDocumentFragment(),
				div = document.createElement('div');
			var userInfoArray = [],
				myInd = 0,
				initRoomObj;
			if(data.clickInd){
				talkRoomOl = L(_obj.allTalkWrap).eq(data.clickInd);
				initRoomObj = talkRoomOl.getElementsByClassName('talkListArea')[0];
				initRoomObj.innerHTML = "";
			} else {
				div.innerHTML = this.talkRoomTemp();
				_obj.allTalkWrap.appendChild(div.firstChild);
				talkRoomOl = _obj.allTalkWrap.lastChild;
				initRoomObj = talkRoomOl.getElementsByClassName('talkListArea')[0];
			};		
			
			// img 정보나 프로필 정보 등의 용도로 저장.
			for(var j = 0, jList = data.friendsData, jLen = jList.length ; j < jLen ; j +=1){				
				switch(jList[j] == undefined){
					case false : userInfoArray[j] = jList[j];
					break;
					case true : 
						myInd = j;
						userInfoArray[j] = myObj;
					break;						 
				}
			};
			console.log("채팅방 초기화 전에 데이터 검색", userInfoArray)
			for(var i = 0, list = data.content[0].Content, len = list.length, idx = -1, content, isMe, isMeLast, isDouble, talkElement ; i < len ; i +=1){
				content = list[i];
				idx === content.idx ? isDouble = true : isDouble = false;
				idx = content.idx;				
				if(isDouble === true && myInd === idx){ // 내가 연속적으로 쓸 때, 같은 사람이면서 내가 쓴 것일 경우.
					talkElement = this.paintMyMsg(initRoomObj, isDouble, userInfoArray[idx].myProfilePic, userInfoArray[idx]._myId, list[i].talkCnt, list[i].date);
				} else if(isDouble === true && myInd !== idx) { // 다른 사람이 혼자 연속으로 쓸 때. 같은 사람이면서 내가 쓴 것이 아닌 경우
					talkElement = this.paintOtherMsg(initRoomObj, isDouble, userInfoArray[idx].myProfilePic, userInfoArray[idx]._myId, list[i].talkCnt, list[i].date);
				} else if(isDouble === false && myInd === idx) { // 내가 새롭게 말을 할 때. 새로운 사람이면서 내가 쓴 것일 경우
					talkElement = this.paintMyMsg(initRoomObj, isDouble, userInfoArray[idx].myProfilePic, userInfoArray[idx]._myId, list[i].talkCnt, list[i].date);
				} else if(isDouble === false && myInd !== idx) { // 다른 사람이 새롭게 말을 할 때. 새로운 사람이면서 내가 쓴 것이 아닌 경우.
					talkElement = this.paintOtherMsg(initRoomObj, isDouble, userInfoArray[idx].myProfilePic, userInfoArray[idx]._myId, list[i].talkCnt, list[i].date);
				};
				
				/*
					paintMyMsg 등을 내가 talkElement에 저장해서 frag에 뿌리는데 
					기존에는 바로 처리하도록 되어 있음.
					
					하지만 하나씩 그리는 건 지금이 맞고, 
					한 번에 많이 그리도록 해야 하므로 수정이 필요함.
				
				*/
				div.innerHTML = talkElement;
				frag.appendChild(div.lastChild);
			};
			talkRoomOl.appendChild(frag);
			console.log("끝")
		},
		// 채팅방 템플릿
		talkRoomTemp : function(isMe, picUrl, myId, msg, date){			
			var temp = 
				 '<li class="allTalkList">' +
					'<div class="scrollArea">' +
						'<ol class="talkListArea">' +
							// 나 또는 상대의 메시지가 들어가는 영역.
						'</ol>' +
					'</div>' +
					'<aside class="textInputArea">' +
						'<form class="sendMsgForm" action="">' +
							'<fieldset>' +
								'<legend>글 입력 영역</legend>' +
								'<div class="textInputFieldArea">' +
									'<input type=text name="textInput" title="말하고 싶은 글 입력" placeholder="Write text...." class="textInputField" />' +							
								'</div>' +
								'<div class="sendBtnWrap">' +
									'<button type=submit name="emoticon" class="emoticonBtn" title="이모티콘 사용하기">@</button>' +
									'<button type=submit name="sendBtn" class="sendBtn" title="보내기">전송</button>' +
								'</div>' +
							'</fieldset>' +
						'</form>' +
					'</aside>' +
				'</li>';
				
			return temp;
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
		paintMyMsg : function(obj, isDouble, picUrl, _myId, talkCnt, date){						
			if(isDouble){
				// 내가 쓴 글이 마지막일 경우
				L(obj.lastChild.querySelector('ol')).append(
					'<li class="talkText">' +
						'<span class="msg">' + talkCnt + '</span>' +
					'</li>'
				);
				obj.parentNode.scrollTop = 99999;				
			} else {
				// 상대가 쓴 글이 마지막일 경우
				console.log("내 메시지를 그리는데 false일 때", obj)
				L(obj).append(
					'<li class="talkList me">' +
						'<div class="talkFriendImg">' +
							'<img src="../uploads/userUploadPicture/' + picUrl + '" alt ="사용자 프로필 사진">' +
						'</div>' +
						'<div class="talkTextArea">' +
							'<em class="name">' + _myId + '</em>' +
							'<ol>' +
								'<li class="talkText">' +
									'<span class="msg">' + talkCnt + '</span>' +
								'</li>' +
							'</ol>' +					
						'</div>' + 
					'</li>'
				);
				obj.parentNode.scrollTop = 99999;
			};
		},
		paintOtherMsg : function(obj, isDouble, picUrl, _myId, talkCnt, date){	
			var _last = obj.lastElementChild;
			if(isDouble){
				// 이미 쓰던 사람이 쓴 글이 마지막일 경우				
				L(obj.lastChild.querySelector('ol')).append(					
					'<li class="talkText">' +
						'<span class="msg">' + talkCnt + '</span>' +
					'</li>'
				);
				obj.parentNode.scrollTop = 99999;
			} else {
				// 새로운 상대가 쓴 글이 마지막일 경우			
				L(obj).append(
					'<li class="talkList">' +
						'<div class="talkFriendImg">' +
							'<img src="../uploads/userUploadPicture/' + picUrl + '" alt ="사용자 프로필 사진">' +
						'</div>' +
						'<div class="talkTextArea">' +
							'<em class="name">' + _myId + '</em>' +
							'<ol>' +
								'<li class="talkText">' +
									'<span class="msg">' + talkCnt + '</span>' +
								'</li>' +
							'</ol>' +					
						'</div>' + 
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
	
	
	
	
	

