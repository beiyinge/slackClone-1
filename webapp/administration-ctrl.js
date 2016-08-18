slackApp.controller('AdministrationCtrl', function ($scope, $http) {

    $http.get('/allusers').success(function(data) {
        $scope.availableUsers = data;
    });

    $scope.addUserToTeam = function() {
        alert('Selected Name:'+$scope.userToAdd);
    };
});