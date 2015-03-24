(function() {
  "use strict";

  var app = angular.module('app', []);

  app.controller('EarthViewController', function() {

    this.view = 2;

    this.isSet = function(value) {
      return this.view == value;
    };

  });

}());
