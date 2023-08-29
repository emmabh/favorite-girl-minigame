(function (g, r, s, f) {
  if (document.getElementById("recaptcha")) {
    return;
  }
  const KEY = "6LdSZ8QnAAAAAPFHWrpFkXoGkC0CaDFtOd6xtWW1";

  s = r.getElementsByTagName("head")[0];
  f = r.createElement("script");
  f.async = 1;
  f.id = "recaptcha";
  f.src = `https://www.google.com/recaptcha/enterprise.js?render=${KEY}`;
  s.appendChild(f);
})(window, document);
