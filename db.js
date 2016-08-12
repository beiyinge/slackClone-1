


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
	    //var data[];
	    dbConn.serialize(function() {
            
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
                        
	            		reject (err);
	            	}else{  
	            		channel.push({"channel":row.NAME});
                       // channel.push(row.NAME);
                       // console.log ("push - " + row.NAME);
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
                        console.log ("promise reject");
	            	}else{
	                	//callBack(err, JSON.stringify(followers));
                        console.log(JSON.stringify(channel));
                        //console.log("promise: - " + channel);
	                	resolve(JSON.stringify(channel));//
                        //resolve (channel);
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
     var sql= "select distinct users.name from users" +  
        "inner join teamusers on users.userid=teamusers.userid" +
        "inner join team on teamusers.teamid=team.teamid" +
        "inner join channels on channels.teamid=team.teamid" +
        "where channels.teamid =" + channel + ";) ORDER BY NAME";

      var users = [];
	    //var data[];
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		channel.push({"name" : row.NAME});
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	//callBack(err, JSON.stringify(followers));
	                	resolve(JSON.stringify(users));
                        //resolve (channel);
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
     var sql= "select distinct channels.name from channels " +
        "inner join teamusers on teamusers.teamid=channels.teamid " +
        "where userid=1" + user + ";) ORDER BY NAME";

      var channels = [];
	    //var data[];
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		channel.push({"channel" : row.NAME});
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	//callBack(err, JSON.stringify(followers));
	                	resolve(JSON.stringify(channels));
                        //resolve (channel);
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
     var sql= "select distinct channels.name from channels " +
        "inner join teamusers on teamusers.teamid=channels.teamid " +
        "where userid=1" + user + ";) ORDER BY NAME";

      var team = [];
	    //var data[];
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		channel.push({"channel" : row.NAME});
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	//callBack(err, JSON.stringify(followers));
	                	resolve(JSON.stringify(channels));
                        //resolve (channel);
	            	}
	           }
	        );
	    });
     });
 };