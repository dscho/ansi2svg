var starters = {
  1: { "font-weight": "bold" },
  3: { "font-variant": "italic" },
  4: { "text-decoration": "underline" },
  30: { fill: "black" },
  31: { fill: "red" },
  32: { fill: "green" },
  33: { fill: "yellow" },
  34: { fill: "blue" },
  35: { fill: "magenta" },
  36: { fill: "cyan" },
  37: { fill: "white" },
  90: { fill: "gray" },
  40: { background: "black" },
  41: { background: "red" },
  42: { background: "green" },
  43: { background: "yellow" },
  45: { background: "blue" },
  46: { background: "cyan" },
  47: { background: "white" },
};

var breakers = {
  22: { "font-weight": "normal" },
  23: { "font-variant": "italic" },
  24: { "text-decoration": "none" },
  39: { color: "inherit" },
  49: { background: "inherit" }
};

var styleByEscapeCode = function(code) {
  code = +code;
  var style = starters[code];

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
