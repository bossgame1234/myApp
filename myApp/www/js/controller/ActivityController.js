/**
 * Created by USER on 10/16/2015.
 */
var activityMainController = angular.module('activityMainController',['activityServices']);
activityMainController.controller('addActivityController',['$scope', '$http','$state', '$rootScope','activityService','$filter',
    function ($scope, $http,$state, $rootScope,activityService,$filter) {
        if($rootScope.User==null){
            $state.go('app.login');
        }
        if($rootScope.FarmId==null){
            $state.go('app.farmList');
        }
        $scope.editActivity = false;
        $scope.activity = {
            username : $rootScope.User.username
        };
        $scope.activity.type = new Array();
        $scope.plot_id = 0;
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plot/" + $rootScope.FarmId+"/edit").success(function (data) {
        $scope.plots = data;
        $scope.loadPlot = true;
        });

        $scope.savePlotID = function(id) {
                $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plant/" + id + "/edit").success(function (data) {
                    $scope.plants = data;
                    $scope.loadPlant = true;
                });
        };

        $scope.activity.date =  new Date("MM/dd/yyyy");
        $scope.activity.time =  new Date("HH:mm:ss");
        var url = 'http://api.openweathermap.org/data/2.5/weather';
        if($rootScope.Latitude!=undefined){
            $http.jsonp(url, {
                params: {
                    lat: $rootScope.Latitude.toString(),
                    lon: $rootScope.Longitude.toString(),
                    appid: "bcc93ef623451d89172784421e454ee0",
                    callback: 'JSON_CALLBACK'
                }
            }).
                success(function (data, status, headers, config) {
                    $scope.activity.weather = data.weather[0].description;
                }).
                error(function (data, status, headers, config) {
                    // Log an error in the browser's console.
                    console.log('Could not retrieve data from ' + url);
                });
        }
        $scope.tillingCheck = function(){
            if(!$rootScope.tillingSelected) {
                $scope.activity.type[0] = 1;
                $rootScope.tillingSelected = true;
            }else{
                $scope.activity.type[0] = 0;
                $rootScope.tillingSelected = false;
            }
        };
        $scope.plantingCheck = function(){
            if(!$rootScope.plantingSelected) {
                $scope.activity.type[1] = 2;
                $rootScope.plantingSelected = true;
            }else{
                $scope.activity.type[1] = 0;
                $rootScope.plantingSelected = false;
            }
        };
        $scope.pruningCheck = function(){
            if(!$rootScope.pruningSelected) {
                $scope.activity.type[2] = 3;
                $rootScope.pruningSelected = true;
            }else{
                $scope.activity.type[2] = 0;
                $rootScope.pruningSelected= false;
            }
        };
        $scope.harvestingCheck = function(){
            if(!$rootScope.harvestingSelected) {
                $scope.activity.type[3] = 4;
                $rootScope.harvestingSelected = true;
            }else{
                $scope.activity.type[3] = 0;
                $rootScope.harvestingSelected = false;
            }
        };
        $scope.fertilizingCheck = function(){
            if(!$rootScope.fertilizingSelected) {
                $scope.activity.type[4] = 5;
                $rootScope.fertilizingSelected = true;
            }else{
                $scope.activity.type[4] = 0;
                $rootScope.fertilizingSelected = false;
            }
        };

        $scope.wateringCheck = function(){
            if(!$rootScope.wateringSelected) {
                $scope.activity.type[5] = 6;
                $rootScope.wateringSelected = true;
            }else{
                $scope.activity.type[5] = 0;
                $rootScope.wateringSelected = false;
            }
        };
        $scope.scoutingCheck = function(){
            if(!$rootScope.scoutingSelected) {
                $scope.activity.type[6] = 7;
                $rootScope.scoutingSelected = true;
            }else{
                $scope.activity.type[6] = 0;
                $rootScope.scoutingSelected = false;
            }
        };
       $scope.addActivity = function(flowFiles){
           console.log($scope.activity.date);
           activityService.save($scope.activity,function(data){
               flowFiles.opts.target = 'http://'+$rootScope.hostname+'/MS4SF/public/index.php/uploadPicture';
               flowFiles.opts.testChunks = false;
               flowFiles.opts.query ={id:data.id,mode:'activity'};
               flowFiles.upload();
               alert("Success");
               $state.go("app.activityTimeline");
           },function(error){
               if(error.status=="500"){
                   alert("There is a problem! Your request has not been fulfilled, please try again \n ERROR : Please input all information");
               }
           });
       }
    }]);
