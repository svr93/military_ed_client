(function() {
  "use strict";

  var containerEl = document.getElementsByClassName('container')[0];
  var containerElStyle = getComputedStyle(containerEl);

  var containerElWidth = parseInt(containerElStyle.width);
  var containerElHeight = parseInt(containerElStyle.height);

  var app = angular.module('app', []);

  app.controller('EarthViewController', function() {

    this.view = 3;

    this.isSet = function(value) {
      return this.view == value;
    };

    /**
     * Sets Cesium canvas size when appropriate view is active.
     */
    this.onCesiumViewActive = function() {

        var csContainerEl = document.getElementById('cesiumContainer');
        var csCanvasEl = csContainerEl.getElementsByTagName('canvas')[0];

        if (!csCanvasEl) { return; }

        csCanvasEl.width = containerElWidth;
        csCanvasEl.height = containerElHeight;
    };
  });

}());
