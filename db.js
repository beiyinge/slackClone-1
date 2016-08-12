


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

function getChannelsFromTeam (dbConn, teamName){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT NAME FROM CHANNELS WHERE TEAMID = (SELECT TEAMID FROM TEAM WHERE NAME = '" + teamName + "') ORDER BY NAME";

      var channel = [];
	    //var data[];
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		channel.push(row.NAME);
	                	
	                }
	            },
	            function (err, nRows) {
	            	if (err){
	            		reject(err);
	            	}else{
	                	//callBack(err, JSON.stringify(followers));
	                	resolve(JSON.stringify(channel));
                        //resolve (channel);
	            	}
	           }
	        );
	    });
     });
 };