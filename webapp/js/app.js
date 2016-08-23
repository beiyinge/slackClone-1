var slackApp = angular.module('slackApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

var headerTabs = [];

headerTabs.push({ path: '/', templateUrl: 'home.html', controller: 'HomeCtrl' });
headerTabs.push({ path: '/channel.html', templateUrl: 'channel.html', controller: 'ChannelCtrl' });
headerTabs.push({ path: '/Teams.html', templateUrl: 'Teams.html', controller: 'TeamCtrl' });
headerTabs.push({ path: '/administration.html', templateUrl: 'administration.html', controller: 'AdministrationCtrl' });

slackApp.config(function($routeProvider) {
    
    for ( var ii = 0; ii < headerTabs.length; ii++ ) {

        $routeProvider.when(
            headerTabs[ii].path, 
            { templateUrl: headerTabs[ii].templateUrl, 
              controller:  headerTabs[ii].controller 
            });
    }
    
    $routeProvider.otherwise( {redirectTo: '/' });

}).run(['$rootScope', '$location', function($rootScope, $location) {
    // Make selected tab Active.
    var path = function() {
        return $location.path();
    };
    $rootScope.$watch(path, function(newVal, oldVal) {
        $rootScope.activetab = newVal;
    });
}]);


slackApp.filter("trust", ['$sce', function($sce) {
    return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);


slackApp.filter('linkyWithHtml', function($filter) {
    return function(value) {
        var linked = $filter('linky')(value);
        var replaced = linked.replace(/\&gt;/g, '>').replace(/\&lt;/g, '<');
        return replaced;
    };
});


slackApp.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

slackApp.service('fileUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl, callback) {
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(callback);
        // }).then(function successCallback(response) {
        //     console.log("File uploaded success!");
        // });
    }
}]);