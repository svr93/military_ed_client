(function() {
  var ctx = null;
  var img = null;

  var earthCenter = {};

  window.initEarthDrawingSettings = function() {
    earthCnv.width = 600;
    earthCnv.height = 400;
    ctx = earthCnv.getContext("2d");

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

    earthCenter.X = earthCnv.width / 2;
    earthCenter.Z = earthCnv.height / 2;

    img = new Image();
    img.src = "img/earth.jpg";
    img.onload = function() {
      correctImageData();
    }
  }

  function correctImageData() {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, earthCnv.width, earthCnv.height);

    var imgData = ctx.getImageData(0, 0, earthCnv.width, earthCnv.height);
    var arr = imgData.data;
    var idx = null;

    var h = earthCnv.height;
    var w = earthCnv.width;

    for (var i = h / 2 - 10; i < h / 2 + 10; ++i) {

      for (var j = 0; j < w; ++j) {

        idx = (i * w + j) * 4;

        arr[idx] = 255;
        arr[idx + 1] = 255;
        arr[idx + 2] = 255;
        arr[idx + 3] = 255;
      }
    }

    ctx.clearRect(0, 0, w, h);
    ctx.putImageData(imgData, 0, 0, 0, 0, w, h);
  }

}());
