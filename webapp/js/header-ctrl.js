slackApp.controller('helpSlideCtrl',['$scope',function($scope){

    $scope.helpSlidechecked = false;

    $scope.helpSlideToggle = function() {
        $scope.helpSlidechecked = !$scope.helpSlidechecked;
    }

}]);