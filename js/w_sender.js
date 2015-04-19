/* to do:
  1) add try-catch blocks instead of errCallback calling;
*/

onmessage = function(evt) {
  'use strict';

  var DELAY_TIME = 2500;

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {

    if (this.readyState != 4 && this.status != 200) {
      return;
    }

    if (this.readyState == 4 && this.status != 200) {
      return errCallback('Ошибка при получении координат');
    }

    if (!this.responseText) {
      return;
    }

    var res = JSON.parse(this.responseText);

    if (res.error) {
      var msg = res.error + '; ' + res.explanation;
      return errCallback(msg);
    }

    var resText = this.responseText.
                    replace(/,/g, ',\n').
                    replace(/\[/g, '[\n\n');

    setTimeout(function() {

      postMessage({
        status: 0,
        res: resText
      });

    }, DELAY_TIME);

  };

  xhr.open('GET', '/info');

  xhr.send();

  function errCallback(msg) {

    postMessage({
      status: 1,
      res: msg
    });
  }
}
