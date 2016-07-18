//this call required libraries
//-----------------------------------------
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var express = require('express');
var command ;
var output;
var myexport = module.exports; //make fuction avaiable to external files

myexport.cli = function (req, res) {
	command = (req.get('body'));
	if ( /rm|vi|more/g.test(command)) {res.end(command + ' is not allowed');} 
	else { 
 		exec(command, function(err, sto, ste) {
			console.log('stdout: ' + sto);
			console.log('sterr: ' + ste);
			if (command == null || command == "") {res.end("command request cannot be null");}
			if (err !== null) {
				res.end(err.toString()); 
			}
			else {
				if (sto !== "") {
					res.end(JSON.stringify(sto));
					//res.end(sto.toString( ));
				}
				else {res.end("command done.");}
			}
		});
	}
}

