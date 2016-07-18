//this call required libraries
//-----------------------------------------
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var express = require('express');
var command ;
var output;
var myexport = module.exports; //make fuction avaiable to external files

myexport.execute = function (cmd) {
	command = cmd;
	if ( /rm|vi|more/g.test(command)) {err_handler(res, 501, ":Error on execute command", ":command not allowed");} 
	else { 
 		exec(command, function(err, sto, ste) {
			console.log('stdout: ' + sto);
			console.log('sterr: ' + ste);
			if (command == null || command == "") {err_handler(res, 501, ":Error on execute command", ":command cannot be null");}
			if (err !== null) {
				res.end(err.toString()); 
			}
			else {
				if (sto !== "") {return JSON.stringify(sto);}
			}
		});
	}
}
//-----------------------------------------
function err_handler(res, err_code, err_message, err_detail){
	res.statusCode = err_code;
	res.end("KO" + err_message + err_detail);
}

