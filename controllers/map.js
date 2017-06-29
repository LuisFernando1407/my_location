'use strict';

angular.module('mymap', [])

.run(function($rootScope, $http) {
  var mymap = L.map('mapid', {doubleClickZoom: false}).locate({setView: true, maxZoom: 16});

  /* Pega a localização atual e marca no mapa*/
  navigator.geolocation.getCurrentPosition(function (position) {
    var latit = position.coords.latitude;
    var longit = position.coords.longitude;
    
    $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latit + ',' + longit + '&sensor=false')
    .then(function(response) {      
      L.marker([latit, longit]).addTo(mymap).bindPopup(response.data.results[0].formatted_address);
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoibmV0b2Rlb2xpbm8iLCJhIjoiY2o0ZXIyNXUyMHpmZDMybmhuNnpiYjFxMCJ9.3mwnpcXamZQTmFNL6ptRxw', {
     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'sk.eyJ1IjoibmV0b2Rlb2xpbm8iLCJhIjoiY2o0ZXIyNXUyMHpmZDMybmhuNnpiYjFxMCJ9.3mwnpcXamZQTmFNL6ptRxw'
    }).addTo(mymap);

    var current_position, line;
    function onMapClick(e) {
      var lat = e.latlng.lat;
      var log = e.latlng.lng;

      if (current_position) {
        mymap.removeLayer(current_position);
        mymap.removeLayer(line);

      }
      
      $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + log + '&sensor=false')
      .then(function(response) {      
        current_position = L.marker([lat, log]).addTo(mymap).bindPopup(response.data.results[0].formatted_address);
      });

      var coords = [
        L.latLng(latit, longit),
        L.latLng(lat, log)
      ];
    
      var options = {
        showAll: 11, 
        offset: 100,
        cssClass: 'some-other-class',
        iconSize: [16, 16],
        lazy: true
      };

      line = L.polyline(coords, {distanceMarkers: options});
      line.on('mouseover', line.addDistanceMarkers);
      console.log(line.addDistanceMarkers);
      mymap.fitBounds(line.getBounds());
      mymap.addLayer(line);
    }
   
    mymap.on('click', onMapClick);
  });
});