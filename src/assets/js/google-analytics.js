/* eslint-disable */    //3d party code
function googleAnalyticsContent() {
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)

  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-82755634-1', 'auto');

  var _gaq = _gaq || [];

  _gaq.push(['create', 'UA-82755634-1', 'auto']);
  _gaq.push(['_trackPageview']);
}

document.addEventListener('DOMContentLoaded', googleAnalyticsContent);
