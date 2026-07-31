/* Compacts the theme picker's trigger down to a colour swatch plus a caret.

   Theming is a convenience here, not part of the record, so the control should not
   compete with the view toggle. The dropdown's own value text is kept in the DOM
   and only visually hidden (see .prefs .dropdown-value in app.css), so the button's
   accessible name stays "Theme, <current theme>" exactly as a native select would
   announce — nothing is lost to a screen reader by shrinking it.

   Runs after theme-select.js has populated the <select> and rebuilt the listbox,
   which is why this file is loaded last. */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var select = document.querySelector('select[data-theme-select]');
    if (!select) return;

    var wrap = select.closest('.dropdown');
    if (!wrap) return;                       // dropdown.js absent — native select stays
    var toggle = wrap.querySelector('.dropdown-toggle');
    if (!toggle) return;

    var swatch = document.createElement('span');
    swatch.className = 'trigger-swatch';
    swatch.setAttribute('aria-hidden', 'true');   // the accessible name already carries it
    toggle.insertBefore(swatch, toggle.firstChild);

    function paint() {
      var option = select.options[select.selectedIndex];
      var colors = (option && option.getAttribute('data-dropdown-swatch') || '').split(',');
      swatch.textContent = '';
      colors.forEach(function (c) {
        if (!c.trim()) return;
        var dot = document.createElement('span');
        // A literal colour is legitimate here: it comes from the theme data, not
        // from the stylesheet.
        dot.style.background = c.trim();
        swatch.appendChild(dot);
      });
    }

    select.addEventListener('change', paint);
    paint();
  });
})();
