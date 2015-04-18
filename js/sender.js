/* to do:
  1) add try-catch blocks instead of errCallback calling;
*/

function getCoords() {
  'use strict';

  var DELAY_TIME = 1000;

  startButton.style.display = 'none';
  infoBlock.innerHTML = 'Выполняется получение координат';

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {

    if (this.readyState != 4 && this.status != 200) {
      return;
    }

    if (this.readyState == 4 && this.status != 200) {
      return errCallback('Ошибка при получении координат');
    }

    if (this.responseText) {

      var res = JSON.parse(this.responseText);

      if (res.error) {
        var msg = res.error + '; ' + res.explanation;
        return errCallback(msg);
      }

      var resText = this.responseText.
                      replace(/,/g, ',\n').
                      replace(/\[/g, '[\n\n');

      coords.innerHTML = resText;
    }

    setTimeout(getCoords, DELAY_TIME);
  };

  xhr.ontimeout = function() {
    return errCallback('Control center server is not responding');
  };

  xhr.open('GET', '/info');

  xhr.send();

  function errCallback(msg) {
    infoBlock.innerHTML = msg;
    coords.innerHTML = 'error';
    startButton.style.display = 'inline-block';
  }
}
