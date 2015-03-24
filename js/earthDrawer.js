(function() {
  "use strict";

  /* TO DO:
    1) correct bug on the mobile devices;

  */

  var d2 = null;
  var d = null;
  var r = null;

  var earthCtx = null;
  var earth2DCtx = null;

  var bufferCnv = null;
  var bufferCtx = null;

  var img = null;
  var imgData = null;
  var imgArr = [];

  var INITIAL_SCALE = 0.5;
  var currScale = INITIAL_SCALE;

  var GAUSS_PARTS_NUM = 256; // GAUSS_PARTS_NUM % 4 == 0 (projection precision)
  var gaussPartsNumQuarter = GAUSS_PARTS_NUM / 4;

  var gaussPartWidth = null;
  var imgIntervalWidth = null;
  var gaussImgDiff = null;

  var COMMON_STEP = 0.5; // "%"
  var imgShift = null;
  var cnvShift = null;

  var currPos = null;

  var DELAY_TIME = 50;

  window.initEarthDrawingSettings = function() {

    earthCnv.width = parseInt(getComputedStyle(earthCnv, '').width);
    earthCnv.height = earthCnv.width;
    earthCtx = earthCnv.getContext("2d");

    earth2DCnv.width = earthCnv.width;
    earth2DCnv.height = earthCnv.height;
    earth2DCtx = earth2DCnv.getContext("2d");

    bufferCnv = document.createElement("canvas");
    bufferCnv.width = earthCnv.width * 2;
    bufferCnv.height = earthCnv.height;
    bufferCtx = bufferCnv.getContext("2d");

    img = new Image();

    img.onload = function() {

      currPos = COMMON_STEP / 2;

      setScaleSettings(INITIAL_SCALE);

      earth2DCtx.drawImage(this, 0, 0,
                                 this.width, this.height,
                                 0, this.height / 4 | 0,
                                 earth2DCnv.width, earth2DCnv.height / 2 | 0);

      setInterval(function() {
        window.requestAnimationFrame(drawEarth);
      }, DELAY_TIME);
    };

    img.src = "img/earth.jpg";

    window.changeScale = function (scaleDelta) {
      var newScale = currScale + scaleDelta;

      if (newScale > 1 || newScale < 0.05) return;

      newScale = Math.round(newScale * 1000) / 1000;
      setScaleSettings(newScale);
    };
  };

  function setScaleSettings(newScale) {
    currScale = newScale;

    d2 = currScale * bufferCnv.width | 0;
    d = d2 / 2 | 0;
    r = d2 / 4 | 0;

    gaussPartWidth = d2 / GAUSS_PARTS_NUM;
  }

  function drawEarth() {

    imgShift = img.width * currPos / 100 | 0;
    cnvShift = currScale * bufferCnv.width * currPos / 100 | 0;

    bufferCtx.clearRect(0, 0, d2, d);

    bufferCtx.drawImage(img, 0, 0, img.width - imgShift, img.height,
                             cnvShift, 0, d2 - cnvShift, d);

    bufferCtx.drawImage(img, img.width - imgShift, 0, imgShift, img.height,
                             0, 0, cnvShift, d);

    imgData = bufferCtx.getImageData(0, 0, d, d);
    imgArr = imgData.data;

    createHemisphereImgArr();

    earthCtx.clearRect(0, 0, earthCnv.width, earthCnv.height);

    earthCtx.putImageData(imgData, earthCnv.width / 2 - r,
                                   earthCnv.height / 2 - r);

    drawSatellites(earthCnv, currPos, currScale);

    currPos += COMMON_STEP;

    if (currPos >= 100) {
      currPos = COMMON_STEP / 2;
    }
  }

  function createHemisphereImgArr() {

    for (var i = 0; i < d; ++i) {

      imgIntervalWidth = 
      Math.sqrt(Math.pow(r, 2) - Math.pow(Math.abs(r - i), 2)) /
      gaussPartsNumQuarter;

      gaussImgDiff = gaussPartWidth - imgIntervalWidth;

      for (var j = r; j >= 0; --j) {
        checkHemisphereValues(i, j);
      }
      
      for (var j = r; j <= d; ++j) {
        checkHemisphereValues(i, j);
      }

    }
  }

  function checkHemisphereValues(i, j) {
    var cnvPos = i * d + j;

    if (Math.abs(r - j) < gaussPartsNumQuarter * imgIntervalWidth) {

      var tmp = gaussImgDiff / 2 + 
                gaussImgDiff * (Math.abs(r - j) / imgIntervalWidth | 0) | 0;
                
      var shift = j < r ? -tmp : tmp;

      imgArr[cnvPos * 4] = imgArr[(cnvPos + shift) * 4];
      imgArr[cnvPos * 4 + 1] = imgArr[(cnvPos + shift) * 4 + 1];
      imgArr[cnvPos * 4 + 2] = imgArr[(cnvPos + shift) * 4 + 2];
      imgArr[cnvPos * 4 + 3] = imgArr[(cnvPos + shift) * 4 + 3];
    } else {
      setWhiteColor(cnvPos);
    }
  }

  function setWhiteColor(cnvPos) {
    for (var i = 0; i < 4; ++i) {
      imgArr[cnvPos * 4 + i] = 255;
    }
  }

}());
