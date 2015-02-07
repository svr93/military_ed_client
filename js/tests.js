function testSpeed(bindFunc, numTests) {
  var CONSECUTIVE_LAUNCHES_NUM = 50;
  var INTERRUPTION_TIME = 50;

  var currentTestsCount = 0;

  var tmpTime = null;
  var fullTime = 0;

  var timer = setTimeout(function test() {
    tmpTime = new Date();

    for (var i = 0; i < CONSECUTIVE_LAUNCHES_NUM; ++i) {
      bindFunc();
    }

    tmpTime = new Date() - tmpTime;
    console.log(tmpTime);

    fullTime += tmpTime;
    ++currentTestsCount;

    if (currentTestsCount == numTests) {
      console.log("Average time: " + fullTime / numTests);
      return;
    }

    timer = setTimeout(test, INTERRUPTION_TIME);
  }, INTERRUPTION_TIME);
}
