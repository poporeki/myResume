/* animated.css 添加删除封装 */
$.fn.extend({
  animateCss: function (animationName, callback) {
    var animationEnd = (function (el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));
    var display = this.css('display');
    if (display == 'none') {
      this
        .css({
          "display": 'block'
        });
    }
    this
      .addClass('animated ' + animationName).one(animationEnd, function () {
        this.style.opacity = 1;
        $(this).removeClass('animated ' + animationName);

        if (typeof callback === 'function') callback(this);
      });
    return this;
  },
});