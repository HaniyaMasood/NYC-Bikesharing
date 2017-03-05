
angular.module('webApp.services').factory('dataService',['$http', function ($http) {
    return{
        /*--------------Explorer-------------------*/
        get : function () {
            var url='/Data/';
            return $http.get(url);
        }
    }
}]);
