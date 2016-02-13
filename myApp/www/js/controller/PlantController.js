/**
 * Created by USER on 7/15/2015.
 */
'use strict';

var plantMainController = angular.module('plantMainController',['plantServices']);
plantMainController.controller('listPlantController', ['$scope', '$http','$state', '$rootScope','plantService', '$ionicPopup',
    function ($scope, $http,$state, $rootScope,plantService,$ionicPopup) {
        if($rootScope.User==null){
            $state.go('app.login');
        }
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plant/" + $rootScope.plotId+"/edit").success(function (data) {
            $scope.plants = data;
        });
        $scope.deletePlant = function(id){
            var answer = confirm("Do you want to delete the plant?");
            if (answer) {
                plantService.delete({id:id},function(){
                    $ionicPopup.alert({
                        title: 'Success',
                        template: 'success'
                    });
                    $state.go('app.plantList',{},{reload:true});
                }).
                    error(function(data) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'There is a problem! Your request has not been fulfilled, please try again'
                        });
                    });
            }};
        $scope.selectPlant= function(id,plantName){
            if($rootScope.PlantId==id){
                $rootScope.PlantId = null;
                $rootScope.plantName = null;
                $rootScope.SelectedPlant = false;
            }else {
                $rootScope.PlantId = id;
                $rootScope.plantName = plantName;
                $rootScope.SelectedPlant = true;
            }
        }

    }]);
plantMainController.controller('addPlantToPlotController',['$scope', '$http','$state', '$rootScope','plantService','$ionicPopup',
    function ($scope, $http,$state, $rootScope,plotService,$ionicPopup) {
        if($rootScope.User==null){
            $state.go("app.login");
        }
        if($rootScope.plotId==null){
            $state.go("app.farmList")
        }
        $scope.head = "Add Plant";
        $scope.addPlant = true;
        $scope.editPlant = false;
        $scope.plant = {plant_id:'',type:'',DOB:'',harvestDay:'',name:''};
        $scope.plant.plot_id = $rootScope.plotId;
        $scope.addPlant = function() {
            plotService.save($scope.plant, function (data) {
                $ionicPopup.alert({
                    title: 'Success',
                    template: 'success'
                });
                $state.go("app.plantList");
            }, function (error) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'There is a problem! Your request has not been fulfilled, please try again'
                });
            })
        }
    }]);
plantMainController.controller('editPlantController', ['$scope', '$http', '$stateParams', '$state', '$rootScope','plantService', '$ionicPopup',
    function ($scope, $http, $stateParams, $state, $rootScope,plotService, $ionicPopup) {
        if($rootScope.User==null){
            $state.go("app.login");
        }
        $scope.head = "Edit Plant";
        $scope.addPlant = false;
        $scope.editPlant = true;
        var id = $stateParams.id;
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plant/" + id).success(function (data) {
            $scope.plant = data;
            $scope.plant.DOB = new Date(data.DOB);
        });
        $scope.editPlant = function () {
            var answer = confirm("Do you want to update the plant?");
            if (answer) {
                //$http.put("/plot", $scope.plot).then(function () {
                plotService.update({id: $scope.plant.id}, $scope.plant, function () {
                        $ionicPopup.alert({
                            title: 'Success',
                            template: 'success'
                        });
                        $state.go("app.plantList");
                    }, function (error) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'There is a problem! Your request has not been fulfilled, please try again'
                        });
                    }
                );
            }
        }
    }]);

plantMainController.controller('viewPlantController', ['$scope', '$http', '$routeParams', '$location', '$rootScope','plantService',
    function ($scope, $http, $routeParams, $location, $rootScope,plotService) {
        if($rootScope.User==null){
            $location.path("login");
        }
        $rootScope.plantID = $routeParams.id;
        var id = $routeParams.id;
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plant/" + id).success(function (data) {
            $scope.plant = data;
        });
    }]);