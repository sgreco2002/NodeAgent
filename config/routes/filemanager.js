//this call required libraries
//-----------------------------------------
var multer = require('multer');
var shell = require('../lib/shellcli.js');
var myexport = module.exports = {}; //make fuction avaiable to external files
// multer object set
var storage = multer.diskStorage({	
	destination: './uploads',
	filename: function(req,file,callback){
		callback(null, file.originalname)
	}
});
//-----------------------------------------
myexport.getFileSize = function(req, res) {
	shell.execute(req.get("body"));
	
}


myexport.upload = function(req,res) {
	var upload = multer({storage: storage}).single('lcl_upload');
	console.log(req.body);
	upload(req, res, function(err){
		if (err) {
			console.log(err.code);
			res.statusCode = 501;
			res.end("error while upload file: " + err );
			}
		else {
			res.end("file successfully uploaded!");
		}
	});
}

//----------------------------
function err_handler(res, err_code, err_message, err_detail){
	res.statusCode = err_code;
	res.end("KO" + err_message + err_detail);
}