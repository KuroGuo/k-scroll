!function(e,t){"use strict";function n(e){return e.wheelDelta?e.wheelDelta/120:-(e.detail||0)/3}var r={};r.bind=function(r,a){function s(){B.removeEventListener("mouseenter",T),B.removeEventListener("mousedown",T),B.removeEventListener("touchstart",T),B.removeEventListener("mouseenter",m),B.removeEventListener("mouseleave",L),B.removeEventListener("mousedown",D),B.removeEventListener("touchstart",D),e.removeEventListener("blur",D),B.removeEventListener("mousewheel",y),B.removeEventListener("touchstart",g),B.removeEventListener("mousedown",g),B.removeEventListener("k.dragstart",f),B.removeEventListener("k.drag",p),B.removeEventListener("touchend",E),B.removeEventListener("mouseup",E),B.removeEventListener("k.dragend",h),G.removeEventListener("mouseenter",o),G.removeEventListener("mouseleave",i),G.removeEventListener("touchstart",d),G.removeEventListener("mousedown",d),G.removeEventListener("touchend",c),G.removeEventListener("touchcancel",c),G.removeEventListener("k.dragstart",u),G.removeEventListener("k.drag",v),G.removeEventListener("k.dragend",l),e.removeEventListener("resize",w),t.removeEventListener("keydown",b)}function o(e){var t=e.currentTarget;t.classList.add("hover")}function i(e){var t=e.currentTarget;t.classList.remove("hover")}function d(e){e.preventDefault();var n=e.currentTarget;n.classList.add("active"),"mousedown"===e.type&&t.addEventListener("mouseup",c,!0)}function c(e){G.classList.remove("active"),"mouseup"===e.type&&t.removeEventListener("mouseup",c,!0)}function v(e){var t=A+e.deltaY*(C-F)/(F-K);t>q?t=q:H>t&&(t=H),S(t,!1,!1)}function u(e){var t=e.currentTarget;T(),A=I,t.classList.add("dragging")}function l(e){var t=e.currentTarget;t.classList.remove("dragging")}function m(e){x();var t=e.currentTarget;t.classList.add("hover")}function L(e){var t=e.currentTarget;t.classList.remove("hover")}function g(e){Z=!1,"mousedown"===e.type?Y.allowMouseDragScroll&&e.preventDefault():e.preventDefault()}function E(e){var t=e.currentTarget;Z||(R=0,O=null,t.classList.add("sliding"),M())}function f(e){if(!e.dragTarget.classList.contains("scroll-bar")){if(!Y.allowMouseDragScroll&&"mouse"===e.pointerType&&!e.ctrlKey)return void e.prevent();var t=e.currentTarget;e.state>0&&(t.classList.add("dragging"),Z=!0)}}function p(e){e.dragTarget.classList.contains("scroll-bar")||(I>q?e.vy<=0&&(e.stepY/=1+Math.abs(I-q)/14):H>I&&e.vy>=0&&(e.stepY/=1+Math.abs(I-H)/14),J=-e.vy,I-=e.stepY,S(I,!1,!1))}function h(e){if(!e.dragTarget.classList.contains("scroll-bar")){var t=e.currentTarget;t.classList.remove("dragging"),R=J=-e.vy,O=null,t.classList.add("sliding"),M()}}function y(e){if(!e.ctrlKey){T(),e.preventDefault();var t=n(e),r=I-t*Y.speed;r>q?r=q:H>r&&(r=H),J=0,S(r,!0,!0)}}function k(e){for(var t in e)void 0!==e[t]&&(Y[t]=e[t])}function b(e){if(Y.bindKey){switch(e.keyCode){case 33:I-=F-3;break;case 34:I+=F-3;break;case 38:I-=Y.speed;break;case 40:I+=Y.speed;break;default:return}T(),H>I?I=H:I>q&&(I=q),S(I,!0,!0)}}function w(){Y.checkOnResize&&"none"!==B.style.display&&(T(),I>q&&S(q))}function D(e){j&&(V(),"blur"!==e.type&&Math.abs(J)>.14&&(e.stopPropagation(),e.preventDefault())),J=0,B.classList.remove("sliding"),e.ctrlKey&&"mousedown"===e.type&&e.preventDefault()}function T(){var t=e.getComputedStyle(B),n=e.getComputedStyle(P);F=parseFloat(t.height),C=parseFloat(n.height),q=Math.max(0,C-F),z=F/C,z>=1&&(z=0),K=Math.max(F*z,56)}function M(t){var n,r,a;O&&(n=t-O,a=J*Math.pow(.95,n/(1e3/60)),r=I+(J+a)/2*n,S(r,!1,!1),J=a,I>q?0>=J?(J=(q-I)/200,0>R&&J>R?J=R:J>-.03&&(J=-.03)):(J-=3e-4*(I-q)*n,0>J&&(J=0)):H>I&&(J>=0?(J=(H-I)/200,R>0&&R>J?J=R:.03>J&&(J=.03)):(J-=3e-4*(I-H)*n,J>0&&(J=0)))),O=t,Math.abs(I-q)<.03?I=q:Math.abs(I-H)<.03&&(I=H),!B.classList.contains("dragging")&&(Math.abs(J)>.03||I>q||H>I)?j=e.requestAnimationFrame(M):(J=0,B.classList.remove("sliding"),e.cancelAnimationFrame(j),j=null)}function x(e){var t=I/(C-F);G.display=0>=z?"none":"block",Velocity.hook(G,"height",K+"px"),Velocity(G,"stop");var n=(F-K)*t+"px";e?Velocity(G,{translateY:n},{duration:Y.animationDuration,easing:Y.animationEasing}):Velocity.hook(G,"translateY",n)}function S(e,t,n,r,a){I=e,V(),t?Velocity(P,{translateY:-I+"px"},{duration:r||Y.animationDuration,easing:Y.animationEasing,begin:function(){B.classList.add("scrolling")},complete:function(){B.classList.remove("scrolling"),"function"==typeof a&&a.call(this)}}):(Velocity.hook(P,"translateY",-I+"px"),"function"==typeof a&&a.call(this)),x(n)}function V(){e.cancelAnimationFrame(j),j=null,Velocity(P,"stop")}var Y={animationDuration:200,animationEasing:[0,0,.58,1],speed:100,allowMouseDragScroll:!0,checkOnResize:!0,bindKey:!0};k(a);var C,F,K,q,z,A,O,j,R,Z,B=r,P=B.querySelector(".k-scroller"),G=t.createElement("span"),H=0,I=0,J=0;G.classList.add("scroll-bar"),B.appendChild(G);var N;return"function"==typeof require?N=require("kDrag"):e.kDrag&&(N=e.kDrag),N.bind(B),N.bind(G),B.addEventListener("mouseenter",T),B.addEventListener("mousedown",T),B.addEventListener("touchstart",T),B.addEventListener("mouseenter",m),B.addEventListener("mouseleave",L),B.addEventListener("mousedown",D),B.addEventListener("touchstart",D),e.addEventListener("blur",D),B.addEventListener("mousewheel",y),B.addEventListener("touchstart",g),B.addEventListener("mousedown",g),B.addEventListener("k.dragstart",f),B.addEventListener("k.drag",p),B.addEventListener("touchend",E),B.addEventListener("mouseup",E),B.addEventListener("k.dragend",h),G.addEventListener("mouseenter",o),G.addEventListener("mouseleave",i),G.addEventListener("touchstart",d),G.addEventListener("mousedown",d),G.addEventListener("touchend",c),G.addEventListener("touchcancel",c),G.addEventListener("k.dragstart",u),G.addEventListener("k.drag",v),G.addEventListener("k.dragend",l),e.addEventListener("resize",w),t.addEventListener("keydown",b),Velocity.hook(P,"translateZ","0.00001px"),Velocity.hook(G,"translateZ","0.00001px"),S(I,!1,!1),{unbind:s,configure:k,scrollTo:S,stopAnimation:V,refreshContext:T,resetscrollBarStyle:x,get maxScroll(){return q}}},"function"==typeof define?define("kScroll",function(){return r}):e.kScroll=r}(window,document);