/* Keeps the tab icon in step with the active theme.

   A favicon cannot read the page's CSS, and the theme here is switched at runtime
   rather than only by OS preference — so the static prefers-color-scheme handling
   in assets/favicon.svg covers two cases out of seventeen. This rebuilds the icon
   from the tokens actually in force and swaps the <link href>, which is the only
   way to make the tab follow a data-theme change.

   Geometry matches assets/favicon.svg exactly; edit both together. */

(function () {
  var link = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  if (!link) return;

  // x, y, width, height. Four vertebral bodies that both taper downward and swing
  // laterally. The swing is what makes it read as a spine instead of a stacked
  // list; four is the most that keeps visible gaps once scaled to 16 CSS px.
  var BODIES = [
    [14.75, 2.1, 8.5, 5.2],
    [12.2, 9.5, 10, 5.4],
    [8.45, 17.1, 11.5, 5.6],
    [9.3, 24.9, 11, 4.6]
  ];

  var FALLBACK = { panel: '#110620', border: '#8064c0', bone: '#ff2ec4' };
  var last = '';

  function tokens() {
    var cs = getComputedStyle(document.documentElement);
    var read = function (name, fallback) {
      var v = cs.getPropertyValue(name).trim();
      return v || fallback;
    };
    return {
      panel: read('--bg-panel', FALLBACK.panel),
      border: read('--border-strong', FALLBACK.border),
      bone: read('--accent-pink', FALLBACK.bone)
    };
  }

  function build(t) {
    var bodies = BODIES.map(function (b) {
      return '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '"/>';
    }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
      + '<rect x="0.5" y="0.5" width="31" height="31" fill="' + t.panel + '" stroke="' + t.border + '"/>'
      + '<g fill="' + t.bone + '">' + bodies + '</g>'
      + '</svg>';
  }

  function paint() {
    var t = tokens();
    var key = t.panel + '|' + t.border + '|' + t.bone;
    if (key === last) return;          // avoid pointless href churn / tab flicker
    last = key;
    link.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(build(t)));
  }

  // Catches every route to a theme change — the picker, a ?theme= deep link, and
  // theme-init.js applying a saved choice before paint.
  new MutationObserver(paint).observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-theme']
  });

  // With no data-theme the tokens follow the OS, so track that too.
  var os = window.matchMedia('(prefers-color-scheme: dark)');
  if (os.addEventListener) os.addEventListener('change', paint);
  else if (os.addListener) os.addListener(paint);

  paint();
})();
