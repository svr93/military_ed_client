(function() {
        var ctx = null;

        var earthCenter = {};
        var earthRadius = null;

        var satellites = [];

        var delta = 0; // to correct the discretization problem

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
          earthCenter.Y = Math.min(cnv.width, cnv.height) / 2;
          earthCenter.Z = cnv.height / 2;

          earthRadius = 50;

          getSatellitesInfo();
        }

        function getSatellitesInfo() {
          // AJAX or WebSockets

          var params = {};

          params.width = 1;
          params.height = 1;
          params.orbRadius = 180;

          createSatellites(0, params);
        }

        function createSatellites(id, params) {
          satellites.push(new Satellite(id, params));
          drawSatellites();
        }

        function drawSatellites() {
          setDrawingLimits();

          for (var i = 0; i < satellites.length; ++i) {

            setSatellitePixels(satellites[i].params.orbRadius,
            satellites[i].orbitImg.data);

            ctx.putImageData(satellites[i].orbitImg, 0, 0);
          }
        }

        function setDrawingLimits() {
          delta = 0.005;
        }

        function setSatellitePixels(orbRadius, pixelsArr) {
          // is it required to use setTimeout in drawing process?

          var semiaxises = {};
          var alpha = Math.PI / 3;

          calculateParams(orbRadius, alpha, semiaxises);

          var tmp = 0;

          for (var i = 0; i < cnv.height; ++i) {
            for (var j = 0; j < cnv.width; ++j) {

              if (i < earthCenter.Z - orbRadius || 
                  i > earthCenter.Z + orbRadius ||
                  j < earthCenter.X - orbRadius ||
                  j > earthCenter.X + orbRadius) continue;

              /*if (Math.pow(earthCenter.X - j, 2) + 
                  Math.pow(earthCenter.Z - i, 2) <
                  Math.pow(orbRadius - delta, 2) ||

                  Math.pow(earthCenter.X - j, 2) + 
                  Math.pow(earthCenter.Z - i, 2) >
                  Math.pow(orbRadius + delta, 2)) continue;*/

              if ((Math.pow(j - earthCenter.X, 2) / Math.pow(semiaxises.a, 2) +
                  Math.pow(i - earthCenter.Z, 2) / Math.pow(semiaxises.b, 2)
                  < 1 - delta) ||

                  (Math.pow(j - earthCenter.X, 2) / Math.pow(semiaxises.a, 2) +
                  Math.pow(i - earthCenter.Z, 2) / Math.pow(semiaxises.b, 2)
                  > 1 + delta)) continue;

              tmp = (i * cnv.width + j) * 4;

              pixelsArr[tmp] = 0;
              pixelsArr[tmp + 1] = 0;
              pixelsArr[tmp + 2] = 0;
              pixelsArr[tmp + 3] = 255;

              console.log(true);
            }
          }

        }

        function calculateParams(orbRadius, alpha, semiaxises) {
          // X rotate
          semiaxises.a = orbRadius;
          semiaxises.b = orbRadius * Math.sin(alpha);
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
