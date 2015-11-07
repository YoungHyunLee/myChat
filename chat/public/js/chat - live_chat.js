

var socket = io.connect('http://yhbabo.herokuapp.com/');

$('#text .text_submit').on('click', function(){
	// 서버로 값을 넘김
	socket.emit('chat0', $('#text .text_content').val()); // 'wow'이건 인자가 아니라 메서드라서 from msg이런 경우라면 from이  {val:$('.va').val()}임. 	
	// 서버에 넘긴 후 사용자에게는 바로 띄워줌.
	$('#context').append('<p class="me"><span class="people">Customer:</span>'+ $('#text .text_content').val() +'</p>');
});

// 서버에서 온 텍스트 값을 처리.
socket.on('chat0_text', function (msg) {
	// dom에 뿌려줌.
  	$('#context').append('<p class="other"><span class="people">Customer:</span>'+ msg +'</p>');
}); 
  
socket.on('user disconnected', function (data) {
	console.log(data);
}); 