slackApp.controller('AdministrationCtrl', function ($scope, $http) {

    $scope.availableTeams = [];
    $scope.allTeams = [];
    $scope.selectedUserId = -1;
    $scope.selectedTeamId = -1;

    // Get all users.  Get all teams.

    $http.get('/allusers')
    .then(function(response) {
        $scope.availableUsers = response.data;
        return $http.get('/team/team');
    }).then(function(response) {        
            $scope.allTeams = response.data;    
    });

    
    $scope.selectUserToAdd = function(selectedUser) {

        $scope.selectedUserId = selectedUser.id; // ID of selected user....

        // Get all teams of which the selected user is already a member.

        $http.get('/currentTeams/'+selectedUser.id)
        .then(function(response) {

           $scope.currentTeams = response.data;

           var currentTeamNames = $scope.currentTeams.map(function (team) {
               return team.team;
           });

           // Get all teams of which the selected user is NOT already a member.

           $scope.availableTeams = $scope.allTeams.filter(function(team, idx, arr) {

               if (currentTeamNames.indexOf(team.teamName) === -1) {
                   return true;
               }
               return false;
           });
        });
    };

    $scope.selectTeamToAdd = function(selectedTeam) {

        $scope.selectedTeamId = selectedTeam.teamId; // ID of selected team
    };

    $scope.addUserToTeam = function() { 

        if ( ($scope.selectedUserId != -1) && ($scope.selectedTeamId != -1) ) {

            var teamUsersDbRow = {"teamId": $scope.selectedTeamId, "userId": $scope.selectedUserId};

            $http.post('/team/user/', teamUsersDbRow).then(function(response) {

                location.reload(true);                
            });
        }   
    };
});