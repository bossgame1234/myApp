var loginService = angular.module('loginServices',['ngResource']);
loginService.factory('loginService',function($resource){
    return $resource('http://projectlinux.cloudapp.net/MS4SF/public/index.php?api/authenticate/:id', { id: '@_id'}, {
        update: {
            method: 'PUT' // this method issues a PUT request
        },
        save:{
            method :'POST',
            _method: 'PATCH',
            headers :{Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEwLCJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL01TNFNGXC9wdWJsaWNcL2luZGV4LnBocFwvYXBpXC9hdXRoZW50aWNhdGUiLCJpYXQiOiIxNDQ3NTAyODQwIiwiZXhwIjoiMTQ0NzUwNjQ0MCIsIm5iZiI6IjE0NDc1MDI4NDAiLCJqdGkiOiI0ODk3NTUwYjAxN2YxODNlOTlkM2NhN2MwNTc5M2UwZSJ9.DNqA3j_96tLK01Y4wsI6vfAj0a3_t-xFW0Xg9H8b5Mc'}
        }
    });
});
//
//$http.jsonp(url, { params : {
//    lat : $rootScope.Latitude.toString(),
//    lon : $rootScope.Longitude.toString(),
//    appid : "bd82977b86bf27fb59a04b61b657fb6f",
//    callback: 'JSON_CALLBACK'
//}}).
//    success(function(data, status, headers, config) {
//        $scope.weather = data;
//        if($scope.weather.sys.country=="TH"){
//            $scope.weather.sys.country="Thailand";
//        }
//    }).
//    error(function(data, status, headers, config) {
//        // Log an error in the browser's console.
//        $log.error('Could not retrieve data from ' + url);
//    });