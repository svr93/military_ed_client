(function() {
  var h = null;
  var hh = null;

  var w = null;
  var wh = null;
  var wq = null;

  var ctx = null;

  var img = null;
  var imgData = null;
  var imgArr = [];

  var GAUSS_PARTS_NUM = 32;

  window.initEarthDrawingSettings = function() {
    earthCnv.width = 600;
    earthCnv.height = 400;

    h = earthCnv.height;
    hh = h / 2;

    w = earthCnv.width;
    wh = w / 2;
    wq = w / 4;

    ctx = earthCnv.getContext("2d");

    img = new Image();
    img.src = "img/earth.jpg";

    img.onload = function() {
      ctx.drawImage(img, 0, 0, img.width, img.height,
                         0, 0, w, h);
      imgData = ctx.getImageData(0, 0, w, h);
      imgArr = imgData.data;

      correctImageData();
    }
  }

  function correctImageData() {
    var idx = null;

    var gaussPartWidth = w / GAUSS_PARTS_NUM;
    var gaussPartWidthHalf = gaussPartWidth / 2;

    var k = gaussPartWidth / h;

    // correct the top of map (Gauss division)

    for (var i = 0; i < hh; ++i) {
      for (var j = 0; j < wh; ++j) {

        var pos = j % gaussPartWidth;
        var imgIntervalWidthHalf = k * i;

        if (pos > gaussPartWidthHalf - imgIntervalWidthHalf && 
            pos < gaussPartWidthHalf + imgIntervalWidthHalf) continue;

        idx = (i * w + j) * 4;
        
        imgArr[idx] = 255;
        imgArr[idx + 1] = 255;
        imgArr[idx + 2] = 255;
        imgArr[idx + 3] = 255;
      }
    }

    // correct the bottom of map (Gauss division)

    for (var i = hh; i < h; ++i) {
      for (var j = 0; j < wh; ++j) {

        var pos = j % gaussPartWidth;
        var imgIntervalWidthHalf = k * (h - i);

        if (pos > gaussPartWidthHalf - imgIntervalWidthHalf && 
            pos < gaussPartWidthHalf + imgIntervalWidthHalf) continue;

        idx = (i * w + j) * 4;
        
        imgArr[idx] = 255;
        imgArr[idx + 1] = 255;
        imgArr[idx + 2] = 255;
        imgArr[idx + 3] = 255;
      }
    }

    // correct the top of map (make shifts)

    var gaussPartsNumQuarter = GAUSS_PARTS_NUM / 4;

    for (var i = 0; i < hh; ++i) {
      var imgIntervalWidth = k * i * 2;

      for (var j = wq; j >= 0; --j) {
        var cnvPos = i * w + j;

        if (j > wq - gaussPartsNumQuarter * imgIntervalWidth) {
          var shift = k * (hh - i) | 0;

          imgArr[cnvPos * 4] = imgArr[(cnvPos - shift) * 4];
          imgArr[cnvPos * 4 + 1] = imgArr[(cnvPos - shift) * 4 + 1];
          imgArr[cnvPos * 4 + 2] = imgArr[(cnvPos - shift) * 4 + 2];
          imgArr[cnvPos * 4 + 3] = imgArr[(cnvPos - shift) * 4 + 3];
        } else {
          imgArr[cnvPos * 4] = 255;
          imgArr[cnvPos * 4 + 1] = 255;
          imgArr[cnvPos * 4 + 2] = 255;
          imgArr[cnvPos * 4 + 3] = 255;
        }
      }
    }

    setGrid();

    ctx.clearRect(0, 0, w, h);
    ctx.putImageData(imgData, 0, 0);
  }

  function setGrid() {

    for (var i = 0; i < h; ++i) {
      for (var j = 1; j < 4; ++j) {

        imgArr[(i * w + j * wq) * 4] = 0;
        imgArr[(i * w + j * wq) * 4 + 1] = 0;
        imgArr[(i * w + j * wq) * 4 + 2] = 0;
        imgArr[(i * w + j * wq) * 4 + 3] = 255;
      }
    }
  }

}());
