//this call required libraries
//------------------------------------------------------------------------------
var init = require('../lib/init.js');
var querystore = require('../lib/querystore.js');
var util = require ('util');
var myexport = module.exports = {}; //make fuction avaiable to external files
var http_dbconn = init.Conn2Derby();
//------------------------------------------------------------------------------
myexport.updateServer = function (req, res) {
	var valuebig = req.get("body"),
	valuearray = valuebig.split("#"),
	l_sql = util.format(querystore.updateserver, valuearray[0], valuearray[1], valuearray[2], valuearray[3], valuearray[4], valuearray[5], valuearray[6],valuearray[7]);
	securecheck(querystore.updaterepos, res);
	// on error return error string
	if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
	http_dbconn.createStatement (function (err, statement) {
		if (err) {err_handler(res, 501, "Error on create statement", err.message);}
		else {
			statement.executeUpdate(l_sql, function (err, resultset) {
				if (err) {
					if (/duplicate key/g.test(err.message)) {err_handler(res, 501, ":Error on execute Statement:", "Server with ip already exists ")}
					else {
						if (resultset > 0) {res.end("OK");}
						else {err_handler(res, 501, "Error on update server", "No record found")};
						}
					}
				});		
			}
		});
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//------------------------------------------------------------------------------
myexport.getAllServers = function (req, res) {
	var l_sql = querystore.getallservers;
	// on error return error string
	securecheck(querystore.updaterepos, res);
	if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
	http_dbconn.createStatement (function (err, statement) {
		if (err) {err_handler(res, 501, ":Error on create statement:", err.message);}
		else {
			statement.executeQuery(l_sql, function (err, resultset) {
				if (err) {err_handler(res, 501, ":Error on query execution:", err.message);}
				else {
					resultset.toObjArray ( function (err, result) {
						if (err) {err_handler(res, 501, ":Error on fetching results:", err.message);}
						else {
							if (result.length == 0) {err_handler(res, 501, ":No data found:", err.message);}
							else {res.end(JSON.stringify(result));}
						}
					});
				}
			});
		}
	});	
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//------------------------------------------------------------------------------
myexport.getServerDetail = function (req, res) {
	var srv_id = req.get("body"),
	l_sql = util.format(querystore.selectsingleserver,srv_id);
	securecheck(querystore.updaterepos, res);
	// on error return error string
	if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
	http_dbconn.createStatement (function (err, statement) {
		if (err) {err_handler(res, 501, ":Error on create statement:", err.message);}
		else {
			statement.executeQuery(l_sql, function (err, resultset) {
				if (err) {err_handler(res, 501, ":Error on query execution:", err.message);}
				else {
					resultset.toObjArray ( function (err, result) {
						if (err) {err_handler(res, 501, ":Error on fetching results:", err.message);}
						else {
							if (result.length == 0) {err_handler(res, 501, ":Error on fetching results:", "No Server Found");}
							res.end(JSON.stringify(result));
						}
					});
				}
			});
		}
	});	
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//------------------------------------------------------------------------------
myexport.deleteServer = function (req, res) {
	var srv_id = req.get("body"),
	l_sql = util.format(querystore.deleteserver,srv_id);
	securecheck(querystore.updaterepos, res);
	// on error return error string
	if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
	http_dbconn.createStatement (function (err, statement) {
		if (err) {err_handler(res, 501, ":Error on create statement:", err.message);}
		else {
			statement.executeUpdate(l_sql, function (err, resultset) {
				if (err) {err_handler(res, 501, ":Error on query execution:", err.message);}
				else {
					if (resultset == 0) {err_handler(res, 501, ":Error on fetching results:", "No Server Found");}
					else{res.end("OK");}
				}
			});	
		}
	});	
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//------------------------------------------------------------------------------
myexport.createServer = function (req, res) {
	var valuebig = req.get("body"),
	valuearray = valuebig.split("#"),
	l_sql = util.format(querystore.insertserver, valuearray[0], valuearray[1], valuearray[2], valuearray[3], valuearray[4], valuearray[5], valuearray[6]);
	securecheck(querystore.updaterepos, res);
	// on error return error string
	if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
	http_dbconn.createStatement (function (err, statement) {
		if (err) {err_handler(res, 501, "Error on create statement", err.message);}
		else {
			statement.executeUpdate(l_sql, function (err, resultset) {
				if (err) {
					if (/duplicate key/g.test(err.message)) {err_handler(res, 501, ":Error on execute Statement:", "Server with specified ip already exists ")}
					}	
					else {res.end("OK");}
				});		
		}
	});
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//-----------------------------------------
myexport.getAllRepos = function (req, res) {
	var l_sql = querystore.getallrepo;
	securecheck(querystore.updaterepos, res);
	// on error return error string
	if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
	http_dbconn.createStatement (function (err, statement) {
		if (err) {err_handler(res, 501, ":Error on create statement:", err.message);}
		else {
			statement.executeQuery(l_sql, function (err, resultset) {
				if (err) {err_handler(res, 501, ":Error on query execution:", err.message);}
				else {
					resultset.toObjArray ( function (err, result) {
						if (err) {err_handler(res, 501, ":Error on fetching results:", err.message);}
						else {
							if (result.length == 0) {err_handler(res, 501, ":Error on fetching results:", "No Repository Found");}
							res.end(JSON.stringify(result));
						}
					});
				}
			});
		}
	});	
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//-----------------------------------------
myexport.updateRepos = function (req, res) {
	var valuebig = req.get("body"),
	valuearray = valuebig.split("#"),
	l_sql = util.format(querystore.updaterepos, valuearray[0], valuearray[1], valuearray[2], valuearray[3], valuearray[4]);
	securecheck(querystore.updaterepos, res);
	// on error return error string
	if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
	http_dbconn.createStatement (function (err, statement) {
		if (err) {err_handler(res, 501, "Error on create statement", err.message);}
		else {
			statement.executeUpdate(l_sql, function (err, resultset) {
				if (err) {
					if (/duplicate key/g.test(err.message)) {err_handler(res, 501, ":Error on execute Statement", ":Repository with specified url\\name already exists")}
					else {err_handler(res, 501, ":Error on update Repository:", err.message);}
					}
					else {
						if (resultset > 0) {res.end("OK");}
						else {err_handler(res, 501, ":Error on update Repository:", ":No Repository found");}
					}
			});		
		}
	});
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//-----------------------------------------
myexport.deleteRepos = function (req, res) {
		var rep_id = req.get("body"),
		l_sql = util.format(querystore.deleteRepos, rep_id);
		securecheck(querystore.updaterepos, res);
		// on error return error string
		if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
		http_dbconn.createStatement (function (err, statement) {
			if (err) {err_handler(res, 501, "Error on create statement", err.message);}
			else {
				statement.executeUpdate(l_sql, function (err, resultset) {
					if (err) {
						if (/duplicate key/g.test(err.message)) {err_handler(res, 501, ":Error on execute Statement", ":Repository with specified url\\name already exists")}
						else {err_handler(res, 501, ":Error on delete Repository", err.message);}
					}
					else {
						if (resultset > 0) {res.end("OK");}
						else {err_handler(res, 501, ":Error on update Repository:", ":No Repository found");}
					}
								
				});		
			}
		});
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//-----------------------------------------
myexport.createRepos = function (req, res) {
	var valuebig = req.get("body"),
	valuearray = valuebig.split("#"),
	l_sql = util.format(querystore.createRepos, valuearray[0], valuearray[1], valuearray[2], valuearray[3]);
	securecheck(querystore.updaterepos, res);
	// on error return error string
	if (init.isConnected == false) {err_handler(res, 501, ":Error on DB Connection:", err.message);}
	http_dbconn.createStatement (function (err, statement) {
		if (err) {err_handler(res, 501, "Error on create statement", err.message);}
		else {
			statement.executeUpdate(l_sql, function (err, resultset) {
				if (err) {
					if (/duplicate key/g.test(err.message)) {err_handler(res, 501, ":Error on execute Statement", ":Repository with specified url\\name already exists")}
					else {err_handler(res, 501, ":Error on update Repository:", err.message);}
				}
				else {res.end("OK");}
			});		
		}
	});
	// release connection to pool
	init.ReleasePool(DbHandler, http_dbconn);
};
//-----------------------------------------
function err_handler(res, err_code, err_message, err_detail){
	res.statusCode = err_code;
	res.end("KO" + err_message + err_detail);
}
//-----------------------------------------
function securecheck(sql, res){
	if ( /drop|DROP|Drop|Truncate|TRUNCATE|truncate/g.test(sql)) {
		err_handler(res, 501, ":Error on execute query", ":SQL Not allowed"); 
	}
}