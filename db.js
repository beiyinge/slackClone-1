


var express = require('express');
var app=express();
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var userid;
//var db;
var filename;
var filename = 'testSlack.db';

exports.createDB=createDB;

function createDB (filename){
    var dbexists = false;
    try {
        fs.accessSync(filename);
        dbexists = true;
    } catch (ex) {
        dbexists = false;
    }



    if (!dbexists) {
        var db = new sqlite3.Database(filename);

        db.serialize(function() {
            var createUserTableSql = "CREATE TABLE IF NOT EXISTS USERS " +
                        "(USERID         INTEGER     PRIMARY KEY   AUTOINCREMENT  NOT NULL," +
                        " NAME           CHAR(50)                    NOT NULL, " + 
                        " PASSWORD       CHAR(50)                    NOT NULL, " +
                        " EMAIL          CHAR(50)                    NOT NULL )"; 

            var createTeamTableSql = "CREATE TABLE IF NOT EXISTS TEAM " +
                        "(TEAMID        INTEGER     PRIMARY KEY AUTOINCREMENT    NOT NULL," +
                        " NAME         CHAR(50)   NOT NULL)"; 

            var createTeamUsersTableSql = "CREATE TABLE IF NOT EXISTS TEAMUSERS " +
                        "(ID         INTEGER     PRIMARY KEY    AUTOINCREMENT NOT NULL," +
                        " TEAMID         INTEGER, " +
                        " USERID         INTEGER , " +
                        " FOREIGN KEY (TEAMID) REFERENCES TEAM(TEAMID)," +
                        " FOREIGN KEY (USERID) REFERENCES USER(USERID))" ; 


            var createChannelsTableSql = "CREATE TABLE IF NOT EXISTS CHANNELS " +
                        "(ID         INTEGER     PRIMARY KEY   AUTOINCREMENT  NOT NULL," +
                        "NAME        CHAR(50)   NOT NULL," +
                        "DESC         CHAR(250) ,    " +
                        " TEAMID         INTEGER, " +
                        " TYPE          CHAR(1) , " +
                        " FOREIGN KEY (TEAMID) REFERENCES TEAM(TEAMID))" ; 

                var createMessageTableSql = "CREATE TABLE IF NOT EXISTS MESSAGE " +
                    "(ID         INTEGER     PRIMARY KEY  AUTOINCREMENT  NOT NULL," +
                    " MSG           TEXT , " +
                    " CHANNELID     INTEGER,"+
                    " USERID         INTEGER , " +
                    " TIMESTAMP        DATETIME DEFAULT CURRENT_TIMESTAMP,"+
                    " FOREIGN KEY (CHANNELID) REFERENCES CHANNELS(ID)," +
                    " FOREIGN KEY (USERID) REFERENCES USER(USERID))" ; 


            db.run(createUserTableSql);
            db.run(createTeamTableSql);
            db.run(createTeamUsersTableSql);
            db.run(createChannelsTableSql);
            db.run(createMessageTableSql);
            db.close();
        
        });
    }
}

createDB(filename);
//--------------------------------
exports.InsertTeamData=InsertTeamData;
function InsertTeamData( name, dbConn){
      
      var insertTeam = "INSERT INTO TEAM (NAME) " +
                "VALUES ('" + name + "')";
      dbConn.run (insertTeam)
    
}

//-----------------------------------------------
exports.InsertUserData=InsertUserData;
function InsertUserData(name, pswd, email, dbConn){
    var insertUsers = "INSERT INTO USERS ( NAME, PASSWORD, EMAIL) " +
             "VALUES ('" + name + "', '" + pswd + "', '" + email + "')";
    dbConn.run(insertUsers);

}

//-------------------------------------

exports.InsertTeamUsers=InsertTeamUsers;

function InsertTeamUsers(userid, teamid, dbConn){
    var insertTeamUsers = "INSERT INTO TEAMUSERS ( USERID,TEAMID) " +
             "VALUES (" + userid + ", " + teamid + ")";
    dbConn.run(insertTeamUsers)
}

//--------------------------------------------
exports.InsertChannelData=InsertChannelData;

function InsertChannelData(name, teamid, desc, type, dbConn){
    var insertChannels= "INSERT INTO CHANNELS ( NAME, TEAMID, DESC, TYPE) " +
            "VALUES('" + name  + "', " + teamid + " , '" + desc + "', '" + type + "')";
    
    dbConn.run(insertChannels);

}

//-------------------------------

exports.InsertMsgData=InsertMsgData;

function InsertMsgData(msg, channelId, userId, dbConn){
     var insertMSG= "INSERT INTO MESSAGE ( MSG, CHANNELID, USERID)  " +
        "VALUES ('" + msg + "', " + channelId + ", " + userId + ")";

    dbConn.run(insertMSG);            
        
}

//------------------------------------------
 
 exports.getChannelsFromTeam=getChannelsFromTeam;

