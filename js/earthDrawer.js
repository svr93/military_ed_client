(function() {
  var ctx = null;
  var img = null;

  var GAUSS_PARTS_NUM = 32;

  window.initEarthDrawingSettings = function() {
    earthCnv.width = 600;
    earthCnv.height = 400;
    ctx = earthCnv.getContext("2d");

    img = new Image();
    img.src = "img/earth.jpg";

    img.onload = function() {
      correctImageData();
    }
  }

  function correctImageData() {
    ctx.drawImage(img, 0, 0, img.width, img.height, 
                       0, 0, earthCnv.width, earthCnv.height);

    var imgData = ctx.getImageData(0, 0, earthCnv.width, earthCnv.height);
    var arr = imgData.data;
    var idx = null;

    var h = earthCnv.height;
    var w = earthCnv.width;

    var gaussPartWidth = w / GAUSS_PARTS_NUM;
    var gaussPartWidthHalf = gaussPartWidth / 2;

    var k = w / (GAUSS_PARTS_NUM * h);

    // top

    for (var i = 0; i < h / 2; ++i) {
      for (var j = 0; j < w; ++j) {

        var pos = j % gaussPartWidth;
        var intervalWidthHalf = k * i;

        if (pos > gaussPartWidthHalf - intervalWidthHalf && 
            pos < gaussPartWidthHalf + intervalWidthHalf) continue;

        idx = (i * w + j) * 4;

        arr[idx] = 255;
        arr[idx + 1] = 255;
        arr[idx + 2] = 255;
        arr[idx + 3] = 255;
      }
    }

    // bottom

    for (var i = h / 2; i < h; ++i) {
      for (var j = 0; j < w; ++j) {

        var pos = j % gaussPartWidth;
        var intervalWidthHalf = k * (h - i);

        if (pos > gaussPartWidthHalf - intervalWidthHalf && 
            pos < gaussPartWidthHalf + intervalWidthHalf) continue;

        idx = (i * w + j) * 4;

        arr[idx] = 255;
        arr[idx + 1] = 255;
        arr[idx + 2] = 255;
        arr[idx + 3] = 255;
      }
    }

    ctx.clearRect(0, 0, w, h);
    ctx.putImageData(imgData, 0, 0);
  }

}());
