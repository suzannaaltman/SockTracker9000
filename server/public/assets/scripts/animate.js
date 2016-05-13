$(document).ready(function() {
      var interval = setInterval ('mortyAnimation()', 200);
      var curserInterval = setInterval ('cursorAnimation()', 300);


      window.setTimeout(stopAnim, [2000]);

      window.setTimeout(stopCursor, [4000]);

  function stopCursor(){
    console.log('cursor stopped');
    clearInterval(curserInterval);
    $('span').empty();
  }

  function stopAnim(){
    console.log('stopped');
    clearInterval(interval);
  }



});

var cursorAnimation = function() {
    $('#cursor').animate({
        opacity: 0
    }, 'fast', 'swing').animate({
        opacity: 1
    }, 'fast', 'swing');
}

var mortyAnimation = function() {
    $('div').animate({
        opacity: 0
    }, 'fast').animate({
        opacity: 1
    }, 'fast');
}
