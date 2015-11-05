'use strict';
var bb = Backbone,
	Model = bb.Model,
	Collection = bb.Collection,
	View = bb.View;

var User = Model.extend({
	initialize : function(){
		console.log('초기화 또는 생성!');
	},
	validate : function(opt){
		console.log('validate 실행!', opt)
	}
});
var user = new User({
	name : '홍길동'
})

// view
var Welcome = View.extend({
	el : '.nameTest',
	initialize : function(){
		this.model.on( 'change', this.render, this );
		
		this.render();
	},
	render : function(){
		var name = this.model.get('name');
		this.$el.html('welcome' + name);
		return this;
	},
	tagName : 'span',
	className : 'myClass',
	id : 'myId'
});

var welcome = new Welcome({
	model : user
})
	