function getChannelsFromTeam (dbConn, team){
     return new Promise((resolve,reject)=>{
   //  var sql= "SELECT NAME FROM CHANNELS WHERE TEAMID = (SELECT TEAMID FROM TEAM WHERE NAME = '" + teamName + "') ORDER BY NAME";
     var sql= "SELECT NAME FROM CHANNELS WHERE TEAMID = " + team + " ORDER BY NAME";

      var channel = [];
	    
	    dbConn.serialize(function() {
            
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
                        
	            		reject (err);
	            	}else{  
	            		channel.push({"channel":row.NAME});
                      
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
                     
	            	}else{
	                
	                	resolve(JSON.stringify(channel));//
                    
	            	}
	           }
	        );

            
	    });
     });
 };


 ///----------------------------------------------

  exports.getUsersFromChannel=getUsersFromChannel;

function getUsersFromChannel (dbConn, channel){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT DISTINCT USERS.NAME FROM USERS " +  
        "INNER JOIN TEAMUSERS ON USERS.USERID=TEAMUSERS.USERID " +
        "INNER JOIN TEAM ON TEAMUSERS.TEAMID=TEAM.TEAMID " +
        "INNER JOIN CHANNELS ON CHANNELS.TEAMID=TEAM.TEAMID " +
        "WHERE CHANNELS.ID = " + channel + " ORDER BY USERS.NAME";

      var users = [];
	    //var data[];
	    dbConn.serialize(function() {
              dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		users.push({"name" : row.NAME});
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	resolve(JSON.stringify(users));
                        
	            	}
	           }
	        );
	    });
     });
 };

 //---------------------------------------------

 exports.getChannelsForUser=getChannelsForUser;

function getChannelsForUser (dbConn, user){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT DISTINCT CHANNELS.NAME FROM CHANNELS  " +
        "INNER JOIN TEAMUSERS ON TEAMUSERS.TEAMID = CHANNELS.TEAMID " +
        "WHERE USERID = " + user + " ORDER BY NAME";
    

      var channels = [];
	    //var data[];
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		channels.push({"channel" : row.NAME});
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	
                        console.log("actual-" + JSON.stringify(channels));
	                	resolve(JSON.stringify(channels));
                        
	            	}
	           }
	        );
	    });
     });
 };

 //-------------------------------------------------------------
 exports.getTeamsForUser=getTeamsForUser;

function getTeamsForUser (dbConn, user){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT TEAM.NAME FROM TEAM " + 
            "INNER JOIN TEAMUSERS ON TEAM.TEAMID=TEAMUSERS.TEAMID " +
            "INNER JOIN USERS ON USERS.USERID=TEAMUSERS.USERID " +
            "WHERE USERS.USERID = " + user + " ORDER BY TEAM.NAME";
        
     
      var team = [];
	   
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		team.push({"team" : row.NAME});
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	resolve(JSON.stringify(team));
                        
	            	}
	           }
	        );
	    });
     });
 };

 //------------------------------------------------------------

 exports.getMsgForChannel=getMsgForChannel;

 function getChannelsForUser (dbConn, user){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT DISTINCT CHANNELS.NAME FROM CHANNELS  " +
        "INNER JOIN TEAMUSERS ON TEAMUSERS.TEAMID = CHANNELS.TEAMID " +
        "WHERE USERID = " + user + " ORDER BY NAME";
    

      var channels = [];
	    //var data[];
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		channels.push({"channel" : row.NAME});
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	
                        console.log("actual-" + JSON.stringify(channels));
	                	resolve(JSON.stringify(channels));
                        
	            	}
	           }
	        );
	    });
     });
 };

 //-------------------------------------------------------------
 exports.getMsgForChannel=getMsgForChannel;

function getMsgForChannel (dbConn, channel){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT USERS.NAME, MSG, TIMESTAMP FROM MESSAGE " + 
            "INNER JOIN USERS ON MESSAGE.USERID=USERS.USERID " +
            "WHERE MESSAGE.CHANNELID = " + channel + " ORDER BY MESSAGE.TIMESTAMP, USERS.NAME";
        
     
      var msg = [];
	   
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		msg.push({"userName" : row.NAME, "date": row.TIMESTAMP, "msg": row.MSG} );
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	resolve(JSON.stringify(msg));
                        
	            	}
	           }
	        );
	    });
     });
 };

 //--------------------------------------------------
 exports.getTeamIdFromName=getTeamIdFromName;

 function getTeamIdFromName(dbConn, teamName){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT TEAM.TEAMID FROM TEAM WHERE NAME ='" + teamName + "'";
     
      var team = [];
	   
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		team.push({"teamId" : row.TEAMID} );
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	resolve(JSON.stringify(team));
                        
	            	}
	           }
	        );
	    });
     });
 };

////-------------------------------------------------
exports.getChannelIdFromName=getChannelIdFromName;

 function getChannelIdFromName(dbConn, channelName){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT ID FROM CHANNELS WHERE NAME ='" + channelName + "'";
     
      var channel = [];
	   
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		channel.push({"channelName" : row.ID} );
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	resolve(JSON.stringify(channel));
                        
	            	}
	           }
	        );
	    });
     });
 };

 //----------------------------------------------------------------------------
 exports.getUserIdFromName=getUserIdFromName;

 function getUserIdFromName(dbConn, userName){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT USERID FROM USERS WHERE NAME ='" + userName + "'";
     
      var user = [];
	   
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		user.push({"userId" : row.USERID} );
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	resolve(JSON.stringify(user));
                        
	            	}
	           }
	        );
	    });
     });
 };

 //--------------------------------------------------------
 exports.insertTeam=insertTeam;

 function insertTeam(dbConn, team){
	 
 }