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
				var _ieEvent = "on"+a,
					doc = document;
				c ? c : false;
				
				if(doc.addEventListener){
					this.addEventListener(a,b,c);
				} else if (doc.attachEvent) {
					this.attachEvent(_ieEvent,b)
				};
				return false;
			},
			addClass : function(a){
				var _a = arguments.length === 0 || typeof a === String ? a : String(a);
				var _tar = this,
					_classSpace = " "+_a;
				if(!_tar.className){
					//_tar.className = _a;
					return this;
				} else if(L(this).hasClass(_a)){
					return this;
				};
				var _className = _tar.className,
					_classText,_classSplit,_classLastAdd = false;
				if(a && !!_tar.className){
					_classSplit = _className.split(" ");
					if(_classSplit.length === 1 && _classSplit[0] === _a){
						return this;
					};			
					_tar.className = "";
					for(var i=0,_ind = _classSplit.length;i<_ind;i+=1){
						if(_classSplit[i] === _a) continue;
						switch (i === 0){
							case true : 
								_tar.className = _classSplit[i];
							break;
							case false : 
								_tar.className += (" " + _classSplit[i]);
							break;
						};						
					};
					_tar.className += _classSpace;
				};
				
				return this;
			},
			removeClass : function(a){	
				var a = arguments.length === 0 || typeof a === String ? a : String(a);
				var _tar = this;
				var _className = _tar.className,
					_classText,_classSplit;
				if(L(this).hasClass(a) === false){
					return this;
				};
				if(a && _tar.className){
					_classSplit = _className.split(" ");		
					_tar.className = "";
					
					for(var i=0,_ind = _classSplit.length;i<_ind;i+=1){
						if(_classSplit[i] === a) continue;
						switch (i === 0){
							case true : 
								_tar.className += _classSplit[i];
							break;
							case false : 
								_tar.className += (" " + _classSplit[i]);
							break;
						};
					};		
				};
				return this;
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
			parentClassSearch : function(a){
				for(var ele = this, _thisEle ;;){
					_thisEle = L(ele).hasClass(a);
					if(_thisEle === false){
						ele = ele.parentNode;					
					} else {
						return ele;
					};
				};
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
			var _obj = this.obj,
				doc = document;	
			_obj.startPage = doc.getElementById('startPage');
			_obj.loadingBar = doc.getElementById('loadingBar');
			_obj.mainSection = doc.getElementById('mainSection');
			_obj.headArea = doc.getElementById('headArea');
			_obj.myInfoArea = doc.getElementById('myInfoArea');
			_obj.friendsArea = doc.getElementById('friendsArea');
			_obj.talkListArea = doc.getElementById('talkListArea');
			_obj.talkArea = doc.getElementById('talkArea');
			_obj.allTalkWrap = _obj.talkArea.firstElementChild;
			_obj.waitArea = doc.getElementsByClassName('waitArea');			
			_obj.gnbArea = doc.getElementById('gnbArea');
			_obj.gnbAreaList = doc.querySelectorAll('.gnbBtn');			
			
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
				submitBtn : null,
				signUpForm : null,
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
					_obj = this.obj,
					doc = document;
					
				// obj 객체 초기화
				//_obj.fbSignInBtn = document.getElementById('fbSignIn');
				_obj.emailSignInBtn = doc.getElementById('emailSignIn');
				_obj.signUpBtn = doc.getElementById('signUp');
				_obj.startPage = doc.getElementById('startPage');
				_obj.friendsWrap = doc.getElementById('friendsArea');		
				_obj.helpBtn = doc.getElementById('help');	
				_obj.email_signUpPage = doc.getElementById('email_signUpPage');
				_obj.email_signUpPageClose = _obj.email_signUpPage.getElementsByClassName('popClose')[0];
				_obj.submitBtn = doc.getElementById('email_signUpSubmitBtn');	
				_obj.signUpForm = doc.getElementById('signUpForm_email');
							
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
				L(_obj.email_signUpPageClose).on('click', function(){
					return L(_obj.email_signUpPage).removeClass('on');
				});					
				
				// 폼 이벤트 바인딩
				L(_obj.submitBtn).on('click', function(e){
					e.preventDefault();					
					if(_obj.isSignUpPageSendServer){						
						return cg.signUpPage.secondClick(e, _obj.signUpForm);
					} else {
						_obj.isSignUpPageSendServer = true;
						return cg.signUpPage.sendServer(e, _obj.signUpForm, _obj.email_signUpPage);
					}
				}, false);
				
			},
			// email 회원가입 페이지로 넘어갈 때
			signUpPage : function(){
				var _this = this,
					_obj = this.obj;			
								
				L(_obj.email_signUpPage).addClass('on');
				
			},
			// email에서 로그인 페이지로 넘어갈 때 사용.
			loginPage_email : function(){
				var _this = this,
					_obj = this.obj,
					doc = document,
					_cg = cg;
				
				_obj.isLoginPage = true;
				_obj.email_signInForm = doc.getElementById('email_signInForm');	
				_obj.email_loginPage = doc.getElementById('email_loginPage');			
				_obj.email_signInClose = doc.getElementById('email_signInClose');
				_obj.email_signInSubmitBtn = doc.getElementById('email_signInSubmitBtn');
				_obj.email_signInForgotPwBtn = doc.getElementById('email_signInForgotPwBtn');
												
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
					g.mainControl.alert('비밀번호 찾기 페이지는 준비중입니다.');
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
				isFriendSearchInit : false,
				isGnbInit : false,
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
				
				g.friendsPage.init();
				// 기본 이벤트 정의
				
				// gnb & friendSearch				
				_obj.isFriendSearchInit ? true : this.searchFriend.init();
				_obj.isGnbInit ? true : this.gnbControl.init();
				g.talkPage.init();
			},
			searchFriend : {
				obj : {
					friendsArea : null,
					friendSearchPopBtn : null,
					friendSearchPop : null,
					friendSearchInput : null,
					friendSearchShadow : null,
					friendSearchClose : null,
					friendSearchBtn : null,
					saveFriend : null
				},
				init : function(){
					g.mainControl.obj.isFriendSearchInit = true;
					var _obj = this.obj,
					doc = document;
					
					for(var i in _obj){
						g.obj[i] !== undefined ? _obj[i] = g.obj[i] : true;
					};
					_obj.friendSearchPopBtn = doc.getElementById('friendSearchPopBtn');
					_obj.friendSearchPop = doc.getElementById('friendSearchPop');
					_obj.friendSearchInput = doc.getElementById('friendSearchInput');					
					_obj.friendSearchShadow = _obj.friendSearchPop.getElementsByClassName('popShadow')[0];
					_obj.friendSearchClose = _obj.friendSearchPop.getElementsByClassName('popClose')[0];
					_obj.friendSearchBtn = _obj.friendSearchPop.getElementsByClassName('friendSearchBtn')[0];
					_obj.searchResult = _obj.friendSearchPop.getElementsByClassName('searchResult')[0];
					_obj.saveFriend = _obj.friendSearchPop.getElementsByClassName('saveFriend')[0];
										
					// 기본 이벤트 바인딩.
					L(_obj.friendSearchPopBtn).on('click', function(){
						L(_obj.friendSearchPop).addClass('on');
						_obj.friendSearchInput.value = '';
						_obj.searchResult.innerHTML = '';
					});					
					L(_obj.friendSearchShadow).on('click', function(){
						L(_obj.friendSearchPop).removeClass('on');
					});
					L(_obj.friendSearchClose).on('click', function(){
						L(_obj.friendSearchPop).removeClass('on');
					});
					L(_obj.friendSearchBtn).on('click', function(e){
						e.preventDefault();
						cg.friendSearch.view(_obj.friendSearchInput.value);
					});
					L(_obj.searchResult).on('click', function(e){
						e.preventDefault();
						g.friendsPage.profileView(_obj.searchResult._data, false);
						//_obj.searchResult._data.
					});
					L(_obj.saveFriend).on('click', function(){
						cg.friendSearch.save(_obj.searchResult._data);
					});
				}, 
				viewResult : function(data){						
					var _obj = this.obj;
					if(data == undefined){
						_obj.searchResult._data = undefined;
						_obj.searchResult.innerHTML = '';
						return g.mainControl.alert("ID를 다시 확인해주세요!");
					};
					var profileMsg = data.profileMsg ? true : profileMsg = '';
					var frag = 
						'<div class="friendList">' +
							'<div class="friendImg">' +
								'<img src="./uploads/userUploadPicture/' + data.profilePic  + '">' +
							'</div>' +
							'<div class="friendText">' +
								'<em class="name">' + data._myId + '</em>' +
								'<span class="statusMsg">' + profileMsg + '</span>' +
							'</div>' +
						'</div>';
					_obj.searchResult._data = data;
					_obj.searchResult.innerHTML = frag;									
				},
				saveResult : function(data){				
					var _obj = this.obj;
					console.log("친구 목록을 저장했다!", data);
					if(data == undefined || data === false){
						return g.mainControl.alert("이미 등록한 친구입니다.");
					};
					var _obj = this.obj,
						li = document.createElement('li');
					var temp = cg.friendsPage.friendsTemp(data.profilePic, data._myId, data.profileMsg);
					li.innerHTML = temp;
					li.className = 'friendList'
					li._data = data;					
					L(li).on('click', function(e){
						e.preventDefault();
						var me = L(e.target).parentClassSearch('friendList'), data, isMe;
						if(me._data){
							data = me._data;
							isMe = false;
						} else {
							data = cg.userInfo;
							isMe = true;
						};
						g.friendsPage.profileView(data, isMe);
					}, false);
					
					_obj.friendsArea.getElementsByClassName('friendsList')[0].appendChild(li);
					
					return L(_obj.friendSearchPop).removeClass('on');
				}
			},
			gnbControl : {
				obj : {
					mainSection : null,
					allTalkWrap : null,
					headArea : null,
					lnbTopMenuBtn : null,
					lnbTopTalkPrevBtn : null,
					friendSearchPopBtn : null,
					lnbHeadText : null,
					friendsArea : null,
					talkListArea : null,
					talkArea : null,
					waitArea : null,	
					gnbArea : null,
					gnbAreaList : null,
					friendsFireBtn : null,
					talkListFireBtn : null,
					moreFireBtn : null
				},
				init : function(){
					g.mainControl.obj.isGnbInit = true;
					var _this = this,
						_obj = this.obj,
						doc = document;
										
					// obj 객체 초기화
					for(var i in _obj){
						g.obj[i] !== undefined ? _obj[i] = g.obj[i] : true;
					};
					_obj.lnbTopMenuBtn = doc.getElementById('lnbTopMenuBtn');
					_obj.lnbTopTalkPrevBtn = doc.getElementById('lnbTopTalkPrevBtn');
					_obj.friendSearchPopBtn = doc.getElementById('friendSearchPopBtn');
					_obj.friendsFireBtn = doc.getElementById('friendsFireBtn');
					_obj.talkListFireBtn = doc.getElementById('talkListFireBtn');
					_obj.moreFireBtn = doc.getElementById('moreFireBtn');
					
					_obj.lnbHeadText = _obj.headArea.getElementsByClassName('lnbHeadText')[0].children[0];
					
					// 이벤트 바인딩 - gnb 
					L(_obj.friendsFireBtn).on('click', function(e){
						_this.friendsPage(e);
					});
					L(_obj.talkListFireBtn).on('click', function(e){
						_this.talkListArea(e);
					});
					L(_obj.moreFireBtn).on('click', function(e){
						_this.morePage(e);
					});
					
					// 이벤트 바인딩 - lnb
					L(_obj.lnbTopTalkPrevBtn).on('click', function(){
						var nowRoom = cg.userInfo.nowRoom,
							listOn = _obj.allTalkWrap.getElementsByClassName('allTalkList on')[0];
							
						cg.userInfo.nowRoom = null;
						L(_obj.lnbHeadText).textContent = "Chating";	
						L(_obj.lnbTopTalkPrevBtn).removeClass('on');
						L(_obj.lnbTopMenuBtn).addClass('on');
						
						if(nowRoom === null){
							_obj.allTalkWrap.removeChild(listOn);
						} else {
							L(listOn).removeClass('on');
						};						
						g.talkPage.prevTalkPage();
					});					
				},
				friendsPage : function(e){
					var _this = this,
						_obj = this.obj;
						
					for(var i = 0, list = _obj.waitArea, len = list.length ; i < len ; i +=1){
						L(_obj.waitArea[i]).removeClass('on');								
					};
					
					L(_obj.lnbHeadText).textContent = "Friends";
					L(_obj.friendsArea).addClass('on');
					L(_obj.friendSearchPopBtn).addClass('on');
					
					L(_obj.talkListFireBtn).removeClass('on');
					L(_obj.moreFireBtn).removeClass('on');
					L(_obj.friendsFireBtn).addClass('on');
					
					g.friendsPage.view();
				},
				talkListArea : function(e){
					var _this = this,
						_obj = this.obj;
						
					for(var i = 0, list = _obj.waitArea, len = list.length ; i < len ; i +=1){
						L(_obj.waitArea[i]).removeClass('on');
					};
					
					L(_obj.lnbHeadText).textContent = "Chating";
					L(_obj.talkListArea).addClass('on');
					L(_obj.friendSearchPopBtn).removeClass('on');
					
					L(_obj.friendsFireBtn).removeClass('on');
					L(_obj.moreFireBtn).removeClass('on');
					L(_obj.talkListFireBtn).addClass('on');
					
					g.talkListAreaPage.view();
				},
				morePage : function(e){
					var _this = this,
						_obj = this.obj;
						
					for(var i = 0, list = _obj.waitArea, len = list.length ; i < len ; i +=1){
						L(_obj.waitArea[i]).removeClass('on');								
					};
					
					L(_obj.lnbHeadText).textContent = "More";
					L(_obj.friendsFireBtn).removeClass('on');
					L(_obj.talkListFireBtn).removeClass('on');
					L(_obj.moreFireBtn).addClass('on');
										
					g.mainControl.alert('더보기 준비중입니다.');					
				}
			},
			alert : function(data){
				alert(data)
			}
		},	
		// Friends 페이지 정의
		friendsPage : {
			obj : {
				isInit : false,
				isRunningTalkUserBtn : false,
				mainSection : null,
				lnbTopMenuBtn : null,
				lnbTopTalkPrevBtn : null,
				friendSearchPopBtn : null,
				lnbHeadText : null,
				friendsArea : null,
				talkListArea : null,
				talkArea : null,
				friendList : null,
				profilePop : null,
				shadowLink : null,
				profilePopClose : null,
				talkUserBtn : null,
				profileBg : null,
				profilePic : null,
				profileMyId : null				
			},
			init : function(){
				var _this = this,
					_obj = this.obj,
					doc = document,
					_cg = cg;
														
				// obj 객체 초기화
				for(var i in _obj){
					g.obj[i] !== undefined ? _obj[i] = g.obj[i] : true;
				};					
				// obj 객체 초기화			
				_obj.mainSection = g.obj.mainSection;
				_obj.friendsArea = g.obj.friendsArea;
				_obj.talkArea = g.obj.talkArea;
				_obj.friendList = _obj.friendsArea.querySelectorAll('.friendList>a'); 
				_obj.profilePop = doc.getElementById('profilePop');
				_obj.shadowLink = _obj.profilePop.firstElementChild;
				_obj.profilePopClose = doc.getElementById('profilePopClose');
				_obj.talkUserBtn = doc.getElementById('talkUserBtn');
				_obj.profileBg = _obj.profilePop.querySelector('.profileBg img');
				_obj.profilePic = _obj.profilePop.querySelector('.profilePic img');
				_obj.profileMyId = _obj.profilePop.getElementsByClassName('profileMyId')[0];
				
				_cg.friendsPage.obj = _obj;
				
				// 화면 정의.
				
				// 초기 객체 바인딩
				for(var i =0, list = _obj.friendList, len = list.length ; i < len ; i +=1){
					L(list[i]).on('click', function(e){
						e.preventDefault();
						var me = L(e.target).parentClassSearch('friendList'), data, isMe;
						if(me._data){
							data = me._data;
							isMe = false;
						} else {
							data = cg.userInfo;
							isMe = true;
						};
						_this.profileView(data, isMe);
					}, false);
				};
				
				L(_obj.shadowLink).on('click', function(e){
					_obj.profilePop._data = '';
					L(_obj.profilePop).removeClass('on');
				});
				L(_obj.profilePopClose).on('click', function(e){
					_obj.profilePop._data = '';
					L(_obj.profilePop).removeClass('on');
				});				
				L(_obj.talkUserBtn).on('click', function(e){
					if(_obj.isRunningTalkUserBtn) return false;
					_obj.isRunningTalkUserBtn = true;
					var data = _obj.profilePop._data,
						nowUsers = [data.username, cg.userInfo.username].sort() + '';
										
					for(var i = 0, list = _obj.talkListArea.getElementsByClassName('friendList') ,len = list.length, sortList ; i < len ; i += 1){
						sortList = list[i]._data.users.sort() + '';
						console.log('있는지 없는지 테스트용.',  nowUsers, sortList, nowUsers === sortList);
						switch(nowUsers === sortList){
							case true : 
								// 이미 만들어진 대화방이 있으면 오픈.
								L(_obj.profilePop).removeClass('on');
								g.talkPage.view(list[i]);
								return _obj.isRunningTalkUserBtn = false;
							case false : 
								// 반복을 돌려야 하니 진행.
								continue;
						}
					};
					g.talkPage.createTalkRoom(data);
					return _obj.isRunningTalkUserBtn = false;				
					
				});
			},
			view : function(){
				var _this = this,
					_obj = this.obj;
				
			},
			// 대화방으로 이동할 때 사용.
			goToTalkPage : function(){
				g.talkPage.init();
			},
			// 친구 또는 자신의 목록을 클릭했을 때 보여주는 프로필 팝업.
			profileView : function(data, isMe){
				console.log("프로필 팝업을 그린다!!", data, isMe);
				var _this = this,
					_obj = this.obj;
				var picUrl = data.profilePic,
					picBgUrl = data.profileBg ? data.profileBg : 'default_bg.jpg'; 
								
				_obj.profileBg.src = '../uploads/userUploadPicture/' + picBgUrl;
				_obj.profilePic.src = '../uploads/userUploadPicture/' + picUrl;
				_obj.profileMyId.innerHTML = data._myId;
				
				L(_obj.profilePop).addClass('on');				
				_obj.profilePop._data = data;
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
					_cg = cg,
					_cgObj = _cg.talkListAreaPage.obj;				
				// obj 객체 초기화
				_obj.isView = true;				
				for(var i in _obj){
					g.obj[i] !== undefined ? _obj[i] = g.obj[i] : true;
				};
				for(var i in _obj){
					_cgObj[i] !== undefined ? true : _cgObj[i] = _obj[i];
				};
				_obj.talkListLink = document.querySelectorAll('.area_talkListLink');
				
				_cg.talkListAreaPage.obj = _obj;
				
				// 화면 정의.				
				
				// 기본 이벤트 정의
				for(var i = 0, list = _obj.talkListLink, len = list.length ; i < len ; i +=1){
					L(_obj.talkListLink[i]).on('click', function(e){
						e.preventDefault();
						g.talkPage.view(e);
					}, false);
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
				
				
			}
			// 채팅방으로 넘어갈 때 사용.
		},
		// 채팅방 정의
		talkPage : {
			obj : {
				isNewRoomCreateComplete : false,
				isView : false,
				talkListArea : null,
				talkArea : null,
				allTalkWrap : null,
				talkScrollArea : null,				
				headArea : null,
				lnbTopMenuBtn : null,
				lnbTopTalkPrevBtn : null,
				friendSearchPopBtn : null,
				lnbHeadText : null,
				// 메시지 전송영역
				sendMsgForm : null,
				textInput : null,
				emoticon : null,
				sendBtn : null
			},
			init : function(){
				if(this.obj.isView === true){return false;}
				this.obj.isView = true;
				var _talk = this,
					_obj = this.obj,
					_cg = cg,
					gnbObj = g.mainControl.gnbControl.obj;
				// obj 객체 초기화				
				for(var i in _obj){
					gnbObj[i] !== undefined ? _obj[i] = gnbObj[i] : true;
				};
				for(var i in _obj){
					g.obj[i] !== undefined ? _obj[i] = g.obj[i] : true;
				};
				//_cg.talkPage.obj = _obj;
				//_cg.talkPage.init();
			},
			// 각 사람들의 대화 목록 페이지 호출.
			view : function(e){
				var _obj = this.obj;
				if(_obj.isView === false) this.init();
				e.target ? true : e.target = e;
				
				L(_obj.lnbTopMenuBtn).removeClass('on');
				L(_obj.lnbTopTalkPrevBtn).addClass('on');
				_obj.lnbHeadText.textContent = "대화중";
				// 대화창 보여주기.
				L(_obj.talkArea).addClass('on');
				
				for(var ele = e.target, _thisEle, ind ;;){
					_thisEle = L(ele).hasClass('friendList');
					if(_thisEle === false){
						ele = ele.parentNode;
					} else {
						ind = L(ele).index();
						cg.userInfo.nowRoom = L(ele)._data.roomname;
						cg.talkPage.searchTalkRoom(ind);
						break;
					};
				};
				var selectTalkList =  L(_obj.allTalkWrap).eq(ind);
				L(selectTalkList).addClass('on');
				// talkRoom event binding
				_obj.sendMsgForm = selectTalkList.getElementsByClassName('sendMsgForm')[0];
				_obj.textInput = _obj.sendMsgForm.elements.textInput;
				_obj.emoticon = _obj.sendMsgForm.elements.emoticon;
				_obj.sendBtn = _obj.sendMsgForm.elements.sendBtn;
				
				// 서버로 보낼 이벤트 체크.
				L(_obj.sendBtn).on('click', function(e){
					e.preventDefault();		
					// _cg에게 obj 객체를 보내고
					cg.talkPage.sendMsg(_obj.sendMsgForm);					
				}, false);
				//L(_obj.allTalkWrap).eq(ind).addClass('on');
			},
			prevTalkPage : function(){
				var _obj = this.obj;
				L(_obj.talkArea).removeClass('on');
			},
			createTalkRoom : function(data){				
				var _obj = this.obj;
				
				var div = document.createElement('div'),
					allTalkWrap = this.obj.allTalkWrap,
					profilePop = g.friendsPage.obj.profilePop,					
					selectTalkList, roomList;
				// 기본 템플릿 뿌리기
				roomList = cg.talkPage.talkRoomTemp();
				div.innerHTML = roomList;
				div.firstChild._data = data;
				_obj.allTalkWrap.appendChild(div.firstChild);
				
				g.mainControl.gnbControl.talkListArea();
				L(_obj.lnbTopMenuBtn).removeClass('on');
				L(_obj.lnbTopTalkPrevBtn).addClass('on');
				_obj.lnbHeadText.textContent = "대화중";
				
				L(allTalkWrap.lastChild).addClass('on');
				L(this.obj.talkArea).addClass('on');
				L(profilePop).removeClass('on');
				
				selectTalkList = _obj.allTalkWrap.lastChild;				
				// talkRoom event binding	
				_obj.sendMsgForm = selectTalkList.getElementsByClassName('sendMsgForm')[0];
				_obj.textInput = _obj.sendMsgForm.elements.textInput;
				_obj.emoticon = _obj.sendMsgForm.elements.emoticon;
				_obj.sendBtn = _obj.sendMsgForm.elements.sendBtn;
				
				// 서버로 보낼 이벤트 체크.
				L(_obj.sendBtn).on('click', function(e){
					e.preventDefault();
					
					if(cg.userInfo.nowRoom == null && _obj.isNewRoomCreateComplete) {
						return false;
					} else if(cg.userInfo.nowRoom == null ) {
						_obj.isNewRoomCreateComplete = true;
						L(g.obj.loadingBar).addClass('on');
					};
					if(e.target._data){
						var ind = L(document.getElementById('room_' + e.target._data.room)).index();
						var selectForm = L(_obj.allTalkWrap).eq(ind).getElementsByClassName('sendMsgForm')[0];
						cg.talkPage.sendMsg(selectForm);
					} else {
						var otherData = _obj.allTalkWrap.lastChild._data.username;
						cg.talkPage.sendMsg(_obj.sendMsgForm, otherData);
					};
				});
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
    socket.emit('init', '실행');
});
// 채팅관련 함수를 넘기기 위해 전역변수 추가.
var cg = {
	userInfo : {
		username : null,
		profilePic : null,
		_myId : null,
		profileMsg : null,
		nowRoom :null
	},
	init : function(){
		// 초기화
		
		var _this = this;
		// 누군가가 글을 보낸 후 내 화면에 그릴 때.
		socket.on('sendMsgOtherPeople', function (data) {
			/*
				userInfo : data.userInfo,
				textValue : data.textValue,
				date : talkMeg.date,
				isDouble : isDouble,
				idx : idx
				
				userInfo : {
		 			_myId: "숫자놀이"
					id: "1447481855106start"
					name: "myRoom2"
					nowRoom: "숫자놀이_0"
					profileMsg: "핑크는 핑크핑크해!!"
					profilePic: "person1.jpg"
					username: "숫자놀이"
		 		}
			*/
			console.log('sendMsgOtherPeople의 메시지를 받았당. data는', data);
			if(data.isNewRoom === true) {// 새로운 사람에게 메시지를 받았을 때.
				return _this.talkListAreaPage.newTalkList(data);
			} else if(typeof data === 'string') {// 상대방의 이유로 발송이 실패했을 때.
				g.viewGlobal.talkPage.obj.isNewRoomCreateComplete = false;
				L(g.viewGlobal.obj.loadingBar).removeClass('on');
				return g.viewGlobal.mainControl.alert(data);
			} else if(data.complete) { // 내가 새로 방을 만들어서 내게 완료했다고 알려줌.				
				g.viewGlobal.talkPage.obj.sendBtn._data = {
					room : data._data.userInfo.nowRoom
				};
				cg.userInfo.nowRoom = data._data.userInfo.nowRoom;
				_this.talkListAreaPage.newTalkList(data);
				g.viewGlobal.talkPage.obj.isNewRoomCreateComplete = false;
				return L(g.viewGlobal.obj.loadingBar).removeClass('on');
			};
			var gObj = g.viewGlobal.obj,
				doc = document,
				roomEle = doc.getElementById('room_' + data.userInfo.nowRoom),
				frag = doc.createDocumentFragment();
			
			_this.talkPage.paintOnceMsg(frag, data.isDouble, '', data.userInfo.profilePic, data.userInfo._myId, data.textValue, data.date);	
			
			// 새로운 글이 왔다는 것을 알려줘야 함. & 그리고 뿌려야 함.
			cg.talkListAreaPage.newMsgPaint(data);
			/*
			 var div = document.createElement('div');
			div.innerHTML = talkElement.temp;
			 */
			switch(cg.userInfo.nowRoom === null){
				case true : 
					return false;
				case false : 
					var obj = L(gObj.allTalkWrap).eq(L(roomEle).index());
					if(data.isDouble){
						obj.getElementsByClassName('talkListArea')[0].lastChild.getElementsByClassName('textTalkList')[0].appendChild(frag);
						obj.lastChild.srcollTop = 99999;
					} else {
						obj.getElementsByClassName('talkListArea')[0].appendChild(frag);
						obj.lastChild.srcollTop = 99999;
					};
			};
			
			
			// paintOnceMsg : function(obj, isDouble, isMe, picUrl, _myId, talkCnt, date){
			// return {obj : obj, temp : temp}
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
			
			g.viewGlobal.mainControl.alert('아이디와 비밀번호를 다시 확인해주세요.')
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
				_this.signUpSucc(signUpPage, data);
			});
			socket.on('signUp_email_fail', function (data) {
				console.log('회원가입 실패했당');
				_this.signUpFail(signUpPage, data);
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
		signUpSucc : function(signUpPage, data){
			var doc = document;
			console.log(signUpPage, data);
			L(signUpPage).removeClass('on');
			L(doc.getElementById('signInEmail_email')).value = data.email;
			L(doc.getElementById('signInEmail_password')).value = data.password;
			g.viewGlobal.mainControl.alert('회원가입이 완료되었습니다.\n 로그인을 해주세요!');
		},
		signUpFail : function(signUpPage, data){
			console.log(signUpPage)
			g.viewGlobal.mainControl.alert('회원가입에 실패하였습니다.\n 이미 존재하거나, 잘못된 정보입니다. 확인해주세요!');
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
						
			var friendElement = this.friendsTemp(data.profilePic, data._myId, data.profileMsg);
			_obj.myInfoArea.innerHTML = friendElement;
			cg.userInfo.username = data.username;
			cg.userInfo.profilePic = data.profilePic;
			cg.userInfo._myId = data._myId;
			cg.userInfo.profileMsg = data.profileMsg;			
		},
		paintMyFriends : function(data){			
			console.log('친구 목록을 그립니당.data는', data);
			var doc = document,
				frag = doc.createDocumentFragment();
			var friendOl = g.viewGlobal.obj.friendsArea.getElementsByClassName('friendsList')[0];
			//친구 목록 그리기.
			for(var i = 0, list = data.friendData, len = list.length, friendElement, li ; i < len ; i +=1){
				li = doc.createElement('li');
				li.className = 'friendList';
				friendElement = this.friendsTemp(list[i].profilePic, list[i]._myId, list[i].profileMsg);
				li.innerHTML = friendElement;
				li._data = list[i];
				frag.appendChild(li);				
			};
			friendOl.appendChild(frag);
		},
		// 친구 목록 템플릿.
		friendsTemp : function(picUrl, myId, profileMsg){
			if(picUrl === undefined) picUrl = 'default.jpg';
			profileMsg? true : profileMsg = '';
			var temp = 
				'<a href="#">' +
					'<div class="friendImg">' +
						'<img src="./uploads/userUploadPicture/' + picUrl +'">' +	
					'</div>' +
					'<div class="friendText">' +
						'<em class="name">' + myId + '</em>' +
						'<span class="statusMsg">' + profileMsg + '</span>' +
					'</div>' +
				'</a>';
			return temp;
		}
	},
	// 친구 목록 검색 
	friendSearch :{
		obj : {
			isInit : false
		},
		init : function(){
			this.obj.isInit = true;
			// 친구 검색했을 때
			socket.on('friendSearchResult', function(data){
				console.log('친구 검색을 완료했다!!',data)
				g.viewGlobal.mainControl.searchFriend.viewResult(data);
			});
			// 친구를 저장했을 때
			socket.on('saveSearchFriendResult', function(data){
				console.log('친구 검색을 완료했다!!',data)
				g.viewGlobal.mainControl.searchFriend.saveResult(data);
			});			
		},
		view : function(value){			
			if(this.obj.isInit === false) this.init();
			var searchValue = value + '';
			socket.emit('friendSearch', searchValue);
		}, 
		save : function(data){
			var myData = cg.userInfo;
			var _data = {
				data : data,
				myData : myData
			};
			socket.emit('saveSearchFriend', _data);
		}
	},
	// 대화 목록 페이지 정의
	talkListAreaPage : {
		obj : {
			talkListArea : null,
			talkArea : null,
			allTalkWrap : null,
			newMsgAlertPop : null,
			newMsgNumber : null
		},
		init : function(data){
			// 초기 객체 바인딩.
			var _this = this, 
				_obj = this.obj,
				doc = document,
				_g = g.viewGlobal.obj;
			for(var i in _obj){
				 _g[i] !== undefined ? _obj[i] = _g[i] : true;
			};
			
			_obj.newMsgAlertPop = doc.getElementById('newMsgAlertPop');
			_obj.newMsgNumber = doc.getElementById('newMsgNumber');			
			
			// 초기화 및 기존 대화 목록 초기화.
			var talkListOl = _obj.talkListArea.children[0];
			var frag = doc.createDocumentFragment(),
				talkFrag = doc.createDocumentFragment();
			var div = doc.createElement('div');
			talkListOl.innerHTML = '';
			
			for(var i = 0, list = data.talkMegData, len = list.length, content, ol, talkElement, roomList, _data ; i < len ; i +=1){
				_data = {
					roomname : list[i].roomname,
					users : list[i].users
				};
				content = list[i].Content;
				talkElement = this.talkListTemp(undefined, list[i].users, content[content.length-1].date, content[content.length-1].talkCnt, data.date);
				div.innerHTML = talkElement;
				div.lastChild._data = _data;
				div.lastChild.id = 'room_' + _data.roomname;
				frag.appendChild(div.lastChild);
				
				// 채팅 룸 초기화.
				roomList = cg.talkPage.talkRoomTemp();
				div.innerHTML = roomList;
				talkFrag.appendChild(div.firstChild);
			};
			talkListOl.appendChild(frag);
			_obj.allTalkWrap.appendChild(talkFrag);
		},
		// 채팅 목록 뿌리기.(새로운 룸이 생기거나 초대를 받을 때 처리)
		paintMyTalkList : function(data){
			var _this = this,
				_obj = this.obj,
				doc = document;
				
			var talkListOl = g.viewGlobal.obj.talkListArea.children[0];
			var frag = doc.createDocumentFragment();
			var div = doc.createElement('div');
						
			for(var i = 0, list = data.talkMegData, len = list.length, content, ol, talkElement, _data ; i < len ; i +=1){
				_data = {
					roomname : '',
					users : ''
				};
				content = list[i].Content;
				talkElement = this.talkListTemp(undefined, list[i].users, content[content.length-1].date, content[content.length-1].talkCnt, data.date);
				div.innerHTML = talkElement;
				_data.roomname = list[i].roomname;
				_data.users = list[i].users;
				div.lastChild._data = _data;
				div.lastChild.id = 'room_' + _data.roomname;
				frag.appendChild(div.lastChild);
				console.dir('채팅 목록 뿌리기 for문 돌림', frag);
			};
			talkListOl.appendChild(frag);
		},
		newTalkList : function(data, isMe){
			console.log('자 이제 새로운 걸 그려봅시다.', data);
			var _this = this,
				_obj = this.obj,
				doc = document,
				originData = data, 
				data = data.complete ? data._data : data;
				
			var talkListOl = g.viewGlobal.obj.talkListArea.children[0];
			var frag = doc.createDocumentFragment(),
				talkFrag = doc.createDocumentFragment(),
				div = doc.createElement('div'),
				_data = {
					roomname : data.userInfo.nowRoom,
					users : data.allUsers
				};
			
			div.innerHTML = this.talkListTemp(data.userInfo.profilePic, data.allUsers, data.date, data.textValue, data.date);
			div.lastChild._data = _data;
			div.lastChild.id = 'room_' + data.userInfo.nowRoom;
			frag.appendChild(div.lastChild);
			L(frag.lastChild.lastChild).on('click', function(e){
				e.preventDefault();
				g.viewGlobal.talkPage.view(e);
			});
			talkListOl.appendChild(frag);
			
			if(originData.complete !== true){				
				// 채팅 룸 초기화.
				var newTalkFrag = doc.createDocumentFragment();
				var talkMsg = cg.talkPage.paintOnceMsg(
					newTalkFrag, data.isDouble, '', 
					data.userInfo.profilePic, data.userInfo._myId, data.textValue, data.date
				);					
				div.innerHTML = cg.talkPage.talkRoomTemp(newTalkFrag.lastChild);
				talkFrag.appendChild(div.firstChild);
				_obj.allTalkWrap.appendChild(talkFrag);
			};			
			return L(g.viewGlobal.obj.loadingBar).removeClass('on');
		},
		// 채팅 목록 템플릿.
		talkListTemp : function(picUrl, myId, date, lastMsg, nowDate){
			if(picUrl === undefined) picUrl = 'default.jpg';
			var users = '',
				time, timeFrag;
			for(var i = 0, len = myId.length ; i < len ; i +=1){
				users += myId[i] + ', ' 
			};
			users = users.slice(0, -2);
			
			if(nowDate.date !== date.date){
				time = (Number(date.month) + 1) + '월 ' + date.date + '일'; 
			} else if(date.hours > 11){
				timeFrag = (date.hours === 12 ? 12 : date.hours - 12) + ':' + date.minutes;
				time = '오후 ' + timeFrag;
			} else {				
				timeFrag = (date.hours === 12 ? 12 : date.hours - 12) + ':' + date.minutes;
				time = '오전 ' + timeFrag;				
			};
			
			var temp = 
				 '<li class="friendList">' +
					'<a href="#" class="area_talkListLink">' +
						'<div class="friendImg">' +
							'<img src="../uploads/userUploadPicture/' + picUrl + '">' +
						'</div>' +
						'<div class="friendText">' +
							'<em class="names">' + myId + '</em>' +
							'<span class="lastMsgDate">' + time + '</span>' +
							'<span class="talkMsg">' + lastMsg + '</span>' +
						'</div>' +
					'</a>' +
				'</li>'; 
				
			return temp;
		},
		newMsgPaint : function(data){
			var _this = this,
				_obj = this.obj,
				doc = document;
			
			var _roomId = 'room_' + data.userInfo.nowRoom,
				roomEle = doc.getElementById(_roomId),
				date = data.date,
				time, timeFrag;
			
			switch(date.hours > 11){
				case true : 
					timeFrag = (date.hours === 12 ? 12 : date.hours - 12) + ':' + date.minutes;
					time = '오후 ' + timeFrag;
				case false : 
					timeFrag = (date.hours === 12 ? 12 : date.hours - 12) + ':' + date.minutes;
					time = '오전 ' + timeFrag;	
			};
							
			roomEle.getElementsByClassName('lastMsgDate')[0].innerHTML = time;
			roomEle.getElementsByClassName('talkMsg')[0].innerHTML = data.textValue;
			
			return _this.newMsgAlert(data);
		},
		newMsgAlert : function(data){
			var _this = this,
				_obj = this.obj,
				doc = document;
			
			var ele = _obj.newMsgAlertPop,
				timeFunc = null,
				newValue;
			//ele.getElementsByClassName('msgValue')[0].innerHTML = data.text
			clearTimeout(timeFunc)
			L(ele).addClass('on');
			newValue = _obj.newMsgNumber.innerHTML === '' ? 0 : _obj.newMsgNumber.innerHTML;
			_obj.newMsgNumber.innerHTML = newValue + 1;
						
			timeFunc = setTimeout(function(){
				L(ele).removeClass('on');	
			}, 5000);
		}
	},
	// 채팅방에서 함수 정의.
	talkPage : {
		obj : {
			isInit : false,
			myInfoArea : null,
			talkArea : null,
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
			var myObj = cg.userInfo;
			socket.on('talkRoomContentSearchData', function(data){
				console.log("나 채팅방 db조회 후에 가져왔다!!", data)
				_this.paintTalkRoom(data, myObj);
			});
			
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
				roomname : obj._data.roomname,
				username : cg.userInfo.username
			};
				
			socket.emit('talkRoomContentSearch', data);
			console.log("서버로 채팅방 컨텐츠를 검색하도록 실행합니다.")
		},
		// 채팅방 목록 그리기
		paintTalkRoom : function(data, myObj){				
			// 초기화 및 기존 채팅룸 초기화.
			var _this = this, 
				_obj = this.obj,
				doc = document,
				talkRoomOl,
				frag = doc.createDocumentFragment(),
				div = doc.createElement('div');
			var userInfoArray = [],
				myInd = 0,
				initRoomObj;
			if(typeof data.clickInd === 'number'){ // 기존의 것을 클릭했을 때
				talkRoomOl = L(_obj.allTalkWrap).eq(data.clickInd);
				initRoomObj = talkRoomOl.getElementsByClassName('talkListArea')[0];
				initRoomObj.innerHTML = "";
			} else { // 새로운 것이 생성될 때
				div.innerHTML = this.talkRoomTemp();
				_obj.allTalkWrap.appendChild(div.firstChild);
				talkRoomOl = _obj.allTalkWrap.lastChild;
				initRoomObj = talkRoomOl.getElementsByClassName('talkListArea')[0];
			};
			//L(talkRoomOl).addClass('on');
					
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
			for(var i = 0, list = data.content[0].Content, len = list.length, idx = -1, content, isMe, isDouble, talkElement ; i < len ; i +=1){
				content = list[i];
				idx === content.idx ? isDouble = true : isDouble = false;
				idx = content.idx;
				isMe = '';
				if(isDouble === true && myInd === idx){ // 내가 연속적으로 쓸 때, 같은 사람이면서 내가 쓴 것일 경우.
					this.paintOnceMsg(frag, isDouble, isMe, userInfoArray[idx].profilePic, userInfoArray[idx]._myId, list[i].talkCnt, list[i].date);
				} else if(isDouble === true && myInd !== idx) { // 다른 사람이 혼자 연속으로 쓸 때. 같은 사람이면서 내가 쓴 것이 아닌 경우
					this.paintOnceMsg(frag, isDouble, isMe, userInfoArray[idx].profilePic, userInfoArray[idx]._myId, list[i].talkCnt, list[i].date);
				} else if(isDouble === false && myInd === idx) { // 내가 새롭게 말을 할 때. 새로운 사람이면서 내가 쓴 것일 경우
					isMe = " me";
					this.paintOnceMsg(frag, isDouble, isMe, userInfoArray[idx].profilePic, userInfoArray[idx]._myId, list[i].talkCnt, list[i].date);
				} else if(isDouble === false && myInd !== idx) { // 다른 사람이 새롭게 말을 할 때. 새로운 사람이면서 내가 쓴 것이 아닌 경우.
					this.paintOnceMsg(frag, isDouble, isMe, userInfoArray[idx].profilePic, userInfoArray[idx]._myId, list[i].talkCnt, list[i].date);
				};
				
				/*
					paintMyMsg 등을 내가 talkElement에 저장해서 frag에 뿌리는데 
					기존에는 바로 처리하도록 되어 있음.
					
					하지만 하나씩 그리는 건 지금이 맞고, 
					한 번에 많이 그리도록 해야 하므로 수정이 필요함.
				*/				
			};
			initRoomObj.appendChild(frag);			
			L(initRoomObj).parentClassSearch('scrollArea').scrollTop = 99999;
		},
		// 채팅방 템플릿
		talkRoomTemp : function(printOnce){						
			var temp = 
				 '<li class="allTalkList">' +
					'<div class="scrollArea">' +
						'<ol class="talkListArea">' +
							// 나 또는 상대의 메시지가 들어가는 영역.
							(printOnce ? printOnce.innerHTML : '') +
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
									'<button type=button name="emoticon" class="emoticonBtn" title="이모티콘 사용하기">@</button>' +
									'<button type=submit name="sendBtn" class="sendBtn" title="보내기">전송</button>' +
								'</div>' +
							'</fieldset>' +
						'</form>' +
					'</aside>' +
				'</li>';
				
			return temp;
		},
		sendMsg : function(formObj, createInfo){
			if(this.obj.isInit === false){
				this.obj.isInit = true;
				this.init();
			};
			// obj 할당.
			var _cg = cg,
				fpObj = _cg.friendsPage.obj,
				_obj = this.obj,			
				_id = _cg.userInfo.name,// + e.srcElement.name;
				sendText = formObj.elements.textInput.value;
			var data = {
				userInfo : _cg.userInfo,
				textValue : sendText,
				createInfo : null,
				isMe : null
			};
			if(createInfo){
				data.createInfo = [createInfo];
			};
			// 서버로 전송.
			console.log('sendMsg', data)
			socket.emit('sendMsg', data);	
			
			// 서버에 넘긴 후 client는 사용자에게 바로 띄워줌.
			var allTalkList = _obj.allTalkWrap.getElementsByClassName('allTalkList on')[0],
				lastTalkList = allTalkList.getElementsByClassName('talkListArea')[0],
				isMe;
				
				if(lastTalkList.lastChild && L(lastTalkList.lastChild).hasClass('me')){
					isMe = ' me'
				} else if(createInfo){
					data.isMe = ' me'
				} else {
					isMe = '';
				};
			
			this.paintMyMsg(lastTalkList, isMe, sendText, data);
		},
		paintOnceMsg : function(obj, isDouble, isMe, picUrl, _myId, talkCnt, date){
			var div = document.createElement('div');
			var temp;			
			if(isDouble){
				// 연속적으로 대화를 뿌릴 때 사용.(init에서)
				temp =
				'<li class="talkText">' +
					'<span class="msg">' + talkCnt + '</span>' +
				'</li>';
				div.innerHTML = temp;
				if(obj.lastChild){
					obj.lastChild.querySelector('ol').appendChild(div.lastChild);
				} else {
					obj.appendChild(div.lastChild);
				};				
				return obj
				//obj.parentNode.scrollTop = 99999;			
			} else {
				// 그 외의 시나리오.
				var myTalk = '';
				if(isMe !== ' me'){
					myTalk = 						
						'<div class="talkFriendImg">' +
							'<img src="../uploads/userUploadPicture/' + picUrl + '" alt ="사용자 프로필 사진">' +
						'</div>' +						
						'<div class="talkTextArea">' +
							'<em class="name">' + _myId + '</em>';
				} else {
					myTalk = 								
						'<div class="talkTextArea">';
				}
				temp = 
				'<li class="talkList' + isMe + '">' +
					myTalk +
						'<ol class="textTalkList">' +
							'<li class="talkText">' +
								'<span class="msg">' + talkCnt + '</span>' +
							'</li>' +
						'</ol>' +					
					'</div>' + 
				'</li>';					
				//obj.parentNode.scrollTop = 99999;
				div.innerHTML = temp;
				obj.appendChild(div.lastChild)
				return obj
			};
		},
		paintMyMsg : function(obj, isMe, talkCnt, data){	
			if(isMe){
				// 내가 쓴 글이 마지막일 경우
				L(obj.lastChild.querySelector('ol')).append(
					'<li class="talkText">' +
						'<span class="msg">' + talkCnt + '</span>' +
					'</li>'
				);
				//obj.parentNode.scrollTop = 99999;
			} else {				
				if(data.isMe){isMe = data.isMe;}
				var myTalk = '';
				if(isMe !== ' me'){
					myTalk = 						
						'<div class="talkFriendImg">' +
							'<img src="../uploads/userUploadPicture/' + data.userInfo.profilePic + '" alt ="사용자 프로필 사진">' +
						'</div>' + 						
						'<div class="talkTextArea">' +
							'<em class="name">' + data.userInfo._myId + '</em>';
				} else {					
					myTalk =
						'<div class="talkTextArea">';
				}
				// 상대가 쓴 글이 마지막일 경우
				L(obj).append(
					'<li class="talkList' + isMe + '">' +
						myTalk +
							'<ol class="textTalkList">' +
								'<li class="talkText">' +
									'<span class="msg">' + talkCnt + '</span>' +
								'</li>' +
							'</ol>' +					
						'</div>' + 
					'</li>'
				);			
				
				//obj.parentNode.scrollTop = 99999;
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
	
	
	
	
	

