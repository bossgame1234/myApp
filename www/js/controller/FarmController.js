/**
 * Created by Dell on 14/7/2558.
 */
'use strict';

var farmMainController = angular.module('farmMainController',['farmServices']);

farmMainController.controller('showFarmController',['$scope','$http','$rootScope','$state','farmService','ionicMaterialInk', '$ionicPopup','$timeout','ionicMaterialMotion',function($scope,$http, $rootScope,$state,farmService,ionicMaterialInk, $ionicPopup)
{
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(false);
    // Activate ink for controller
    ionicMaterialInk.displayEffect();
    if($rootScope.User==null){
        $state.go("app.login");
    }
        var data = farmService.query({'username': $rootScope.User.username},function(){
            $scope.farms = data;
        },function(error) {
            $ionicPopup.alert({
                title: 'Error',
                template: 'There is a problem! Your request has not been fulfilled, please try again'
            });
        });

       $scope.deleteFarm = function(id) {
           var answer = confirm('Do you want to delete the farm? \n*removing the farm will also remove its plots,plant,and devices');
           if(answer)
           {
               farmService.delete({id:id,username: $rootScope.User.username},function () {
                   $ionicPopup.alert({
                       title: 'Success',
                       template: 'Success'
                   });
                   $state.go($state.current, {}, {reload: true});
               }, function (error) {
                   $ionicPopup.alert({
                       title: 'Error',
                       template: 'There is a problem! Your request has not been fulfilled, please try again'
                   });
               })
           }
       };
       $scope.selectFarm= function(id,name){
        $rootScope.PlotName = null;
        $rootScope.plotId= null;
        $rootScope.SelectedPlot = false;
        $rootScope.DeviceId = null;
        $rootScope.Device_id = null;
        $rootScope.SelectedDevice = false;
           $rootScope.Latitude = 0;
           $rootScope.Longitude = 0;
           $rootScope.PlantId = null;
           $rootScope.plantName = null;
           $rootScope.SelectedPlant = false;
        if($rootScope.FarmId==id){
            $rootScope.FarmName = null;
            $rootScope.FarmId = null;
            $rootScope.SelectedFarm = false;
            $rootScope.Latitude = 0;
            $rootScope.Longitude = 0;

        }else {
            $rootScope.FarmName = name;
            $rootScope.FarmId = id;
            $rootScope.SelectedFarm = true;
            $http.get("http://projectlinux.cloudapp.net//MS4SF/public/index.php/farm/" + id).success(function (data) {
                $rootScope.Latitude = data.latitude;
                $rootScope.Longitude = data.longitude;
            })
        }
        }
}]);
farmMainController.controller('addFarmController',['$scope', '$http','$timeout','uiGmapLogger','rndAddToLatLon','uiGmapGoogleMapApi','$state', '$rootScope','farmService','$ionicPopup',
    function ($scope, $http,$timeout, $log, rndAddToLatLon,GoogleMapApi,$state, $rootScope,farmService,$ionicPopup) {
        if($rootScope.User==null){
            $state.go("app.login");
        }
        $scope.head = "Add Farm";
        $scope.addFarm = true;
        $scope.editFarm = false;
        $scope.farm = {latitude:'',longitude:'',description:'',name:'',address:'',username:''};
        $scope.farm.username = $rootScope.User.username;
        $scope.addFarm =function(){
        farmService.save($scope.farm,function(data) {
                $ionicPopup.alert({
                    title: 'Success',
                    template: 'success'
                });
            $state.go("app.farmList");
        },function(error) {
                $ionicPopup.alert({
                    title: 'Error!',
                    template: 'There is a problem! Your request has not been fulfilled, please try again'
                });
        }
        )
        };
        GoogleMapApi.then(function(maps) {
            maps.visualRefresh =true;

            $scope.defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(40.82148, -73.66450),
                new google.maps.LatLng(40.66541, -74.31715));
            $scope.map.bounds = {
                northeast: {
                    latitude:$scope.defaultBounds.getNorthEast().lat(),
                    longitude:$scope.defaultBounds.getNorthEast().lng()
                },
                southwest: {
                    latitude:$scope.defaultBounds.getSouthWest().lat(),
                    longitude:$scope.defaultBounds.getSouthWest().lng()
                }
            };
            $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
        });

        angular.extend($scope, {
            selected: {
                options: {
                    visible:false

                },
                templateurl:'window.tpl.html',
                templateparameter: {}
            },
            map: {
                control: {},
                center: {
                    latitude: 14.5623,
                    longitude: 100.6127
                },
                zoom: 6,
                dragging: false,
                bounds: {},
                markers: [],
                idkey: 'place_id',
                clickedMarker: {
                    id: 0,
                    options: {}
                },
                events: {
                    click: function (mapModel, eventName, originalEventArgs) {
                        var e = originalEventArgs[0];
                        var lat = e.latLng.lat(),
                            lon = e.latLng.lng();
                        $scope.farm.latitude =  e.latLng.lat();
                        $scope.farm.longitude =  e.latLng.lng();
                        $scope.map.clickedMarker = {
                            id: 0,
                            options: {
                                labelContent: 'You clicked here ' + 'lat: ' + lat + ' lon: ' + lon,
                                labelClass: "marker-labels",
                                labelAnchor: "50 0"
                            },
                            latitude: lat,
                            longitude: lon
                        };
                        //scope apply required because this event handler is outside of the angular domain
                        $scope.$apply();
                    },
                    idle: function (map) {
                    },
                    dragend: function(map) {
//update the search box bounds after dragging the map
                        var bounds = map.getBounds();
                        var ne = bounds.getNorthEast();
                        var sw = bounds.getSouthWest();
                        $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
//$scope.searchbox.options.visible = true;
                    }
                }
            },
            searchbox: {
                template: 'searchbox.tpl.html',
                options: {
                    autocomplete: true,
                    types: ['(cities)'],
                    componentRestrictions: {country: 'th'}
                },
                events: {
                    place_changed: function (autocomplete) {

                        var place = autocomplete.getPlace();

                        if (place.address_components) {

                            var newMarkers = [];
                            var bounds = new google.maps.LatLngBounds();

                            var marker = {
                                id: place.place_id,
                                place_id: place.place_id,
                                name: place.address_components[0].long_name,
                                latitude: place.geometry.location.lat(),
                                longitude: place.geometry.location.lng(),
                                options: {
                                    visible: false
                                },
                                templateurl: 'window.tpl.html',
                                templateparameter: place
                            };
                            $scope.farm.latitude =  place.geometry.location.lat();
                            $scope.farm.longitude =  place.geometry.location.lng();
                            newMarkers.push(marker);

                            bounds.extend(place.geometry.location);

                            $scope.map.bounds = {
                                northeast: {
                                    latitude: bounds.getNorthEast().lat(),
                                    longitude: bounds.getNorthEast().lng()
                                },
                                southwest: {
                                    latitude: bounds.getSouthWest().lat(),
                                    longitude: bounds.getSouthWest().lng()
                                }
                            };

                            _.each(newMarkers, function (marker) {
                                marker.closeClick = function () {
                                    $scope.selected.options.visible = false;
                                    marker.options.visble = false;
                                    return $scope.$apply();
                                };
                                marker.onClicked = function () {
                                    $scope.selected.options.visible = false;
                                    $scope.selected = marker;
                                    $scope.selected.options.visible = true;
                                };
                            });

                            $scope.map.markers = newMarkers;
                        } else {
                            console.log("do something else with the search string: " + place.name);
                        }
                    }
                }
                }});
            }]);
