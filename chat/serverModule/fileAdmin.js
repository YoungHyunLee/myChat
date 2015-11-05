(function(){
'use strict';
var fs = require('fs')
  ,	multer = require('multer')
  , upload = multer({ dest : './uploads/'});
  
// 파일 업로드
exports.uploadFile = function(req, res, next){	
	fs.readFile(req.file.path, function(error,data){
        var destination = __dirname + '\\..\\uploads\\'+ req.file.originalname;
        fs.writeFile(destination,data,function(error){
            if(error){
                console.log(error);
                throw error;
            }else{
                res.redirect('back');
            }
        });
    });
};
// 파일 다운로드 
exports.downloadFile = function(req, res, next){
	// multer를 사용했으므로 upload.single('inputName값')에 의해서 req.file로 넘긴 정보를 검색할 수 있음.  	
    var destination = __dirname + '\\..\\uploads\\'+ req.file.originalname;
    var ws =  fs.createWriteStream(destination);
    fs.createReadStream(req.file.path).pipe(ws);
    res.redirect('back');
};

})();