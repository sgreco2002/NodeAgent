var exec = require('child_process').exec,
execSync = require('child_process').execSync,
spawn = require('child_process').spawn,
fs = require('fs'),
multer = require('multer'),
path = require('path'),
supp = require('suppose'),
myExport= module.exports = {}, //make function available to external files
currentCmd = '',
wgetfileName = '',
fileName = '',
cmdPid = '',
commandPre = '',
cmdPost = '',
commandQueue = '',
commandSeq = '',
childs = ({'spawn' : '' }),
stdOut = '',
stdErr = '',
downloadNumber = 0,
downloadCounter = 0;

//multer object set----------------------------------------------------------------------------
var storage = multer.diskStorage({	
	destination: './uploads',
	fileName: function(req,file,callback){
		callback(null, file.originalname)
	}
});

//api fsmanager ----------------------------------------------------------------------------------------
myExport.fsMan = function (req, res) {
		// initialize local var
		var action = req.param('actionid'),
		commandSeq="",
		commandQueue="",
		bigstring =  req.get("body"),
		values = bigstring.split("#");
		
//start switch case---------------------------------------------------------------------------------------------
		switch (action) {
			case "getRemotePackage/":
			/*add nagios as sudoers! 
			 * Allow root to run any commands anywhere
			 * root    ALL=(ALL)       ALL
			 * nagios ALL=(ALL) NOPASSWD: ALL
			*/
				var wgetParam = ({
					"destDir" : values[0],
					"httpUser" : values[1],
					"httpPassword" : values[2],
					"httpRepos" : values[3],
					"httpUrl" : values[4],
					
				});
				
				commandPre="sudo vpnc avs_tunnel.conf --local-port 0";
				commandQueue = ({
						"cmds":	[
						       	 {
						       		 "command" : "wget",
						       		 "param1" : "--directory-prefix=" + wgetParam.destDir + "\/archives\/",
						       		 "param2" : "--progress=bar\:force",
						       		 "param3" : "--read-timeout=10",
						       		 "param4" : "--auth-no-challenge",
						       		 "param5" : "--http-user=" + wgetParam.httpUser,
						       		 "param6" : "--http-password=" + wgetParam.httpPassword,
						       		 "param7" : wgetParam.httpRepos + "/" + wgetParam.httpUrl
						       		 
						       	 }
						]
				});

				cmdPost="sudo killall vpnc";
				break; 
//--------------------------------------------------------------------------------
			case "getFileSize":
				commandSeq = ({
					"cmds":	[
					       	 {
					       		'command' : 'ls -lrt ' + req.get("body") + " | awk  '{print $5}'",
						        "reOutput" : "Y"
						     }
					]
				});
				break;
//--------------------------------------------------------------------------------
			case "copyFile":		
				srcFilePath=values[0], 
				dstFilePath=values[1],
				grants=values[2],
				commandSeq = ({
					"cmds":	[
					       	 {
					       		'command' : 'cp ' + srcFilePath + " " + dstFilePath,
						        "reOutput" : "N"
						     },
					       	 {
						       	'command' : 'chmod ' + grants + " " + dstFilePath,
							    "reOutput" : "N"
							 },
					       	 {
						    	 "command" : 'cksum ' + srcFilePath + " " + dstFilePath + " | awk '{print $1 , \"#\"}'" ,
							     "reOutput" : "Y"
							 }
					]
				});
				break;
//--------------------------------------------------------------------------------		
			case "getCksumFiles":
				srcFilePath=values[0], 
				dstFilePath=values[1],
				commandSeq = ({
					"cmds":	[
					       	 {
					       		"command" : 'cksum ' + srcFilePath + " " + dstFilePath + " | awk '{print $1 , \"#\"}'" ,
						        "reOutput" : "Y"
						     }
					]
				});
				break;
//--------------------------------------------------------------------------------			
			case "getArchiveContent":				
				pkgName=values[0], 
				rtp=values[1],
				unzipPath = pkgName.substring(0, pkgName.length - 4 );
 
				commandSeq = ({
					"cmds":	[
					       	 {
					       		 "command" : 'unzip -o -d ' + rtp + "\/artifacts\/" + unzipPath + ' ' + rtp + "archives\/" + pkgName,
					       		 "reOutput" : "N"
					       	 },
					       	 {
					       		"command" : 'find ' + rtp + "artifacts\/" + unzipPath + ' -name "*.zip" ' + ' -exec unzip -o -d ' + rtp + "\/artifacts\/" + unzipPath + ' {} \\;',
					       		 "reOutput" : "N"
					       	 },
					       	 {
					       		"command" : "find " + rtp + "artifacts\/" + unzipPath + " -type f | awk '{print $1, \"#\"}'",
						        "reOutput" : "Y"
						     }
					]
				});
				
			break;
//--------------------------------------------------------------------------------		
			case "sftpFile":
				//sftp jboss@10.135.235.13:/home/jboss/ <<< $'put main.js
				
				/*
				remHost=value[0],
				remUsrName=value[1],
				remPasswd=[2],
				remPath=[3];*/
				sftpParam="jboss@ip:/home/jboss <<< \$'put main.js'";
				console.log(sftpParam);
				
				supp("sftp" [sftpParam])
				supp.when('/\*password\*/').respond('passwd')
				supp.on('error', function(err){
					console.log(err.message);
				})
				.end(function (code){
					console.log(code);
				});
				
				console.log(supp);
				
			break;
//--------------------------------------------------------------------------------	
			default:
			err_handler(res, 501, ":Error on execute command:", ":parameter not valid");
			break;
//--------------------------------------------------------------------------------
		}
//end switch case---------------------------------------------------------------------------------------------	
		var sync = "";
//commands in sequence--------------------------------------------------------------------------------		
		if (commandSeq) {			
			for (icmds = 0; icmds < commandSeq.cmds.length ; icmds ++){ 
				if (/rm|vi|mv|more/g.test(commandPre)) {err_handler(res, 501, ":Error on execute command:", ":command not allowed");}
				try {
					sync = execSync(commandSeq.cmds[icmds].command).toString();
				}
				catch (err){
					err_handler(res, 501, ":Error on execute command:", err);
				}
				if (commandSeq.cmds[icmds].reOutput == "Y") {
					if (sync) {
						res.end("OK#" + sync);
					} else {
						res.end("OK# No Data found");
					}
				}
			}
		}
		
//commands in queue--------------------------------------------------------------------------------				
		if (commandQueue) {

			if (commandPre){
				if (/rm|vi|mv|more/g.test(commandPre)) {err_handler(res, 501, ":Error on execute command:", ":command not allowed");}
				try {
					sync = execSync(commandSeq.cmds[icmds].command).toString();
				}
				catch (err){
					err_handler(res, 501, ":Error on execute command:", err);
				}
			}
			
//start loop command queue------------------------------------------------------------------------------------------------
			for (icmd = 0 ; icmd < commandQueue.cmds.length; icmd ++){
			
				if (/rm|vi|mv|more/g.test(commandQueue.cmds[icmd].command)) {err_handler(res, 501, ":Error on execute command:", ":command not allowed");}
				downloadCounter++;
				child = spawn(commandQueue.cmds[icmd].command,[
						commandQueue.cmds[icmd].param1,
						commandQueue.cmds[icmd].param2,
						commandQueue.cmds[icmd].param3,
						commandQueue.cmds[icmd].param4,
						commandQueue.cmds[icmd].param5,
						commandQueue.cmds[icmd].param6,
						commandQueue.cmds[icmd].param7
						],
						{
							env: process.env,
							encoding: 'utf-8',
						}
					);
				
				childs[downloadCounter] = child;
				currentCmd = commandQueue.cmds[icmd].command;
				cmdPid = childs[downloadCounter].pid;
				wgetfileName = path.basename(commandQueue.cmds[icmd].param7);
							
//prepare streaming data------------------------------------------------------------------------------------------------
				childs[downloadCounter].stdout.on('data', function(buf) {
					console.log(String(buf));
					if (/error|failed|missing|cannot|404/i.test(String(buf))) {
						childs[downloadCounter].stdout = String(buf);
						err_handler(res, 501, ":Error on execute command:", String(buf));
					}
					else {
						var n = String(buf).search(/[0-9]/i);
						if (/%/g.test(String(buf))) {
							childs[downloadCounter].stdout=String(buf).substring(n,4);
						}
					}
				});
				childs[downloadCounter].stderr.on('data', function(buf) {
					console.log(String(buf));
					if (/error|failed|missing|cannot|404/i.test(String(buf))) {
						childs[downloadCounter].stdout=String(buf);
						err_handler(res, 501, ":Error on execute command:", String(buf));
					}
					else {
						var n = String(buf).search(/[0-9]/i);
						if (/%/g.test(String(buf))) {
							childs[downloadCounter].stdout=String(buf).substring(n,4);
						}
					}
					console.log(childs[downloadCounter].pid + " > " + childs[downloadCounter].stdout);
					stdOut = childs[downloadCounter].stdout;
				});
				childs[downloadCounter].on('close', function (code) {
					if (cmdPost){
						if (/rm|vi|mv|more/g.test(cmdPost)) {err_handler(res, 501, ":Error on execute command:", ":command not allowed");}
						if (downloadCounter == downloadNumber) {
							sync="";
							try {
								sync = execSync(cmdPost).toString();
								}
							catch (err){
								err_handler(res, 501, ":Error on execute command:", err);
							}
						}
					}
				if (childs[downloadCounter].code > 0 ){err_handler(res, 501, ":Error on execute command:" + stdErr);}	
				});
			}
			res.end("OK - Command queue spawned.")
		}
//end loop-------------------------------------------------------------------------------------		
}
//api stream stdout---------------------------------------------------------------------------------
myExport.readstream = function(req, res) {
		
	res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
    res.write("retry: 10000\n");
    res.write("event: connecttime\n");
    res.write("data: stream on.\n\n");
    
    interval = setInterval(function() {
    	switch(true) {
    		case /error|failed|missing|404/i.test(stdOut):
    			res.write("event: " + currentCmd + downloadCounter + "\ndata: PID " + cmdPid + ": " + wgetfileName + " - *** KO\n\n");
    		break;
	    	case /100/g.test(stdOut):
	    		res.write("event: " + currentCmd + downloadCounter + "\ndata: PID " + cmdPid + ": " + wgetfileName + " - *** OK\n\n");
	    	break;
	    	default:	    			
	    		res.write("event: " + currentCmd + downloadCounter + "\ndata: PID " + cmdPid + ": " + wgetfileName + " - " + stdOut + "\n\n");
	    	break;
    	}
    },1000);
    
    req.connection.addListener("close", function () {
        clearInterval(interval);
      }, false);  
}

//upload file ---------------------------------------------------------------------------------
myExport.upload = function(req,res) {
	var upload = multer({storage: storage}).single('lcl_upload');
	console.log(req.body);
	upload(req, res, function(err){
		if (err) {
			err_handler(res, 501, ":Error on upload file:", err);
			}
		else {
			res.end("OK");
		}
	});
}

//error handler-------------------------------------------------------------------------------
function err_handler(res, err_code, err_message, err_detail){
	res.statusCode = err_code;
	res.end("KO" + err_message + err_detail);
};
