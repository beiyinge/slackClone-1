slackApp.controller('ChannelCtrl', function ($scope, $http, $cookieStore, $window) {
    $scope.userId = $cookieStore.get('userId');
    $scope.userName = $cookieStore.get('userName');
    $http.get('/channel/user/' + $scope.userId).success(function (data) {
        $scope.channels = data;
    });

    $http.get('/team/team').success(function (data) {
        $scope.teams = data;
        console.log(data);
    });


    // $scope.IsEnter=function(event){
    //     if (event.keyCode===13){                                       
    //          $scope.bNew=true
    //         document.getElementById("txtChannel").value = "";
    //         $scope.channels.push({"channel":$scope.newChannel});

    //        $scope.SaveChannel2DB({"userId":$scope.userId, "channelName":$scope.newChannel});         
    //     }
    //  };

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

            //   console.log(messageData);
            $http.post('/team/channel', newChannelData).success(function (data, status, headers, config) {
                //         $scope.PostDataResponse = data;
                console.log("success saving channel:" + data);
            })
                .error(function (data, status, headers, config) {
                    console.log("failed to save channel");
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

    $scope.editChecks = function () {
        var bErr = false;


        if ($scope.newChannel === "") {
            $scope.channelErr = true;
            $scope.$apply;
            bErr = true;
            console.log("channel empty");
        } else {
            console.log("has channel: " + $scope.newChannel);
            $scope.channelErr = false;
        }

        if ($scope.desc === "") {
            $scope.descErr = true;
            $scope.$apply;
            bErr = true;
            // console.log ("channel empty");
        } else {
            console.log("has desc: " + $scope.desc);
            $scope.descErr = false;
        }

        console.log("Team name: " + $scope.selTeam + " value: " + document.getElementById('lstTeams').value);



        if (document.getElementById('lstTeams').value === "0") {
            console.log("in val=0");
            $scope.teamErr = true;
            $scope.$apply;
            bErr = true;
        } else {
            $scope.teamErr = false;
        }

        if ((document.getElementById('radPublic').checked !== true) && (document.getElementById('radPrivate').checked !== true)) {
            $scope.radErr = true;
            $scope.$apply;
            bErr = true;
        } else {
            $scope.radErr = false;
        }

        return bErr;
    }



    $scope.checkChannelData = function (event) {
        if ($scope.newChannel !== "") {
            $scope.channelErr = false;
            $scope.$apply;
        }
    };

    $scope.checkDescData = function (event) {
        if ($scope.desc !== "") {
            $scope.descErr = false;
            $scope.$apply;
        }
    };

    $scope.checkTeamData = function () {
        console.log("selection made");
        if ($scope.selTeam !== "Select a team") {
            $scope.teamErr = false;
            $scope.$apply;
        }
    }

    $scope.checkRadData = function () {
        if ((document.getElementById('radPublic').checked === true) || (document.getElementById('radPrivate').checked === true)) {
            $scope.radErr = false;
            $scope.$apply;
        }

    };
});