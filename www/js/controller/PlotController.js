/**
 * Created by USER on 7/15/2015.
 */
'use strict';

var plotMainController = angular.module('plotMainController',['plotServices']);
plotMainController.controller('listPlotController', ['$scope', '$http', '$state', '$rootScope','plotService', '$ionicPopup',
    function ($scope, $http, $state, $rootScope,plotService,$ionicPopup) {
        if($rootScope.User==null){
            $state.go('app.login');
        }
        $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/plot/" + $rootScope.FarmId+"/edit").success(function (data) {
            $scope.plots = data;
        });
        $scope.deletePlot = function(id){
            var answer = confirm("Do you want to delete the plot? \n*removing the plot will also remove its plants and devices");
            if (answer) {
                plotService.delete({id:id},function(data){
                    $ionicPopup.alert({
                        title: 'Success',
                        template: 'success'
                    });
                }).
                    error(function(data) {
                        $ionicPopup.alert({
                            title: 'Error!',
                            template: 'There is a problem! Your request has not been fulfilled, please try again'
                        });
                    });
            }
        };
        $scope.selectPlot= function(id,name){
            $rootScope.DeviceId = null;
            $rootScope.Device_id = null;
            $rootScope.SelectedDevice = false;
            $rootScope.PlantId = null;
            $rootScope.plantName = null;
            $rootScope.SelectedPlant = false;
            if( $rootScope.plotId==id){
                $rootScope.PlotName = null;
                $rootScope.plotId = null;
                $rootScope.SelectedPlot = false;
            }else {
                $rootScope.PlotName = name;
                $rootScope.plotId = id;
                $rootScope.SelectedPlot = true;
            }
        }
    }]);
plotMainController.controller('addPlotToFarmController',['$scope', '$http','$state', '$rootScope','plotService','$ionicPopup',
    function ($scope, $http,$state, $rootScope,plotService,$ionicPopup) {
        if($rootScope.User==null){
            $state.go("app.login");
        }
        if($rootScope.FarmId==null){
            $state.go("app.farmList")
        }
        $scope.head = "Add Plot";
        $scope.addPlot = true;
        $scope.editPlot = false;
        $scope.plot = {farm_id:'',description:'',DOB:'',name:''};
        $scope.plot.farm_id = $rootScope.FarmId;
        $scope.addPlot = function() {
            plotService.save($scope.plot, function (data) {
                $ionicPopup.alert({
                    title: 'Success',
                    template: 'success'
                });
                $state.go("app.PlotList");
            }, function (error) {
                $ionicPopup.alert({
                    title: 'Error!!',
                    template: 'There is a problem! Your request has not been fulfilled, please try again'
                });
            })
        }
    }]);
plotMainController.controller('editPlotController', ['$scope', '$http', '$stateParams', '$state', '$rootScope','plotService','$ionicPopup',
    function ($scope, $http, $stateParams, $state, $rootScope,plotService,$ionicPopup) {
        if($rootScope.User==null){
            $state.go('app.login');
        }
        $scope.head = "Edit Plot";
        $scope.addPlot = false;
        $scope.editPlot = true;
        var id = $stateParams.id;
        $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/plot/" + id).success(function (data) {
            $scope.plot = data;
            $scope.plot.DOB = new Date(data.DOB);
        });

        $scope.editPlot = function () {
            var answer = confirm("Do you want to update the plot?");
            if (answer) {
                //$http.put("/plot", $scope.plot).then(function () {
                plotService.update({id: $scope.plot.id}, $scope.plot, function () {
                        $ionicPopup.alert({
                            title: 'Success',
                            template: 'success'
                        });
                        $state.go('app.plotList');
                    }, function (error) {
                        $ionicPopup.alert({
                            title: 'Error!',
                            template: 'There is a problem! Your request has not been fulfilled, please try again'
                        });
                    }
                );
            }
        }
    }]);

plotMainController.controller('viewPlotController', ['$scope', '$http', '$routeParams', '$location', '$rootScope','plotService',
    function ($scope, $http, $routeParams, $location, $rootScope,plotService) {
        if($rootScope.User==null){
            $location.path("login");
        }
        var id = $routeParams.id;
        $rootScope.plotId = id;
        $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/plot/" + id).success(function (data) {
            $scope.plot = data;
        });
    }]);