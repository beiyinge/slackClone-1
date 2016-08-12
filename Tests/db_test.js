var express = require('express');
var app=express();
var sqlite3 = require('sqlite3').verbose();
var assert = require('assert');
var db=require ('../db.js');

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
       // PropData();

    });
    after(()=>{
        dbTest.rollback;
    });
  
   
    it('given team name, return all channel names from team',(done)=>{
       
        var teamName = 'IronYard';
        var expected=[{'channel':'4Week'}, {'channel':'General'}];
        var actual =db.getChannelsFromTeam(dbTest, teamName).then ((val)=> {
		console.log (val);
		//res.send (val);
		//db.close();
	}).catch((err)=>{
		//res.send("");
		console.log ("Unable to get channels from team name");
		//db.close();
	});
//;
        assert(actual,expected);
        done();
    });

//     //----------------------------------------
it('given channel, return all users',(done)=>{
       
        var channel = '4Week';
        var expected=[{'name':'Brian'}, {'name':'Chedva'},{'name':'Zedong'}];
        var actual =db.getUsersFromChannel(dbTest, channel).then ((val)=> {
		console.log (val);
		//res.send (val);
		//db.close();
	}).catch((err)=>{
		//res.send("");
		console.log ("Unable to get channels from user name");
		//db.close();
	});
//;
        assert(actual,expected);
        done();
    });


//     //--------------------------------------

it('given user, get channels',(done)=>{
       
        var userName = 'Zedong';
        var expected=[{'channel:':'4Week'}, {'channel':'General'}];
        var actual =db.getChannelsForUser(dbTest, userName).then ((val)=> {
		console.log (val);
		//res.send (val);
		//db.close();
	}).catch((err)=>{
		//res.send("");
		console.log ("Unable to get channels from team name");
		//db.close();
	});
//;
        assert(actual,expected);
        done();
    });





//     //--------------------------------------------


it('given user name, return teams',(done)=>{
       
        var userName = 'Zedong';
        var expected=[{'team:':'IronYard'}];
        var actual =db.getTeamsForUser(dbTest, userName).then ((val)=> {
		console.log (val);
		//res.send (val);
		//db.close();
	}).catch((err)=>{
		//res.send("");
		console.log ("Unable to get channels from team name");
		//db.close();
	});
//;
        assert(actual,expected);
        done();
    });

//     //-----------------------------------------------------------



it('given channel, get all msgs',(done)=>{
       
        var channel = '4Week';
        var expected=[{'msg:':'This is a test'}, {'msg':'This is another test'}];
        var actual =db.getMsgForChannel(dbTest, channel).then ((val)=> {
		console.log (val);
		//res.send (val);
		//db.close();
	}).catch((err)=>{
		//res.send("");
		console.log ("Unable to get channels from team name");
		//db.close();
	});
//;
        assert(actual,expected);
        done();
    });


//     //--------------------------------------------


 });

// //--------------------------------------------------------------------

