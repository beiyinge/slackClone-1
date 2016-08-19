slackApp.controller('AdministrationCtrl', function ($scope, $http) {

    $scope.availableTeams = [];
    $scope.allTeams = [];
    $scope.selectedUserId = -1;
    $scope.selectedTeamId = -1;

    $http.get('/allusers')
    .then(function(response) {
        $scope.availableUsers = response.data;
        return $http.get('/team/team');
    }).then(function(response) {        
            $scope.allTeams = response.data;    
    });

    
    $scope.selectUserToAdd = function(selectedUser) {

        $scope.selectedUserId = selectedUser.id;

        $http.get('/currentTeams/'+selectedUser.id)
        .then(function(response) {

           $scope.currentTeams = response.data;
           var currentTeamNames = $scope.currentTeams.map(function (team) {
               return team.team;
           });

           $scope.availableTeams = $scope.allTeams.filter(function(team, idx, arr) {
               if (currentTeamNames.indexOf(team.teamName) === -1) {
                   return true;
               }
               return false;
           });
        });
    };

    $scope.selectTeamToAdd = function(selectedTeam) {
        $scope.selectedTeamId = selectedTeam.teamId;
    };

    $scope.addUserToTeam = function() {
        //alert('Adding user:'+$scope.selectedUserId);
        //alert('Adding user:'+$scope.selectedTeamId);       
    };
});