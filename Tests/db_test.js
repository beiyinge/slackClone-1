
var assert = require('assert');
var db=require ('../db.js');

var filename="testSlack.db"

db.createDB(filename);
var dbTest=  new sqlite3.Database(filename);

function PropData(){
    

    db.InsertTeamData ("IronYard", dbTest);
    db.InsertTeamData('SSA Boot Camp', dbTest); 
  
    db.InsertUserData('Zedong', 'abcd', 'zedong@gmail.com', dbTest);
    db.InsertUserData('Chedva', 'pswd', 'cb@gmail.com', dbTest);
    db.InsertUserData('Brian', 'zyxw', 'brian@yahoo.com', dbTest);

    db.InsertTeamUsers("SELECT USERID FROM USERS WHERE NAME = 'Zedong'","SELECT TEAMID FROM TEAM WHERE NAME ='IronYard'", dbTest);
    db.InsertTeamUsers("'SELECT USERID FROM USERS WHERE NAME = 'Chedva'" , "SELECT TEAMID FROM TEAM WHERE NAME = 'IronYard'", dbTest);                    
    
    db.InsertChannelData('4Week', "SELECT TEAMID FROM TEAM WHERE TEAM = 'IronYard'", 'this is the channel for the 4 week boot camp', 'T', dbTest);
    db.InsertChannelData('General', "SELECT TEAMID FROM TEAM WHERE TEAM = 'IronYard'", 'this is the channel for the all boot camps', 'A', dbTest);

    db.InsertMsgData("This is a test", "SELECT CHANNELID FROM CHANNEL WHERE NAME = 'IronYard'","SELECT USERID FROM USERS WHERE NAME = 'Zedong'", dbTest );
    db.InsertMsgData("This is another test", "SELECT CHANNELID FROM CHANNEL WHERE NAME = 'IronYard'","SELECT USERID FROM USERS WHERE NAME = 'Chedva'", dbTest );   
   
    
}

PropData();


// describe("DB module",()=>{

//     var conn;
   
//     it('given team name, return all channel names from team',()=>{
       
//         var teamName = 'Yankees';
//         var expected=['Orange', 'Blue', 'Red'];
//         var actual =db.getChannelsFromTeam(conn, teamName);
//         assert(actual,expected);
//     });

//     //----------------------------------------

//       it('given channel, return all users',()=>{
       
//         var channel = 'bootCamp';
//         var expected=['Zedong','Chedva','Brian'];
//         var actual =db.getUsersFromChannel(conn, channel);
//         assert(actual,expected);
//     });

//     //--------------------------------------


//      it('given user, get channels',()=>{
       
//         var user = 'Zedong';
//         var expected=['General','bootCamp'];
//         var actual =db.getChannelFromUsers(conn, channel);
//         assert(actual,expected);
//     });


//     //--------------------------------------------
//      it('given user name, return  team',()=>{
        
//         var userName = 'Brian';
//         var expected=['IronYard'];
//         var actual =db.getChannels(conn, userName);
//         assert(actual,expected);
//     });
//     //-----------------------------------------------------------

//      it('given channel name, return all msgs',()=>{
//         conn={
//             insert: function (){

//             },
//             select: function (){
//                 return ['this is a test','and another test'];
//             }
//         }
//         var channel = 'bootCamp';
//         var expected=['this is a test','and another test'];
//         var actual =db.getChannels(conn, channel);
//         assert(actual,expected);
//     });

//     //--------------------------------------------
//      it('insert user',()=>{
//         conn={
//             insert: function (){

//             },
//             select: function (){
//                 return ['this is a test','and another test'];
//             }
//         }
//         var channel = 'bootCamp';
//         var expected=['this is a test','and another test'];
//         var actual =db.getChannels(conn, channel);
//         assert(actual,expected);
//     })

// });

// //--------------------------------------------------------------------

