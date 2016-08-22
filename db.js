var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var userid;
//var db;
var filename;
var filename = 'testSlack.db';

exports.createDB = createDB;

function createDB(filename) {
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
                " FOREIGN KEY (USERID) REFERENCES USER(USERID))";


            var createChannelsTableSql = "CREATE TABLE IF NOT EXISTS CHANNELS " +
                "(ID         INTEGER     PRIMARY KEY   AUTOINCREMENT  NOT NULL," +
                "NAME        CHAR(50)   NOT NULL," +
                "DESC         CHAR(250) ,    " +
                " TEAMID         INTEGER, " +
                " TYPE          CHAR(1) , " +
                " FOREIGN KEY (TEAMID) REFERENCES TEAM(TEAMID))";

            var createMessageTableSql = "CREATE TABLE IF NOT EXISTS MESSAGE " +
                "(ID         INTEGER     PRIMARY KEY  AUTOINCREMENT  NOT NULL," +
                " MSG           TEXT , " +
                " CHANNELID     INTEGER," +
                " USERID         INTEGER , " +
                " TIMESTAMP        DATETIME DEFAULT CURRENT_TIMESTAMP," +
                " FOREIGN KEY (CHANNELID) REFERENCES CHANNELS(ID)," +
                " FOREIGN KEY (USERID) REFERENCES USER(USERID))";



            var createChatSql = "CREATE TABLE IF NOT EXISTS CHAT (ID         INTEGER     PRIMARY KEY  AUTOINCREMENT  NOT NULL, " +
                "CHANNELID     INTEGER, " +
                "USER1         INTEGER , " +
                "USER2         INTEGER , " +
                "FOREIGN KEY (CHANNELID) REFERENCES CHANNELS(ID), " +
                "FOREIGN KEY (USER1) REFERENCES USER(USERID), " +
                "FOREIGN KEY (USER2) REFERENCES USER(USERID))";

            db.run(createUserTableSql);
            db.run(createTeamTableSql);
            db.run(createTeamUsersTableSql);
            db.run(createChannelsTableSql);
            db.run(createMessageTableSql);
            db.run(creatChatSql);


        });
    }
}


//--------------------------------
exports.InsertTeamData = InsertTeamData;

function InsertTeamData(name, dbConn) {
    return new Promise((resolve, reject) => {

        var insertTeam = "INSERT INTO TEAM (NAME) VALUES ('" + name + "')"

        dbConn.serialize(function() {
            dbConn.run(
                insertTeam,

                function(err) {
                    if (err) {
                       
                        reject(err);


                    } else {
                       
                        resolve(); //

                    }
                }
            );
        });
    });
};

//-----------------------------------------------
exports.InsertUserData = InsertUserData;

function InsertUserData(name, pswd, email, dbConn) {
    return new Promise((resolve, reject) => {
        var insertUsers = "INSERT INTO USERS ( NAME, PASSWORD, EMAIL) " +
            "VALUES ('" + name + "', '" + pswd + "', '" + email + "')";
        dbConn.serialize(function() {
            dbConn.run(
                insertUsers,

                function(err) {
                    if (err) {
                       
                        reject(err);


                    } else {
                       
                        resolve(); //

                    }
                }
            );
        });
    });


}

//-------------------------------------

exports.InsertTeamUsers = InsertTeamUsers;

function InsertTeamUsers(userid, teamid, dbConn) {
    return new Promise((resolve, reject) => {
        var insertTeamUsers = "INSERT INTO TEAMUSERS ( USERID,TEAMID) " +
            "VALUES (" + userid + ", " + teamid + ")";
        dbConn.serialize(function() {
            dbConn.run(
                insertTeamUsers,

                function(err) {
                    if (err) {

                        reject(err);
                    } else {

                        resolve();
                    }
                }
            );
        });
    });
}

//--------------------------------------------

exports.InsertChannelData=InsertChannelData;

function InsertChannelData(name, teamid, desc, type, dbConn){
	return new Promise((resolve, reject)=>{

		
    	var insertChannels= "INSERT INTO CHANNELS ( NAME, TEAMID, DESC, TYPE) " +
            "VALUES('" + name  + "', " + teamid + " , '" + desc + "', '" + type + "')";
		
    	dbConn.serialize(function() {
        	dbConn.run(
					insertChannels,
					
					function (err) {
						if (err){
						
							reject(err);
													
						}else{
						
							resolve();//
						
						}
					}
				);
		});	
	});

}

//-------------------------------

exports.InsertMsgData=InsertMsgData;


function InsertMsgData(msg, channelId, userId, dbConn){
	return new Promise((resolve,reject)=>{
		var insertMSG= "INSERT INTO MESSAGE ( MSG, CHANNELID, USERID)  " +
			"VALUES ('" + msg + "', " + channelId + ", " + userId + ")";

			
			dbConn.serialize(function() {
            
				dbConn.run(
					insertMSG, 
					
					function (err) {
						if (err){
							reject(err);
					
						}else{
							resolve();//
						
						}
					}
				);
		});
	});     
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
                    if (err) {
                        reject(err);
                    } else {
                        team.push({
                            "team": row.NAME
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(team));

                    }
                }
            );
        });
    });
};

//--------------------------------------------------

exports.getTeams = getTeams;

