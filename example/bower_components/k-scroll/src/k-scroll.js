;(function (window, document) { 'use strict';
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame 
                              || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

  window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame
                              || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
  
  var kScroll = {};

  kScroll.bind = function (element, opts) {
    var options = {
      animationDuration: 200,
      animationEasing: [0, 0, 0.58, 1],
      speed: 100,
      allowMouseDragScroll: true,
      checkOnResize: true,
      bindKey: true // 绑定按键
    };

    configure(opts);

    var wrapper = element;
    var scroller = wrapper.querySelector('.k-scroller');
    var scrollBar = document.createElement('span');
    var minScroll = 0;
    var scrollerHeight;
    var wrapperHeight;
    var scrollBarHeight;
    var maxScroll;
    var scrollBarHeightPercent;
    var scrollBarDragstartScrollTop;
    var lastFrameTime;
    var frameToken;
    var dragEndvScrollTop;
    var isDrag;

    var currentScrollTop = 0; // 当前纵向滚动值
    var vScrollTop = 0; // 纵向滚动速度

    scrollBar.classList.add('scroll-bar');
    wrapper.appendChild(scrollBar);

    var kDrag;

    if (typeof require === 'function')
      kDrag = require('kDrag');
    else if (window.kDrag)
      kDrag = window.kDrag;

    kDrag.bind(wrapper);
    kDrag.bind(scrollBar);
   
    wrapper.addEventListener('mouseenter', refreshContext);
    wrapper.addEventListener('mousedown', refreshContext);
    wrapper.addEventListener('touchstart', refreshContext);

    wrapper.addEventListener('mouseenter', wrapperOnMouseenter);

    wrapper.addEventListener('mousedown', _break);
    wrapper.addEventListener('touchstart', _break);
    window.addEventListener('blur', _break);

    wrapper.addEventListener('mousewheel', onMousewheel);

    wrapper.addEventListener('touchstart', wrapperOnPointerdown);
    wrapper.addEventListener('mousedown', wrapperOnPointerdown);

    wrapper.addEventListener('k.dragstart', wrapperOnDragstart);
    wrapper.addEventListener('k.drag', wrapperOnDrag);
    wrapper.addEventListener('touchend', wrapperOnPointerup);
    wrapper.addEventListener('mouseup', wrapperOnPointerup);
    wrapper.addEventListener('k.dragend', wrapperOnDragend);

    scrollBar.addEventListener('mouseenter', scrollBarOnMouseenter);
    scrollBar.addEventListener('mouseleave', scrollBarOnMouseleave);
    scrollBar.addEventListener('touchstart', scrollBarOnPointerdown);
    scrollBar.addEventListener('mousedown', scrollBarOnPointerdown);
    scrollBar.addEventListener('touchend', scrollBarOnPointerup);
    scrollBar.addEventListener('touchcancel', scrollBarOnPointerup);
    scrollBar.addEventListener('k.dragstart', scrollBarOnDragstart);
    scrollBar.addEventListener('k.drag', scrollBarOnDrag);
    scrollBar.addEventListener('k.dragend', scrollBarOnDragend);

    window.addEventListener('resize', resizeCheck);
    document.addEventListener('keydown', keyScroll);

    // 强制开启硬件加速
    Velocity.hook(scroller, "translateZ", '0.00001px');
    Velocity.hook(scrollBar, "translateZ", '0.00001px');
    scrollTo(currentScrollTop, false, false);

    return {
      unbind: unbind,
      configure: configure,
      scrollTo: scrollTo,
      stopAnimation: stopAnimation,
      refreshContext: refreshContext,
      resetscrollBarStyle: resetscrollBarStyle,
      get maxScroll() {
        return maxScroll; 
      }
    };

    function unbind() {
      wrapper.removeEventListener('mouseenter', refreshContext);
      wrapper.removeEventListener('mousedown', refreshContext);
      wrapper.removeEventListener('touchstart', refreshContext);

      wrapper.removeEventListener('mouseenter', wrapperOnMouseenter);

      wrapper.removeEventListener('mousedown', _break);
      wrapper.removeEventListener('touchstart', _break);
      window.removeEventListener('blur', _break);

      wrapper.removeEventListener('mousewheel', onMousewheel);

      wrapper.removeEventListener('touchstart', wrapperOnPointerdown);
      wrapper.removeEventListener('mousedown', wrapperOnPointerdown);

      wrapper.removeEventListener('k.dragstart', wrapperOnDragstart);
      wrapper.removeEventListener('k.drag', wrapperOnDrag);
      wrapper.removeEventListener('touchend', wrapperOnPointerup);
      wrapper.removeEventListener('mouseup', wrapperOnPointerup);
      wrapper.removeEventListener('k.dragend', wrapperOnDragend);

      scrollBar.removeEventListener('mouseenter', scrollBarOnMouseenter);
      scrollBar.removeEventListener('mouseleave', scrollBarOnMouseleave);
      scrollBar.removeEventListener('touchstart', scrollBarOnPointerdown);
      scrollBar.removeEventListener('mousedown', scrollBarOnPointerdown);
      scrollBar.removeEventListener('touchend', scrollBarOnPointerup);
      scrollBar.removeEventListener('touchcancel', scrollBarOnPointerup);
      scrollBar.removeEventListener('k.dragstart', scrollBarOnDragstart);
      scrollBar.removeEventListener('k.drag', scrollBarOnDrag);
      scrollBar.removeEventListener('k.dragend', scrollBarOnDragend);

      window.removeEventListener('resize', resizeCheck);
      document.removeEventListener('keydown', keyScroll);
    }

    function scrollBarOnMouseenter(e) {
      var scrollBar = e.currentTarget;
      scrollBar.classList.add('hover');
    }

    function scrollBarOnMouseleave(e) {
      var scrollBar = e.currentTarget;
      scrollBar.classList.remove('hover');
    }

    function scrollBarOnPointerdown(e) {
      e.preventDefault();
      var scrollBar = e.currentTarget;
      scrollBar.classList.add('active');

      if (e.type === 'mousedown') {
        document.addEventListener('mouseup', scrollBarOnPointerup, true);
      }
    }

    function scrollBarOnPointerup(e) {
      scrollBar.classList.remove('active');

      if (e.type === 'mouseup') {
        document.removeEventListener('mouseup', scrollBarOnPointerup, true);
      }
    }

    function scrollBarOnDrag(e) {
      var destScrollTop = scrollBarDragstartScrollTop + e.deltaY * (scrollerHeight - wrapperHeight) / (wrapperHeight - scrollBarHeight)
      if (destScrollTop > maxScroll)
        destScrollTop = maxScroll;
      else if (destScrollTop < minScroll)
        destScrollTop = minScroll;
      scrollTo(destScrollTop, false, false);
    }

    function scrollBarOnDragstart(e) {
      var scrollBar = e.currentTarget;
      refreshContext();
      scrollBarDragstartScrollTop = currentScrollTop;
      scrollBar.classList.add('dragging');
    }

    function scrollBarOnDragend(e) {
      var scrollBar = e.currentTarget;
      scrollBar.classList.remove('dragging');
    }

    function wrapperOnMouseenter() {
      resetscrollBarStyle();
    }

    function wrapperOnPointerdown(e) {
      isDrag = false;

      if (e.type === 'mousedown') {
        if (options.allowMouseDragScroll) {
          e.preventDefault();
        }
      }
      else {
        e.preventDefault();
      }
    }

    function wrapperOnPointerup(e) {
      var wrapper = e.currentTarget;

      if (!isDrag) {
        dragEndvScrollTop = 0;
        lastFrameTime = null;
        wrapper.classList.add('sliding');
        slide();
      }
    }

    function wrapperOnDragstart(e) {
      if (e.dragTarget.classList.contains('scroll-bar')) // 如果拖拽的是滚动条就返回
        return;
      else if (!options.allowMouseDragScroll && e.pointerType === 'mouse' && !e.ctrlKey) {
        e.prevent();
        return;
      }

      var wrapper = e.currentTarget;

      if (e.state > 0) {
        wrapper.classList.add('dragging');
        isDrag = true;
      }
    }

    function wrapperOnDrag(e) {
      if (e.dragTarget.classList.contains('scroll-bar'))
        return;

      if (currentScrollTop > maxScroll) {
        if (e.vy <= 0) {
          e.stepY /= 1 + Math.abs(currentScrollTop - maxScroll) / 14;
        }
      } else if (currentScrollTop < minScroll) {
        if (e.vy >= 0) {
          e.stepY /= 1 + Math.abs(currentScrollTop - minScroll) / 14;
        }
      }

      vScrollTop = -e.vy;
      currentScrollTop -= e.stepY;
      scrollTo(currentScrollTop, false, false);
    }

    function wrapperOnDragend(e) {
      if (e.dragTarget.classList.contains('scroll-bar'))
        return;

      var wrapper = e.currentTarget;

      wrapper.classList.remove('dragging');
      
      dragEndvScrollTop = vScrollTop = -e.vy;

      lastFrameTime = null;
      wrapper.classList.add('sliding');
      slide();
    }

    function onMousewheel(e) {
      if (e.ctrlKey)
        return;
      refreshContext();
      e.preventDefault();
      var delta = computeMouseWheelDelta(e);
      var destScrollTop = currentScrollTop - delta * options.speed;

      if (destScrollTop > maxScroll)
        destScrollTop = maxScroll;
      else if (destScrollTop < minScroll)
        destScrollTop = minScroll;
      vScrollTop = 0;
      scrollTo(destScrollTop, true, true);
    }

    function configure(opts) {
      for (var key in opts) {
        if (opts[key] !== undefined) {
          options[key] = opts[key];
        }
      }
    }

    function keyScroll(e) {
      if (!options.bindKey)
        return;

      // ←:37  ↑:38  →:39  ↓:40  pgup:33  pgdn:34
      switch (e.keyCode) {
        case 33:
          currentScrollTop -= wrapperHeight - 3;
          break;
        case 34:
          currentScrollTop += wrapperHeight - 3;
          break;
        case 38:
          currentScrollTop -= options.speed;
          break;
        case 40:
          currentScrollTop += options.speed;
          break;
        default:
          return;
      }

      refreshContext();

      if (currentScrollTop < minScroll)
        currentScrollTop = minScroll;
      else if (currentScrollTop > maxScroll)
        currentScrollTop = maxScroll;

      scrollTo(currentScrollTop, true, true);
    }

    function resizeCheck() {
      if (!options.checkOnResize)
        return;

      if (wrapper.style.display === 'none')
        return;

      refreshContext();
      if (currentScrollTop > maxScroll) {
        scrollTo(maxScroll);
      }
    }

    function _break(e, preventTap) {
      if (frameToken) {
        stopAnimation();
        if (e.type !== 'blur' && Math.abs(vScrollTop) > 0.14) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
      vScrollTop = 0;
      wrapper.classList.remove('sliding');

      if (e.ctrlKey && e.type === 'mousedown') {
        e.preventDefault();
      }
    }

    function refreshContext() {
      var wrapperStyle = window.getComputedStyle(wrapper);
      var scrollerStyle = window.getComputedStyle(scroller);

      wrapperHeight = parseFloat(wrapperStyle.height);
      scrollerHeight = parseFloat(scrollerStyle.height);
      maxScroll = Math.max(0, scrollerHeight - wrapperHeight);
      scrollBarHeightPercent = wrapperHeight / scrollerHeight;
      if (scrollBarHeightPercent >= 1) {
        scrollBarHeightPercent = 0;
      }

      scrollBarHeight = Math.max(wrapperHeight * scrollBarHeightPercent, 4);
    }

    function slide(time) {
      var timeSpan, destScrollTop, vScrollTopCurrent;

      if (lastFrameTime) {
        timeSpan = time - lastFrameTime;

        vScrollTopCurrent = vScrollTop * Math.pow(0.95, timeSpan / (1000 / 60));

        destScrollTop = currentScrollTop + (vScrollTop + vScrollTopCurrent) / 2 * timeSpan;

        scrollTo(destScrollTop, false, false);

        vScrollTop = vScrollTopCurrent;

        if (currentScrollTop > maxScroll) {
          if (vScrollTop <= 0) {
            vScrollTop = (maxScroll - currentScrollTop) / 200;
            if (dragEndvScrollTop < 0 && vScrollTop > dragEndvScrollTop) {
              vScrollTop = dragEndvScrollTop;
            } else if (vScrollTop > -0.03) {
              vScrollTop = -0.03;
            }
          } else {
            vScrollTop -= (currentScrollTop - maxScroll) * 0.0003 * timeSpan;
            if (vScrollTop < 0) {
              vScrollTop = 0;
            }
          }
        } else if (currentScrollTop < minScroll) {
          if (vScrollTop >= 0) {
            vScrollTop = (minScroll - currentScrollTop) / 200;
            if (dragEndvScrollTop > 0 && vScrollTop < dragEndvScrollTop) {
              vScrollTop = dragEndvScrollTop;
            } else if (vScrollTop < 0.03) {
              vScrollTop = 0.03;
            }
          } else {
            vScrollTop -= (currentScrollTop - minScroll) * 0.0003 * timeSpan;
            if (vScrollTop > 0) {
              vScrollTop = 0
            }
          }
        }
      }

      lastFrameTime = time;

      if (Math.abs(currentScrollTop - maxScroll) < 0.03) {
        currentScrollTop = maxScroll;
      } else if (Math.abs(currentScrollTop - minScroll) < 0.03) {
        currentScrollTop = minScroll;
      }

      if (!wrapper.classList.contains('dragging')
      && (Math.abs(vScrollTop) > 0.03
      || currentScrollTop > maxScroll
      || currentScrollTop < minScroll)) {
        frameToken = window.requestAnimationFrame(slide);
      } else {
        vScrollTop = 0;
        wrapper.classList.remove('sliding');
        window.cancelAnimationFrame(frameToken);
        frameToken = null;
      }
    }

    function resetscrollBarStyle(doAnimation) {
      var scrollPercent = currentScrollTop / (scrollerHeight - wrapperHeight);

      if (scrollBarHeightPercent <= 0)
        scrollBar.display = 'none';
      else
        scrollBar.display = 'block';

      Velocity.hook(scrollBar, 'height', scrollBarHeight + 'px');

      Velocity(scrollBar, 'stop');

      var translateY = ((wrapperHeight - scrollBarHeight) * scrollPercent) + 'px';

      if (doAnimation) {
        Velocity(scrollBar, {translateY: translateY}, {
          duration: options.animationDuration,
          easing: options.animationEasing
        });
      } else {
        Velocity.hook(scrollBar, 'translateY', translateY);
      }
    }

    function scrollTo(destScrollTop, doAnimation, scrollBarDoAnimation, duration, callback) {
      currentScrollTop = destScrollTop;

      stopAnimation();

      if (doAnimation) {
        Velocity(scroller, {
          translateY: (-currentScrollTop) + 'px'
        }, {
          duration: duration || options.animationDuration,
          easing: options.animationEasing,
          begin: function () {
            wrapper.classList.add('scrolling');
          },
          complete: function () {
            wrapper.classList.remove('scrolling');
            if (typeof callback === 'function')
              callback.call(this);
          }
        });  
      } else {
        Velocity.hook(scroller, "translateY", -currentScrollTop + 'px');
        if (typeof callback === 'function')
          callback.call(this);
      }
    
      resetscrollBarStyle(scrollBarDoAnimation);                        
    }

    function stopAnimation() {
      window.cancelAnimationFrame(frameToken);
      frameToken = null;
      Velocity(scroller, 'stop');
    }
  };

  function computeMouseWheelDelta(eventArg) {
    return (eventArg.wheelDelta) ? eventArg.wheelDelta / 120 : -(eventArg.detail || 0) / 3;
  }

  if (typeof define === 'function') {
    define('kScroll', function() { return kScroll; });
  } else {
    window.kScroll = kScroll;
  }
})(window, document);