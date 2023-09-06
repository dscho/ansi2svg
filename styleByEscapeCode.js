const breakers = {
  22: { "font-weight": "normal" },
  23: { "font-variant": "italic" },
  24: { "text-decoration": "none" },
  39: { color: "inherit" },
  49: { background: "inherit" }
};

const styleByEscapeCode = (code, starters) => {
  code = +code;
  let style = starters[code];

  if (!style) {
    style = breakers[code];
    if (style) style.breaker = true;
  }

  if (!style) {
    style = { breaker: true };
  }

  return style;
};

module.exports = styleByEscapeCode;
