// query store
var myexport = module.exports = {}; //make fuction avaiable to external files

myexport.getallservers = "SELECT * FROM CAT_SERVERS";
myexport.updateserver = "UPDATE CAT_SERVERS SET SRV_HOSTNAME = '%s', SRV_IPADDR = '%s', SRV_USERNAME = '%s', SRV_PASSWORD = '%s', SRV_RTP = '%s', SRV_ENV_ID = '%d', SRV_NPORT = '%d' WHERE SRV_ID = %d";
myexport.selectsingleserver = "SELECT * FROM CAT_SERVERS WHERE SRV_ID = %d";
myexport.deleteserver = "DELETE FROM CAT_SERVERS WHERE SRV_ID = %d";
myexport.insertserver = "INSERT INTO CAT_SERVERS values (DEFAULT, '%s','%s','%s','%s','%s','%d','%d')";
myexport.getallrepo = "SELECT * FROM CAT.CAT_REPOS";
myexport.updaterepos = "UPDATE CAT.CAT_REPOS SET REP_REPONAME = '%s', REP_URL = '%s', REP_USERNAME = '%s', REP_PASSWORD = '%s' WHERE REP_ID = %d";
myexport.deleteRepos = "DELETE FROM CAT.CAT_REPOS WHERE REP_ID = %d";
myexport.createRepos = "INSERT INTO CAT.CAT_REPOS values (DEFAULT, '%s','%s','%s','%s')";



