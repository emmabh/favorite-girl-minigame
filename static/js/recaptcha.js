(function(g, r, s, f) {
  if (document.getElementById("recaptcha")) {
    return;
  }
  const KEY = null;

  s = r.getElementsByTagName("head")[0];
  f = r.createElement("script");
  f.async = 1;
  f.id = "recaptcha";
  f.src = `https://www.google.com/recaptcha/api.js?render=${KEY}`;
  s.appendChild(f);
})(window, document);
