function send() {
  'use strict';

  var DELAY_TIME = 1000;

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (this.readyState != 4 || this.status != 200) { return; }

    var res = JSON.parse(this.response);

    if (res.error) {
      alert(res.error + "; " + res.explanation);
      startButton.style.display = 'inline-block';
      return;
    }

    var resText = this.responseText.replace(/,/g, ',\n');
    coords.innerHTML = resText;

    setTimeout(send, DELAY_TIME);
  };

  xhr.timeout = 3000;

  xhr.ontimeout = function() {
    setTimeout(send, DELAY_TIME);
  };

  xhr.open("GET", "/info");

  xhr.send();
}
