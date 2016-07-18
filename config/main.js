	/* node restful api main */
//----------------------------------------
var express = require('express');
var fs = require('fs');
var myapp = express();
var dbinterface = require('./routes/dbinterface');
var shellcli = require('./routes/shellcli');
var filemanager = require('./routes/filemanager');

//cors
myapp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, body");
  next();
});

// DB Apis - Server
myapp.get("/getAllServers", dbinterface.getAllServers);
myapp.get("/getServerDetail", dbinterface.getServerDetail);
myapp.post("/updateServer", dbinterface.updateServer);
myapp.post("/deleteServer", dbinterface.deleteServer);
myapp.post("/createServer", dbinterface.createServer);

// DB Apis - Repository
myapp.get("/getAllRepos", dbinterface.getAllRepos);
myapp.post("/updateRepos", dbinterface.updateRepos);
myapp.post("/deleteRepos", dbinterface.deleteRepos);
myapp.post("/createRepos", dbinterface.createRepos);

// DB Apis - Deploy
//myapp.get("/getAllDeploy", dbinterface.getDep);
//myapp.get("/getDeployDetail", dbinterface.getDepDet);
//myapp.post("/createDeploy", dbinterface.createDep);
//myapp.post("/updateDeploy", dbinterface.updateDep);
//myapp.post("/createDeployDetail", dbinterface.createDepDet);
//myapp.post("/updateDeployDetail", dbinterface.updateDepDet);

//FS APIs
//myapp.get("/getFileSize", filemanager.getFileSize);

//this start http daemon on server
//-----------------------------------------
var server = myapp.listen(9999, function () {
								var host = "10.135.235.16";
								var port = server.address().port;
								console.log("App start listen at address http://%s:%s.", host, port);
							}
	);
//-----------------------------------------
