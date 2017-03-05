
var APIFetchController = angular.module('APIFetchController', []);

APIFetchController.controller('dashboardCtrl', ['$scope', '$timeout','dataService','$interval', function ($scope, $timeout,dataService,$interval) {

   dataService.get().success(function(res){
       if(res.data==null) alert("Unable to fetch data from server");
       else {
           var capacity = 0; var usage = 0
           $scope.staticData = JSON.parse(res.data.staticData)
           $scope.dynamicData = JSON.parse(res.data.dynamicData)


           //=========================================gis===============================================================================
           var grayscale = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
               id: 'MapID1',
               attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
               '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
               'Imagery © <a href="http://mapbox.com">Mapbox</a>'
           });
           var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
           });
           var map = L.map('map1', {
               center: [$scope.staticData.data.stations[10].lat, $scope.staticData.data.stations[10].lon],
               zoom: 15,
               layers: [CartoDB_DarkMatter]
           });
           L.control.fullscreen({
               position: 'bottomright',
               title: 'Show me the fullscreen !',
               forceSeparateButton: true,
               forcePseudoFullscreen: true
           }).addTo(map);

           $(".leaflet-control-zoom-fullscreen").click(function () {
               if (map._isFullscreen) {
                   $(".content-wrap").addClass("leaflet-map-full-screen-adjustment");
                   $("#sidebar, .page-controls").addClass("hide");
               } else {
                   $(".content-wrap").removeClass("leaflet-map-full-screen-adjustment");
                   $("#sidebar, .page-controls").removeClass("hide");
               }
           })

           var geojsonMarkerWithNoAvailableBikes = {radius: 4, fillColor: "#f03434", color: "#f03434", weight: 1, opacity: 1, fillOpacity: 1};
           var geojsonMarkerWith50Avialable = {radius: 4, fillColor: "#f16d35", color: "#f16d35", weight: 1, opacity: 1, fillOpacity: 1};
           var geojsonMarkerWith75Available = {radius: 4, fillColor: "#37ef33", color: "#37ef33", weight: 1, opacity: 1, fillOpacity: 1};
           $scope.circleMarkers = [];
           $scope.currentUsage = []
           $scope.showCircleMarkers = function () {

               for (var i in $scope.staticData.data.stations) {

                   var latlng = L.latLng($scope.staticData.data.stations[i].lat, $scope.staticData.data.stations[i].lon);
                   $scope.currentUsage.push({
                       name: $scope.staticData.data.stations[i].name,
                       capacity: $scope.staticData.data.stations[i].capacity,
                       usage: ($scope.staticData.data.stations[i].capacity - $scope.dynamicData.data.stations[i].num_bikes_available)
                   })
                   capacity = capacity + $scope.currentUsage[i].capacity;
                   usage = usage + $scope.currentUsage[i].usage;
                   var radius = 4;
                   if ($scope.dynamicData.data.stations[i].num_bikes_available == 0) L.circleMarker(latlng, geojsonMarkerWithNoAvailableBikes).setRadius(radius).addTo(map);
                   if ((($scope.dynamicData.data.stations[i].num_bikes_available / $scope.staticData.data.stations[i].capacity) * 100) < 50) L.circleMarker(latlng, geojsonMarkerWith50Avialable).setRadius(radius).addTo(map);
                   if ((($scope.dynamicData.data.stations[i].num_bikes_available / $scope.staticData.data.stations[i].capacity) * 100) > 75) L.circleMarker(latlng, geojsonMarkerWith75Available).setRadius(radius).addTo(map);


               }
           };
           $scope.showCircleMarkers();
           $scope.calculateDistance = function (name, meters) {
               $scope.smartMapDataLayer = [];
               $scope.smartMarkersGroup = undefined;
               var station = _.findWhere($scope.staticData.data.stations, {name: name});
               if (typeof station == 'undefined')   alert("Station Name does not exist in data")
               else {
                    var fPoint = L.latLng(station.lat, station.lon);
                   _.each($scope.staticData.data.stations, function (a) {
                       if (a.name != name) {

                           var dis = fPoint.distanceTo(L.latLng(a.lat, a.lon));
                           if (dis < meters) {
                               try {
                                   var latlngs = L.marker([a.lat, a.lon])
                                   $scope.smartMapDataLayer.push(latlngs);

                               }
                               catch (ex) {
                                   alert("Please enter a larger value for KM")
                                   return;
                               }
                           }


                       }

                       $scope.smartMarkersGroup = L.featureGroup($scope.smartMapDataLayer).addTo(map);
                       window.setTimeout(function () {
                           map.fitBounds($scope.smartMarkersGroup.getBounds())._zoom;
                       }.bind(this), 1000);
                   });

               }
           };
           $scope.applyDistanceQuery = function (query) {
               var token = query.split(',');
               var km = parseFloat(token[1]);
               var meters = km * 1000;
               if (token.length == 2 && token[0] != '' && parseFloat(token[1]) > 0) $scope.calculateDistance(token[0], meters);
               else alert("Please enter input according to the given format")

           }
           $scope.clearQueryData = function () {
               if ($scope.smartMarkersGroup != undefined) {
                   map.removeLayer($scope.smartMarkersGroup);
               }
           }


           ///////////////charts////////////
           var config_bar = {
               data: $scope.currentUsage,
               xkey: 'name',
               ykeys: ['capacity'],
               labels: ['Current Usage'],
               fillOpacity: 0.6,
               hideHover: 'auto',
               parseTime: false,
               behaveLikeLine: true,
               resize: true,
               pointFillColors: ['#ffffff'],
               pointStrokeColors: ['black'],
               lineColors: ['blue', 'red']
           };
           config_bar.element = 'bar-chart';
           Morris.Bar(config_bar);

           Morris.Donut({
               element: 'pie-chart',
               data: [
                   {
                       label: "Current Usage",
                       value: ((usage / capacity) * 100).toFixed(2)
                   },
                   {
                       label: "Available",
                       value: (100 - ((usage / capacity) * 100)).toFixed(2)
                   }

               ],
               fillOpacity: 0.1,
               colors: ['lightgreen', 'LightSkyBlue', 'LightCoral', 'DarkSeaGreen', 'LightSalmon']
           });
       }

                })


    $interval( function(){
        dataService.get().success(function(res){
            $scope.staticData = JSON.parse(res.data.staticData)
            $scope.dynamicData = JSON.parse(res.data.dynamicData) ;
            //$scope.$apply()
        })
    }, 10000, true);


}]);



