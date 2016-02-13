/**
 * Created by USER on 10/15/2015.
 */
'use strict';

var externalMainController = angular.module('externalMainController',[]);
externalMainController.controller('weatherController',['$http','$scope','$rootScope',
    function($http,$scope,$rootScope) {
        if($rootScope.User==null){
            $location.path("login");
        }
        $scope.date = new Date();
        var url = 'http://api.openweathermap.org/data/2.5/weather';
        $http.jsonp(url, { params : {
            lat : $rootScope.Latitude.toString(),
            lon : $rootScope.Longitude.toString(),
            appid : "bcc93ef623451d89172784421e454ee0",
            callback: 'JSON_CALLBACK'
        }}).
            success(function(data, status, headers, config) {
                $scope.weather = data;
                if($scope.weather.sys.country=="TH"){
                    $scope.weather.sys.country="Thailand";
                }
            }).
            error(function(data, status, headers, config) {
                // Log an error in the browser's console.
                $log.error('Could not retrieve data from ' + url);
            });

    }]);
externalMainController.controller('priceController',['$http','$scope','$rootScope','$location','$sce',
    function($http,$scope,$rootScope,$location,$sce) {
        if($rootScope.plantName==null||$rootScope.plantName==undefined){
            $rootScope.plantName="";
        }
        if($rootScope.User==null){
            $location.path("login");
        }
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };
        $scope.src = "http://www.taladsimummuang.com/dmma/Portals/PriceListResult.aspx?q="+$rootScope.plantName;
    }]);