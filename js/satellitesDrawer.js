(function() {
  var primaryCtx = null;

  var slaveCnv = null;
  var slaveCtx = null;

  var earthCenter = {};

  var satellites = [];

  var delta = null; // to correct the discretization problem

  window.initSatellitesDrawingSettings = function() {
    stlCnv.width = 600;
    stlCnv.height = 400;
    primaryCtx = stlCnv.getContext("2d");

    slaveCnv = document.createElement("canvas");
    slaveCnv.width = stlCnv.width;
    slaveCnv.height = stlCnv.height;
    slaveCtx = slaveCnv.getContext("2d");

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

    earthCenter.X = stlCnv.width / 2;
    earthCenter.Z = stlCnv.height / 2;

    delta = 0.01;

    getSatellitesInfo(); // setInterval
  }

  function getSatellitesInfo() {
    console.log("Получаем параметры...");
    var params = {};

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (this.readyState != 4 || this.status != 200) return;

      console.log("Параметры приняты...");
      // temporary !!!
      params.orbRadius = this.response[0].height / 5000 | 0;
      params.img = new Image();
      params.img.src = "img/satellite.png";

      var id = this.response[0].id;

      satellites.length = 0;
      createSatellite(id, params);
    }

    xhr.open("GET", "/info");
    xhr.send();
  }

  function createSatellite(id, params) {
    var stl = new Satellite(id, params);
    satellites.push(stl);
    drawSatellite(0, 0, 0, stl);
  }

  window.drawSatellite = 
  function(orbAngleXDelta, orbAngleYDelta, orbAngleZDelta, satellite) {

    satellite = satellite || satellites[satellites.length - 1]; // temporary

    satellite.orb.angles.X += orbAngleXDelta;
    satellite.orb.angles.Y += orbAngleYDelta;
    satellite.orb.angles.Z += orbAngleZDelta;

    satellite.orb.imgData = 
    slaveCtx.createImageData(slaveCnv.width, slaveCnv.height);

    setSatelliteOrbPixels(satellite);
    slaveCtx.putImageData(satellite.orb.imgData, 0, 0);

    setSatelliteImg(satellite);

    primaryCtx.save();
    primaryCtx.clearRect(0, 0, stlCnv.width, stlCnv.height);
    primaryCtx.translate(stlCnv.width / 2, stlCnv.height / 2);
    primaryCtx.rotate(satellite.orb.angles.Y);
    primaryCtx.drawImage(slaveCnv, -stlCnv.width / 2, -stlCnv.height / 2);
    primaryCtx.restore();
  }

  function setSatelliteOrbPixels(satellite) {
    calculateParams(satellite);

    var arrIdx = null;

    var h = slaveCnv.height;
    var w = slaveCnv.width;

    var lowLimitZ = earthCenter.Z - satellite.orb.radius;
    var highLimitZ = earthCenter.Z + satellite.orb.radius;

    var lowLimitX = earthCenter.X - satellite.orb.radius;
    var highLimitX = earthCenter.X + satellite.orb.radius;

    var a = satellite.orb.visibleSemiaxises.a;
    var b = satellite.orb.visibleSemiaxises.b;

    var ecx = earthCenter.X;
    var ecz = earthCenter.Z;

    var minDelta = 1 - delta;
    var maxDelta = 1 + delta;

    var orbPixelsArr = satellite.orb.imgData.data;

    for (var i = 0; i < h; ++i) {
      if (i < lowLimitZ || i > highLimitZ) continue;

      for (var j = 0; j < w; ++j) {
        if (j < lowLimitX || j > highLimitX) continue;

        var tmp = Math.pow(j - ecx, 2) / Math.pow(a, 2) +
                  Math.pow(i - ecz, 2) / Math.pow(b, 2);

        if (tmp < minDelta || tmp > maxDelta) continue;

        arrIdx = (i * slaveCnv.width + j) * 4;

        orbPixelsArr[arrIdx + 1] = 255;
        orbPixelsArr[arrIdx + 3] = 255;
      }
    }
  }

  function calculateParams(satellite) {
    satellite.orb.visibleSemiaxises.b = 
    satellite.orb.radius * Math.cos(satellite.orb.angles.X);

    satellite.orb.visibleSemiaxises.a = 
    satellite.orb.radius * Math.cos(satellite.orb.angles.Z);
  }

  function setSatelliteImg(satellite) {
    var verticalPos = 175;

    var horisontalPos = 
    (satellite.orb.visibleSemiaxises.a / satellite.orb.visibleSemiaxises.b) *
    Math.sqrt(Math.pow(satellite.orb.visibleSemiaxises.b, 2) - 
              Math.pow(verticalPos - earthCenter.Z, 2)) + earthCenter.X;

    slaveCtx.drawImage(satellite.img, 
                       horisontalPos - satellite.img.width / 2,
                       verticalPos - satellite.img.height / 2);
  }

  function Satellite(id, params) {
    Object.defineProperty(this, "id", {
      value: id,
      writable: false
    });

    this.orb = {
      angles: {
        X: 0,
        Y: 0,
        Z: 0
      },

      radius: params.orbRadius,

      visibleSemiaxises: {
        a: null,
        b: null
      }
    };

    this.img = params.img;
  }

}());