activityMainController.controller('editActivityController', ['$scope', '$http', '$routeParams', '$location', '$rootScope','activityService','$filter',
    function ($scope, $http, $routeParams, $location, $rootScope,activityService,$filter) {
        $scope.editActivity = true;
        if($rootScope.User==null){
            $location.path("login");
        }
        $('#date-container input').datepicker({
            endDate: "today"
        }).on('changeDate', function(e) {
            $scope.activity.date = $filter('date')(e.date,"MM/dd/yyyy"); // `e` here contains the extra attributes
        });
        $('#timepicker').timepicker({
            minuteStep: 1,
            template: 'modal',
            appendWidgetTo: 'body',
            showSeconds: true,
            showMeridian: false,
            defaultTime: false
        });
        $http.get('http://'+$rootScope.hostname+'/MS4SF/public/index.php/activity/'+$routeParams.id).success(function(data){
            $scope.activity = data;
         //   $scope.activity.date =  $filter('date')(data.date,"MM/dd/yyyy");
            $scope.activity.type = new Array();
            if( $scope.activity!=undefined) {
                for (var i = 0; i < data.activity_type.length; i++) {
                    switch (data.activity_type[i].id) {
                        case 1:
                            $scope.activity.type[0] = 1;
                            $rootScope.tillingSelected = true;
                            break;
                        case 2:
                            $scope.activity.type[1] = 2;
                            $rootScope.plantingSelected = true;
                            break;
                        case 3:
                            $scope.activity.type[2] = 3;
                            $rootScope.pruningSelected = true;
                            break;
                        case 4:
                            $scope.activity.type[3] = 4;
                            $rootScope.harvestingSelected = true;
                            break;
                        case 5:
                            $scope.activity.type[4] = 5;
                            $rootScope.fertilizingSelected = true;
                            break;
                        case 6:
                            $scope.activity.type[5] = 6;
                            $rootScope.wateringSelected = true;
                            break;
                        case 7:
                            $scope.activity.type[6] = 7;
                            $rootScope.scoutingSelected = true;
                            break;
                    }
                }
            }
        }).error(function(error){
            if(error.status=="500"){
                alert("There is a problem! Your request has not been fulfilled, please try again \n ERROR : Please input all information");
            }
        });
        $scope.editActivity = function(flowFiles){
            var answer = confirm("Do you want to update activity?");
            if(answer) {
                activityService.update({id: $scope.activity.id}, $scope.activity, function (data) {
                    flowFiles.opts.target = 'http://'+$rootScope.hostname+'/MS4SF/public/index.php/uploadPicture';
                    flowFiles.opts.testChunks = false;
                    flowFiles.opts.query = {id: data.id, mode: 'activity'};
                    flowFiles.upload();
                    $location.path("timeLineActivity");
                    alert("success");
                },function(error){
                    if(error.status=="500"){
                        alert("There is a problem! Your request has not been fulfilled, please try again \n ERROR : Please input all information");
                    }
                })
            }
        };
        $scope.tillingCheck = function(){
            if(!$rootScope.tillingSelected) {
                $scope.activity.type[0] = 1;
                $rootScope.tillingSelected = true;
            }else{
                $scope.activity.type[0] = 0;
                $rootScope.tillingSelected = false;
            }
        };
        $scope.plantingCheck = function(){
            if(!$rootScope.plantingSelected) {
                $scope.activity.type[1] = 2;
                $rootScope.plantingSelected = true;
            }else{
                $scope.activity.type[1] = 0;
                $rootScope.plantingSelected = false;
            }
        };
        $scope.pruningCheck = function(){
            if(!$rootScope.pruningSelected) {
                $scope.activity.type[2] = 3;
                $rootScope.pruningSelected = true;
            }else{
                $scope.activity.type[2] = 0;
                $rootScope.pruningSelected= false;
            }
        };
        $scope.harvestingCheck = function(){
            if(!$rootScope.harvestingSelected) {
                $scope.activity.type[3] = 4;
                $rootScope.harvestingSelected = true;
            }else{
                $scope.activity.type[3] = 0;
                $rootScope.harvestingSelected = false;
            }
        };
        $scope.fertilizingCheck = function(){
            if(!$rootScope.fertilizingSelected) {
                $scope.activity.type[4] = 5;
                $rootScope.fertilizingSelected = true;
            }else{
                $scope.activity.type[4] = 0;
                $rootScope.fertilizingSelected = false;
            }
        };

        $scope.wateringCheck = function(){
            if(!$rootScope.wateringSelected) {
                $scope.activity.type[5] = 6;
                $rootScope.wateringSelected = true;
            }else{
                $scope.activity.type[5] = 0;
                $rootScope.wateringSelected = false;
            }
        };
        $scope.scoutingCheck = function(){
            if(!$rootScope.scoutingSelected) {
                $scope.activity.type[6] = 7;
                $rootScope.scoutingSelected = true;
            }else{
                $scope.activity.type[6] = 0;
                $rootScope.scoutingSelected = false;
            }
        };
    }]);
