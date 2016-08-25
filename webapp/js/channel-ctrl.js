slackApp.controller('ChannelCtrl', function ($scope, $http, $cookieStore, $window) {
    $scope.userId = $cookieStore.get('userId');
    $scope.userName = $cookieStore.get('userName');
    $http.get('/channel/user/' + $scope.userId).success(function (data) {
        $scope.channels = data;
    });

    $http.get('/team/team').success(function (data) {
        $scope.teams = data;
      
    });


    
    $scope.newChannel = "";
    $scope.desc = "";
    $scope.selTeam = "Select a team";


    $scope.SaveChannel2DB = function () {

        if (!$scope.editChecks()) {
           

            if (document.getElementById('radPublic').checked === true) {
                $scope.type = "A";

            } else {
                $scope.type = "T";
            }
 
                
            $scope.selTeam = document.getElementById('lstTeams').value;

            var newChannelData = ({ "channelName": $scope.newChannel, "desc": $scope.desc, "teamId": $scope.selTeam, "type": $scope.type });
          
            $http.post('/team/channel', newChannelData).success(function (data, status, headers, config) {
          
               
            })
                .error(function (data, status, headers, config) {
            
                  
                });


            $scope.channels.push({ "id": "", "name": $scope.newChannel });

            $scope.emptyFields();

        }

        
    };


    $scope.emptyFields = function () {
        document.getElementById("txtChannel").value = "";
        document.getElementById("txtDesc").value = "";
        document.getElementById("lstTeams").value = 0;
        document.getElementById("radPublic").value = false;
        document.getElementById("radPrivate").checked = false;

    };

    $scope.selectedTeam=null; 
    
    $scope.editChecks = function () {
        var bErr = false;


        if ($scope.newChannel === "") {
            $scope.channelErr = true;
            
            
            bErr = true;
         
        } else {
           
            $scope.channelErr = false;
        }

        if ($scope.desc === "") {
            $scope.descErr = true;
            bErr = true;
           
        } else {
            
            $scope.descErr = false;
        }

        console.log ($scope.selectedTeam);
        if ($scope.selectedTeam >= 1) {
           $scope.teamErr = false;
           
        } else {
           
            $scope.teamErr = true;
            bErr = true;
        }

        if ((document.getElementById('radPublic').checked !== true) && (document.getElementById('radPrivate').checked !== true)) {
            $scope.radErr = true;
            bErr = true;
        } else {
            $scope.radErr = false;
        }

        return bErr;
    }



    $scope.checkChannelData = function (event) {
        if ($scope.newChannel !== "") {
            $scope.channelErr = false;
        }
    };

    $scope.checkDescData = function (event) {
        if ($scope.desc !== "") {
            $scope.descErr = false;
        }
    };

    $scope.checkTeamData = function (event) {
       
        if ($scope.selectedTeam !== null) {
            $scope.teamErr = false;
        }
    }

    $scope.checkRadData = function () {
        if ((document.getElementById('radPublic').checked === true) || (document.getElementById('radPrivate').checked === true)) {
            $scope.radErr = false;
        }

    };
});