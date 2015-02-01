(function() {
  var ctx = null;

  var earthCenter = {};
  var earthRadius = null;

  var satellites = [];

  var delta = 0; // to correct the discretization problem

  var orbiteAngle = {
    X: 0,
    Y: 0,
    Z: 0
  }

  window.initCanvasDrawingSettings = function() {
    ctx = cnv.getContext('2d');

    /*

    Y_
    |\
      \
       \------> X
       |
       |
       |
       V
       Z

    */

    earthCenter.X = cnv.width / 2;
    earthCenter.Y = 0;
    earthCenter.Z = cnv.height / 2;

    earthRadius = 50;

    delta = 0.01;

    getSatellitesInfo();
  }

  function getSatellitesInfo() {
    // AJAX or WebSockets

    var params = {
      width: 1,
      height: 1,
      orbRadius: 180
    }

    createSatellites(0, params);
  }

  function createSatellites(id, params) {
    satellites.push(new Satellite(id, params));
    drawSatellites(0, 0);
  }

  window.drawSatellites = function(deltaAngleX, deltaAngleZ) {
    orbiteAngle.X += deltaAngleX;
    orbiteAngle.Z += deltaAngleZ;

    for (var i = 0; i < satellites.length; ++i) {
      satellites[i].orbitImg = ctx.createImageData(cnv.width, cnv.height);

      setSatellitePixels(satellites[i].params.orbRadius,
      satellites[i].orbitImg.data);

      ctx.putImageData(satellites[i].orbitImg, 0, 0);
    }
  }

  function setSatellitePixels(orbRadius, orbPixelsArr) {
    // is it required to use setTimeout in drawing process?

    var semiaxises = {};

    calculateParams(orbRadius, semiaxises);

    var arrIdx = 0;

    for (var i = 0; i < cnv.height; ++i) {

      if (i < earthCenter.Z - orbRadius || i > earthCenter.Z + orbRadius )
        continue;

      for (var j = 0; j < cnv.width; ++j) {

        if (j < earthCenter.X - orbRadius || j > earthCenter.X + orbRadius)
          continue;

        var tmp = Math.pow(j - earthCenter.X, 2) / Math.pow(semiaxises.a, 2) +
                  Math.pow(i - earthCenter.Z, 2) / Math.pow(semiaxises.b, 2);

        if (tmp < 1 - delta || tmp > 1 + delta) continue;

        arrIdx = (i * cnv.width + j) * 4;

        orbPixelsArr[arrIdx] = 0;
        orbPixelsArr[arrIdx + 1] = 255;
        orbPixelsArr[arrIdx + 2] = 0;
        orbPixelsArr[arrIdx + 3] = 255;
      }
    }
  }

  function calculateParams(orbRadius, semiaxises) {
    // X, Z rotate

    semiaxises.b = orbRadius * Math.cos(orbiteAngle.X);
    semiaxises.a = orbRadius * Math.cos(orbiteAngle.Z);
  }

  function Satellite(id, params) {
    Object.defineProperty(this, "id", {
      value: id,
      writable: false
    });

    this.params = params;
    this.img = ctx.createImageData(params.width, params.height);
    this.orbitImg = ctx.createImageData(cnv.width, cnv.height);
  }

}());