activityMainController.controller('timeLineActivityController', ['$scope', '$http', '$state', '$rootScope','$filter','activityService','ionicMaterialMotion','ionicMaterialInk','$timeout',
    function ($scope, $http, $state, $rootScope,$filter,activityService,ionicMaterialMotion,ionicMaterialInk,$timeout) {
        $scope.toDay =  $filter('date')(new Date(),"yyyy-MM-dd");
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.$parent.setHeaderFab('right');
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(false);
        // Activate ink for controller
        ionicMaterialInk.displayEffect();
        // Activate ink for controller

        $scope.tillingCount =0;
        $scope.plantingCount =0;
        $scope.pruningCount =0;
        $scope.harvestingCount =0;
        $scope.fertilizingCount=0;
        $scope.wateringCount=0;
        $scope.scoutingCount=0;
        $scope.check =false;
        if($rootScope.User==null){
            $state.go('app.login');
        }
        $scope.showError= false;
        if($rootScope.FarmId==null){
            $scope.showError = true;
        }
        $http.get('http://'+$rootScope.hostname+'/MS4SF/public/index.php/activity?farmID='+$rootScope.FarmId).success(function(data){
            $scope.activities = data;
            $timeout(function() {
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.animate-fade-slide-in .item'
                });
            }, 400);
        }).error(
            function(error){
                if(error.status=="500"){
                    alert("There is a problem! Your request has not been fulfilled, please try again");
                }
            }
        );
        Date.prototype.withoutTime = function () {
            var d = new Date(this);
            d.setHours(0, 0, 0, 0);
            return d
        };
        $scope.deleteActivity  =function(activityID){
            var answer = confirm("Do you want to delete the activity?");
            if (answer) {
                activityService.delete({id:activityID},function(){
                    alert("Success");
                    $state.go('app.activityTimeline',{},{reload:true});
                }, function (error) {
                    alert("There is a problem! Your request has not been fulfilled, please try again");
                })
            }
        };
        $scope.remotion = function(){
            $timeout(function() {
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.animate-fade-slide-in .item'
                });
            }, 400);
        };
    }]);
