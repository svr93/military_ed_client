(function() {
  "use strict";

  var ctx = null;

  var img = new Image();
  var imgWidth = 0;
  var imgHeight = 0;

  img.onload = function() {

    imgWidth = img.width;
    imgHeight = img.height;
  };

  img.src = "img/satellite.png";

  var objects = [ // temporary values; values be sorted for proper visibility
    {
      radial_distance: 42371000,
      polar_angle: 0,
      azimuth_angle: Math.PI / 2
    },
    {
      radial_distance: 6523810,
      polar_angle: 0,
      azimuth_angle: Math.PI / 3
    },
    {
      radial_distance: 6493710,
      polar_angle: 0,
      azimuth_angle: Math.PI / 4
    }
  ];

  var EARTH_AVG_RADIUS = 6371000; // meters

  var coeff = null;

  window.drawSatellites = function (cnv, earthCurrPos, scale) {

    // getCoords();

    ctx = ctx || cnv.getContext("2d");

    for (var i = 0; i < 1; ++i) { // temporary

      coeff = objects[i].radial_distance / EARTH_AVG_RADIUS;

      var orbDiameter = coeff * cnv.width * scale;
      var initialShift = (cnv.width - orbDiameter) / 2;

      var satStaticPos = ((objects[i].azimuth_angle + Math.PI) /
                          (2 * Math.PI)) * 100; // "%"

      var satDinamicPos = (earthCurrPos + satStaticPos) % 100; // "%"

      if (satDinamicPos > 50) { // back side

        var delta = ((objects[i].radial_distance - EARTH_AVG_RADIUS) /
                      objects[i].radial_distance) * 100 / 4;

        var visibilityShift = 1.2; // "%", need correct (use img.width value)

        if (satDinamicPos > 50 + (delta - visibilityShift) && 
            satDinamicPos < 100 - (delta - visibilityShift)) return;

        satDinamicPos = 100 - satDinamicPos;
      }

      var horCnvPos = (initialShift + (satDinamicPos / 100) * 
                       coeff * (cnv.width * 2) * scale);

      var vertCnvPos = cnv.height / 2;

      ctx.drawImage(img, horCnvPos - imgWidth / 2 | 0,
                         vertCnvPos - imgHeight / 2 | 0);
    }
  };

}());
