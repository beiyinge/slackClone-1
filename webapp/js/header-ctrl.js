slackApp.controller('helpSlideCtrl',['$scope',function($scope){

    $scope.helpSlidechecked = false;
    $scope.size = '100px';

    $scope.helpSlideToggle = function() {
        $scope.helpSlidechecked = !$scope.helpSlidechecked
    }

    $scope.mockRouteChange = function () {
        $scope.$broadcast('$locationChangeStart');
    }

    $scope.onopen = function () {
        alert('Open');
    }

    $scope.onclose = function () {
        alert('Close');
    }
}]);