farmMainController.controller('editFarmController',['$scope', '$stateParams', '$http','$timeout','uiGmapLogger','rndAddToLatLon','uiGmapGoogleMapApi','$state', '$rootScope','farmService','$ionicPopup',
    function ($scope,$stateParams, $http,$timeout, $log, rndAddToLatLon,GoogleMapApi,$state, $rootScope,farmService,$ionicPopup) {
        if($rootScope.User==null){
            $state.go("app.login");
        }
        $scope.head = "Edit Farm";
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.editFarm = true;
        $scope.addFarm = false;
        $scope.farm = {latitude:'',longitude:'',description:'',name:'',address:''};
        var id = $stateParams.id;
        var x = null;
        var y = null;
        $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/farm/" + id).success(function (data) {
             x = data.latitude;
              y = data.longitude;
            $scope.farm = data;
            GoogleMapApi.then(function(maps) {
                angular.extend($scope, {
                    map: {
                        show: true,
                        control: {},
                        version: "unknown",
                        heatLayerCallback: function (layer) {
                            //set the heat layers backend dat
                            var mockHeatLayer = new MockHeatLayer(layer);
                        },
                        showTraffic: true,
                        showBicycling: false,
                        showWeather: false,
                        showHeat: false,
                        center: {
                            latitude: x,
                            longitude: y
                        },
                        options: {
                            streetViewControl: false,
                            panControl: false,
                            maxZoom: 20,
                            minZoom: 3
                        },
                        zoom: 7,
                        dragging: false,
                        bounds: {}
                    }});

                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: x,
                        longitude: y
                    },
                    options: { draggable: true },
                    events: {
                        dragend: function (marker, eventName, args) {
                            $log.log('marker dragend');
                            var lat = marker.getPosition().lat();
                            var lon = marker.getPosition().lng();
                            $scope.farm.latitude =  lat;
                            $scope.farm.longitude =  lon;
                            $scope.marker.options = {
                                draggable: true,
                                labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                                labelAnchor: "100 0",
                                labelClass: "marker-labels"
                            };
                        }
                    }
                };
            })
        }
        ).error(function() {
                $ionicPopup.alert({
                    title: 'Error!',
                    template: 'There is a problem! Your request has not been fulfilled, please try again'
                });
            }
        );
        $scope.editFarm =function() {
            var answer = confirm("Do you want to update the farm?");
            if (answer) {
                if(($scope.farm.latitude&&$scope.farm.longitude)!=null) {
                    $rootScope.Latitude = $scope.farm.latitude;
                    $rootScope.Longitude = $scope.farm.longitude;
                }
                farmService.update({id: $scope.farm.id}, $scope.farm, function (data) {
                        alert("success");
                        $ionicPopup.alert({
                            title: "Success",
                            template: "success"
                        });
                        $state.go("app.farmList");
                    }, function (error) {
                        $ionicPopup.alert({
                            title: 'Error!',
                            template: 'There is a problem! Your request has not been fulfilled, please try again'
                        });
                    }
                )
            }
        };
    }]);
