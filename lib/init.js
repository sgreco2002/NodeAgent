//this setup the main js module
var JDBC = require('jdbc');
var javaVm = require('jdbc/lib/jinst'); 
var dbSpec = require ("../config/db.json"); //read and get json properties file
var dbConn = null;
var myexport = module.exports = {}; //make fuction avaiable to external files

console.log('start init...');

javaVm.addOption("-Xrs");
javaVm.setupClasspath(['./drivers/derby.jar','./drivers/derbyclient.jar','./drivers/derbytools.jar']);

//export public variable
myexport.isConnected = false;
myexport.DbHandler = null;

//this return a connection object
//-----------------------------------------
myexport.InitDerby = function  () { 

	//create JDBC connection object
	var l_Handler = new JDBC({
		url: 'jdbc:derby://' + dbSpec.host + ':' + dbSpec.port + '/' + dbSpec.dbpath + ';user=cat;password=cat',
		drivername: 'org.apache.derby.jdbc.ClientDriver',
		user : dbSpec.username,
		password : dbSpec.password,
		minpoolsize: dbSpec.minpool,
		maxpoolsize: dbSpec.maxpool
	});

	l_Handler.initialize(function(err) {
		if (err) {console.log("init error : " + err);}
	});
	
	return l_Handler;
}
//-----------------------------------------

//this return connection object to DB
//-----------------------------------------
myexport.Conn2Derby = function () {
	
	var l_dbConn = null;
	var l_ErrConn = null;
	
	DbHandler = myexport.InitDerby(); // assign object returned by function
	
	DbHandler.reserve(function (err, connObj) {
		if (connObj) {
			console.log("using connection :" + connObj.uuid);
			l_dbConn = connObj.conn;
			myexport.isConnected = true;
		}
		else {
			l_ErrConn = "error connection :" + err.message;
		}
	});
	
	if (myexport.isConnected == true) {	return l_dbConn; }
	else {return l_ErrConn;};
}
//-----------------------------------------

myexport.ReleasePool = function (handler, conn) {
	
	var l_handler = handler;
	var l_conn = conn;
	
	l_handler.release(l_conn, function(){});
	
}