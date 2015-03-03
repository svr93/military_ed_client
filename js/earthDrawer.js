(function() {

  var d2 = null;
  var d = null;
  var dh = null;

  var earthCtx = null;

  var bufferCnv = null;
  var bufferCtx = null;

  var img = null;
  var imgData = null;
  var imgArr = [];

  var GAUSS_PARTS_NUM = 256; // GAUSS_PARTS_NUM % 4 == 0 (projection precision)
  var gaussPartsNumQuarter = GAUSS_PARTS_NUM / 4;

  var gaussPartWidth = null;
  var imgIntervalWidth = null;
  var gaussImgDiff = null;

  window.initEarthDrawingSettings = function() {
    bufferCnv = document.createElement("canvas");
    bufferCnv.width = 600;
    bufferCnv.height = bufferCnv.width / 2;
    bufferCtx = bufferCnv.getContext("2d");

    d2 = bufferCnv.width;
    d = d2 / 2;
    dh = d2 / 4;

    gaussPartWidth = d2 / GAUSS_PARTS_NUM;

    earthCnv.width = bufferCnv.width / 2;
    earthCnv.height = bufferCnv.height;
    earthCtx = earthCnv.getContext("2d");

    img = new Image();

    img.onload = function() {
      bufferCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, d2, d);
      imgData = bufferCtx.getImageData(0, 0, d, d);
      imgArr = imgData.data;

      drawEarth();
    }

    img.src = "img/earth.jpg";
  }

  function drawEarth() {
    createHemisphereImgArr();
    setGrid();

    earthCtx.clearRect(0, 0, d, d);
    earthCtx.putImageData(imgData, 0, 0);
  }

  function createHemisphereImgArr() {

    for (var i = 0; i < d; ++i) {

      imgIntervalWidth = 
      Math.sqrt(Math.pow(dh, 2) - Math.pow(Math.abs(dh - i), 2)) /
      gaussPartsNumQuarter;

      gaussImgDiff = gaussPartWidth - imgIntervalWidth;

      for (var j = dh; j >= 0; --j) {
        checkHemisphereValues(i, j);
      }
      
      for (var j = dh; j <= d; ++j) {
        checkHemisphereValues(i, j);
      }

    }
  }

  function checkHemisphereValues(i, j) {
    var cnvPos = i * d + j;

    if (Math.abs(dh - j) < gaussPartsNumQuarter * imgIntervalWidth) {

      // simplified calculation (tmp)

      var tmp = gaussImgDiff * (Math.abs(dh - j) / imgIntervalWidth | 0) | 0;
      var shift = j < dh ? -tmp : tmp;

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

  function setGrid() {

    for (var i = 0; i < d; ++i) {
      for (var j = 1; j < 4; ++j) {

        imgArr[(i * d2 + j * dh) * 4] = 0;
        imgArr[(i * d2 + j * dh) * 4 + 1] = 0;
        imgArr[(i * d2 + j * dh) * 4 + 2] = 0;
        imgArr[(i * d2 + j * dh) * 4 + 3] = 255;
      }
    }
  }

}());
