// Web-app URL van het Google-script (zie README).
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnxBVi5iplkh4MwE54boyDvJYRRmoajLGgJhVYlcnLRj5Zo8jUQQnW-r8GpW8PKtr-Dg/exec';

// Muiscursor automatisch verbergen na 3 seconden zonder beweging (voor tv's).
(function () {
  const IDLE_MS = 3000;
  const style = document.createElement('style');
  style.textContent = 'html.idle-cursor, html.idle-cursor * { cursor: none !important; }';
  document.head.appendChild(style);
  const root = document.documentElement;
  let timer;
  function wake() {
    root.classList.remove('idle-cursor');
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.add('idle-cursor'), IDLE_MS);
  }
  ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(e =>
    document.addEventListener(e, wake, { passive: true }));
  wake();
})();
