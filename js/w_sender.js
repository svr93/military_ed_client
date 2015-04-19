/* to do:
  1) add try-catch blocks instead of errCallback calling;
  2) repeat a test for memory leaks (Chrome, Firefox)
*/

onmessage = function(evt) {
  'use strict';

  var DELAY_TIME = 500;

  var xhr = new XMLHttpRequest();

  xhr.open('GET', '/info', false);

  xhr.send();

  if (xhr.readyState == 4 && xhr.status != 200) {
    return errCallback('Ошибка при получении координат');
  }

  var res = JSON.parse(xhr.responseText);

  if (res.error) {
    var msg = res.error + '; ' + res.explanation;
    return errCallback(msg);
  }

  var resText = xhr.responseText.
                  replace(/,/g, ',\n').
                  replace(/\[/g, '[\n\n');

  setTimeout(function() {

    postMessage({
      status: 0,
      res: resText
    });

  }, DELAY_TIME);

  function errCallback(msg) {

    postMessage({
      status: -1,
      res: msg
    });
  }
}