farmMainController.controller('viewFarmController',['$scope', '$routeParams', '$http','$timeout','uiGmapLogger','rndAddToLatLon','uiGmapGoogleMapApi','$location', '$rootScope','farmService',
    function ($scope,$routeParams, $http,$timeout, $log, rndAddToLatLon,GoogleMapApi,$location, $rootScope,farmService) {
        $rootScope.FarmId = $routeParams.id;
        $rootScope.plotManagement = true;
        $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/farm/" + $rootScope.FarmId).success(function (data) {
                $scope.farm = data;
                $scope.encoding = data.id*100+1+2*10000+3*100000;
                GoogleMapApi.then(function(maps) {
                    angular.extend($scope, {
                        map: {
                            show: true,
                            control: {},
                            version: "unknown",
                            heatLayerCallback: function (layer) {
                                //set the heat layers backend dat
                                var mockHeatLayer = new MockHeatLayer(layer);
                            },
                            showTraffic: true,
                            showBicycling: false,
                            showWeather: false,
                            showHeat: false,
                            center: {
                                latitude: $scope.farm.latitude,
                                longitude: $scope.farm.longitude
                            },
                            options: {
                                streetViewControl: false,
                                panControl: false,
                                maxZoom: 20,
                                minZoom: 3
                            },
                            zoom: 7,
                            dragging: false,
                            bounds: {}
                        }});

                    $scope.marker = {
                        id: 0,
                        coords: {
                            latitude: $scope.farm.latitude,
                            longitude: $scope.farm.longitude
                        }
                    };
                })
            }
        ).error(function() {
                alert("There is a problem! Your request has not been fulfilled, please try again");
            }
        );
    }]);