function getTeams(dbConn) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT TEAM.NAME, TEAM.TEAMID FROM TEAM ORDER BY TEAM.NAME";


        var team = [];

        dbConn.serialize(function() {
            dbConn.each(
                sql,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        team.push({
                            "teamId": row.TEAMID,
                            "teamName": row.NAME
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(team));

                    }
                }
            );
        });
    });
};
//-------------------------------------
exports.getAllUsersInTeam = getAllUsersInTeam;

function getAllUsersInTeam(id, dbConn) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT USERS.USERID, USERS.NAME FROM USERS " +
            "INNER JOIN TEAMUSERS on USERS.USERID=TEAMUSERS.USERID " +
            "WHERE TEAMID IN (SELECT TEAMID FROM TEAMUSERS WHERE USERID=" + id + ") " +
            " AND USERS.USERID <> " + id;

        var users = [];

        dbConn.serialize(function() {
            
            dbConn.each(
                sql,
                function(err, row) {
                  
                    if (err) {
                        reject(err);
                        
                    } else {
                       
                        users.push({
                            "userId": row.USERID,
                            "userName": row.NAME
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                      
                    } else {
                        
                        resolve(JSON.stringify(users));

                    }
                }
            );
        });
    });
};
//----------------------------------
exports.getChannelsForPrivate = getChannelsForPrivate;

function getChannelsForPrivate(id, dbConn) {
    return new Promise((resolve, reject) => {

        var sql = "SELECT DISTINCT CHANNELS.ID, CHANNELS.NAME FROM CHANNELS " +
            "INNER JOIN CHAT on CHAT.CHANNELID = CHANNELS.ID " +
            "WHERE TYPE = 'P' AND (USER1 = " + id + " OR USER2 = " + id + ") ORDER BY NAME";

        var channels = [];
        dbConn.serialize(function() {
            dbConn.each(
                sql,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        channels.push({
                            "channelId": row.ID,
                            "channelName": row.NAME
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(channels));

                    }
                }
            );
        });
    });


}


exports.getAllUserNames = getAllUserNames;


function getAllUserNames (dbConn){
	return new Promise((resolve,reject)=>{

		var sql= "SELECT USERID, NAME FROM USERS ORDER BY NAME";        
		
		var users = [];
		
		dbConn.serialize(function() {
			dbConn.each(
				sql, 
				function(err, row) {
					if (err){
						reject (err);
					}else{  
						users.push({"id": row.USERID,  "name" : row.NAME});						
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


exports.getChannels=getChannels;

function getChannels (dbConn){
     return new Promise((resolve,reject)=>{
     var sql= "SELECT NAME, ID FROM CHANNELS ORDER BY NAME";
        
     
      var team = [];
	   
	    dbConn.serialize(function() {
	        dbConn.each(
	            sql, 
	            function(err, row) {
	            	if (err){
	            		reject (err);
	            	}else{  
	            		team.push({"id": row.ID,  "name" : row.NAME,"bSave": false});
	                	
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
                    if (err) {
                        reject(err);
                    } else {
                        msg.push({
                            "userName": row.NAME,
                            "date": row.TIMESTAMP,
                            "msg": row.MSG
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(msg));

                    }
                }
            );
        });
    });
};
//------------------------------------------------------------

exports.getTeamNameFromId = getTeamNameFromId;

function getTeamNameFromId(dbConn, teamId) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT NAME FROM TEAM WHERE TEAMID =  " + teamId;



        var team = [];

        dbConn.serialize(function() {
            dbConn.each(
                sql,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        team.push({
                            "teamName": row.NAME
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(team));

                    }
                }
            );
        });
    });
};

//--------------------------------------------------
exports.getTeamIdFromName = getTeamIdFromName;

function getTeamIdFromName(dbConn, teamName) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT TEAM.TEAMID FROM TEAM WHERE NAME ='" + teamName + "'";

        var team = [];

        dbConn.serialize(function() {
            dbConn.each(
                sql,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        team.push({
                            "teamId": row.TEAMID
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(team));

                    }
                }
            );
        });
    });
};

////-------------------------------------------------
exports.getChannelIdFromName = getChannelIdFromName;

function getChannelIdFromName(dbConn, channelName) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT ID FROM CHANNELS WHERE NAME ='" + channelName + "'";

        var channel = [];

        dbConn.serialize(function() {
            dbConn.each(
                sql,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        channel.push({
                            "channelName": row.ID
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(channel));

                    }
                }
            );
        });
    });
};

//----------------------------------------------------------------------------
exports.getUserIdFromName = getUserIdFromName;

function getUserIdFromName(dbConn, userName) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT USERID FROM USERS WHERE NAME ='" + userName + "'";

        var user = [];

        dbConn.serialize(function() {
            dbConn.each(
                sql,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        user.push({
                            "userId": row.USERID
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(user));

                    }
                }
            );
        });
    });
};
//------------------------------------------------------------------------


exports.getUserNameFromID = getUserNameFromID;

function getUserNameFromID(dbConn, userID) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT NAME FROM USERS WHERE USERID = " + userID;

        var user = [];

        dbConn.serialize(function() {
            dbConn.each(
                sql,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        user.push({
                            "userName": row.NAME
                        });

                    }
                },
                function(err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(user));

                    }
                }
            );
        });
    });
};

