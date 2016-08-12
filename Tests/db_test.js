var express = require('express');
var app=express();
var sqlite3 = require('sqlite3').verbose();
var assert = require('assert');
var db=require ('../db.js');
var chai=require("chai");
var chaiAsPromised=require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var filename="testSlack.db"


//db.createDB(filename);

 var dbTest=  new sqlite3.Database(filename);


//function PropData(){
    

  //db.InsertTeamData ("IronYard", dbTest);
//db.InsertTeamData('SSA Boot Camp', dbTest); 
  
    //  db.InsertUserData('Zedong', 'abcd', 'zedong@gmail.com', dbTest);
    //  db.InsertUserData('Chedva', 'pswd', 'cb@gmail.com', dbTest);
    //  db.InsertUserData('Brian', 'zyxw', 'brian@yahoo.com', dbTest);

//     db.InsertTeamUsers("(SELECT USERID FROM USERS WHERE NAME = 'Zedong')","(SELECT TEAMID FROM TEAM WHERE NAME ='IronYard')", dbTest);
//  db.InsertTeamUsers("(SELECT USERID FROM USERS WHERE NAME = 'Chedva')" , "(SELECT TEAMID FROM TEAM WHERE NAME = 'IronYard')", dbTest);                    
    
//    db.InsertChannelData('4Week', "(SELECT TEAMID FROM TEAM WHERE NAME = 'IronYard')", 'this is the channel for the 4 week boot camp', 'T', dbTest);
//     db.InsertChannelData('General', "(SELECT TEAMID FROM TEAM WHERE NAME = 'IronYard')", 'this is the channel for the all boot camps', 'A', dbTest);
    // dbTest.run("DELETE FROM MESSAGE");
   // db.InsertMsgData("This is a test", "(SELECT ID FROM CHANNELS WHERE NAME = '4Week')","(SELECT USERID FROM USERS WHERE NAME = 'Zedong')", dbTest );
   // db.InsertMsgData("This is another test", "(SELECT ID FROM CHANNELS WHERE NAME = '4Week')","(SELECT USERID FROM USERS WHERE NAME = 'Chedva')", dbTest );   
   
    
// }

// PropData();


describe("DB module",()=>{

     before(()=>{
    //    // PropData();
    

     });
    after(()=>{
         dbTest.exec('ROLLBACK');
     });
  
   
    it('#1 given team name, return all channel names from team',(done)=>{
        
       
        var team = '11';
        var expected=JSON.stringify([{'channel':'4Week'}, {'channel':'General'}]);
        db.getChannelsFromTeam(dbTest,team).should.eventually.equal(expected).notify(done);
       
        
   });

//     //----------------------------------------
    it('#2 given channel, return all users',(done)=>{
        var channel = 1;
        var expected=JSON.stringify([{'name':'Chedva'},{'name':'Zedong'}]);
        db.getUsersFromChannel(dbTest,channel).should.eventually.equal(expected).notify(done);
        
    });


//     //--------------------------------------

it('#3 given user, get channels',(done)=>{
       
        var userName = 1;
        var expected=JSON.stringify([{'channel':'4Week'}, {'channel':'General'}]);
        console.log ("expected-" + expected);
         db.getChannelsForUser(dbTest,userName).should.eventually.equal(expected).notify(done);

    });





//     //--------------------------------------------


it('#4 given user name, return teams',(done)=>{
       
        var userName = 2;
        var expected=JSON.stringify([{'team':'IronYard'}]);
        db.getTeamsForUser(dbTest,userName).should.eventually.equal(expected).notify(done);
    });

//     //-----------------------------------------------------------



it('#5 given channel, get all msgs',(done)=>{
       
        var channel = 1;
        var expected=JSON.stringify([{"userName" : "Zedong", "date":"2016-08-12 13:49:51", "msg": "This is a test"},
             {"userName" : "Chedva", "date":"2016-08-12 13:49:52", "msg": "This is another test"}]);

         db.getMsgForChannel(dbTest,channel).should.eventually.equal(expected).notify(done);
    });


//     //--------------------------------------------
it ('#6 get team id from team name',(done)=>{
       
        var team = "IronYard";
        var expected=JSON.stringify([{"teamId" : 11}]);

         db.getTeamIdFromName(dbTest,team).should.eventually.equal(expected).notify(done);
    });

    //------------------------------------------------

    it ('#7 get channel id from channel name',(done)=>{
       
        var channel = "4Week";
        var expected=JSON.stringify([{"channelName" : 1}]);

         db.getChannelIdFromName(dbTest,channel).should.eventually.equal(expected).notify(done);
    });

    //----------------------------------------------------------------

    it ('#8 get user id from user name',(done)=>{
       
        var user = "Brian";
        var expected=JSON.stringify([{"userId" : 3}]);

         db.getUserIdFromName(dbTest,user).should.eventually.equal(expected).notify(done);
    });

    //-----------------------------------------------------------------
    it ('#9 insert team',(done)=>{
       
        var team = "NewTeam";
        var expected=JSON.stringify([{"teamName" : "NewTeam"}]);

         db.insertTeam(dbTest,team).should.eventually.equal(expected).notify(done);
        
    });

// //----------------------------------------------------------------------------
  it ('#10 insert channel',(done)=>{
       
        var channel = "NewChannel";
        var team="NewTeam"
        var expected=JSON.stringify([{"channelName" : "NewChannel", "teamName": "NewTeam"}]);

         db.insertChannel(dbTest,channel).should.eventually.equal(expected).notify(done);
        
    });

// //----------------------------------------------------------------------------
  it ('#11 insert user',(done)=>{
       
        var user = "NewUser";
         var expected=JSON.stringify([{"userName" : "NewUser", }]);

         db.insertUser(dbTest,user).should.eventually.equal(expected).notify(done);
        
    });


// //----------------------------------------------------------------------------
  it ('#12 insert user in  team',(done)=>{
       
        var team = "NewTeam";
        var user="NewUser";
        var expected=JSON.stringify([{"teamName" : "Team", "userName":"NewUser"}]);

         db.insertUserToTeam(dbTest,team,user).should.eventually.equal(expected).notify(done);
        
    });


// //----------------------------------------------------------------------------
  it ('#13 insert msg ',(done)=>{
       
        var msg = "NewMessage";
        var user="NewUser";
        var team="NewTeam";
        var expected=JSON.stringify([{"teamName" : "Team", "userName":"NewUser", "msg":"NewMessage"}]);

         db.insertMsg(dbTest,team,user,msg).should.eventually.equal(expected).notify(done);
        
    });
    

// //----------------------------------------------------------------------------
});


