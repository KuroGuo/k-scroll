;(function (window, document) { 'use strict';
  var startPageX, startPageY;
  var state = 0; //0: 初始状态, 1: 按下

  document.addEventListener('mousedown', onStart);
  document.addEventListener('touchstart', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);
  document.addEventListener('touchcancel', onEnd);

  function onStart(e) {
    if (e.which && e.which !== 1) {
      return;
    }

    var touch;

    if (e.type === 'mousedown') {
      startPageX = e.pageX;
      startPageY = e.pageY;
    } else if (e.type === 'touchstart') {
      touch = e.changedTouches[0];
      startPageX = touch.pageX;
      startPageY = touch.pageY;
    }

    state = 1;
  }

  function onMove(e) {
    if (state < 1)
      return;

    var touch;
    var pageX, pageY;

    if (e.type === 'mousemove') {
      pageX = e.pageX;
      pageY = e.pageY;
    } else if (e.type === 'touchmove') {
      touch = e.changedTouches[0];
      pageX = touch.pageX;
      pageY = touch.pageY;
    }

    if (Math.abs(pageX - startPageX) > 6 || Math.abs(pageY - startPageY) > 6)
      state = 0;
  }

  function onEnd(e) {
    e.stopPropagation();

    if (state < 1)
      return;
    
    var touch;
    var _event;
    var pageX, pageY;

    if (e.type === 'mouseup') {
      pageX = e.pageX;
      pageY = e.pageY;
    } else if (e.type === 'touchend') {
      touch = e.changedTouches[0];
      pageX = touch.pageX;
      pageY = touch.pageY;
    }

    _event = document.createEvent('HTMLEvents');
    _event.initEvent('k.tap', true, true);

    _event.pageX = pageX;
    _event.pageY = pageY;

    if (e.type === 'mouseup') {
      _event.pointerType = 'mouse';
    } else if (e.type === 'touchend') {
      _event.pointerType = 'touch';
    }

    _event.originalEvent = e;

    state = 0;

    e.target.dispatchEvent(_event);
  }
})(window, document);