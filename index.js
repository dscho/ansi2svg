const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const path = require("path");

if (argv?.version) {
  console.log(JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")).toString()).version);
  process.exit();
}

let starters;
const startersPath = argv.colors || path.join(__dirname, "starters.json");
try {
  starters = JSON.parse(fs.readFileSync(startersPath).toString());
} catch (err) {
  starters = JSON.parse(fs.readFileSync(path.join(__dirname, "starters.json")).toString());
}

const styleByEscapeCodeSource = require("./styleByEscapeCode.js");
const styleByEscapeCode = code => styleByEscapeCodeSource(code, starters);

const through = require("through2");

function inliner(style) {
  return Object.keys(style).map(function (k) {
    if (style[k]) {
      return ` ${k}="${style[k]}`;
    }
  }).join(" ");
}

function classifier(style, prefix) {
  return Object.keys(style).map(function (k) {
    if (style[k]) {
      return prefix + k + "-" + style[k];
    }
  }).join(" ");
}

function getReplacer(opts) {
  return function replaceColor(match) {
    let res = "";
    const styles = match.slice(2, -1).split(";").map(styleByEscapeCode);

    const breakers = [];
    const colors = [];

    styles.forEach(function (style) {
      if (style.breaker) breakers.push(style);
      else colors.push(style);
    });

    if (breakers.length && opts.remains > 0) {
      res += "</tspan>".repeat(breakers.length);
    } 

    if (colors.length) {
      const color = colors.reduce(function (color, style) {
        for (const k in style) {
          color[k] = style[k] || color[k];
        }
        return color;
      }, {});

      res += "<tspan" +
        (opts.style === "inline"
          ? inliner(color)
          : " class=\"" + classifier(color, opts.prefix))
        + "\">";
      opts.remains += 1;
    }

    return res;
  };
}



module.exports = function (opts) {
  const rg = new RegExp("\u001b\\[[0-9;]*m", "g");

  opts = opts || {};
  opts.style = opts.style === "class" ? "class" : "inline";
  opts.prefix = opts.prefix || "ansi2svg-";
  opts.remains = 0;

  const replacer = getReplacer(opts);

  function onEnd(done) {
    this.push("</svg>");
    done();
  }

  function onChunk(buf, _, next) {
    const output = buf.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(rg, replacer).split("\n");
    const longestLine = output.reduce((a, v) => v.length > a.length ? v : a, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
      longestLine.length*7
    } ${
      output.length * 16
    }"><rect width="100%" height="100%" fill="${starters?.background}"/>${
      output.map((l, i) => {
        const line = l.replace(/^<\/tspan>/g, "");
        const needToClose = (line.match(/<tspan/g)?.length || 0)
          - (line.match(/<\/tspan/g)?.length || 0);
        let out = `<text x="0" dy="${i+1}em" fill="${starters?.foreground}">${line}${
          "</tspan>".repeat(Math.max(0, needToClose))
        }</text>`;
        if (needToClose < 0)
          for (let i = 0; i < Math.abs(needToClose); i++)
            out = out.replace(/<\/tspan><\/text>/g, "</text>");
        return out.replace(/</g, " <");
      }).join("\n")
    }`;
    this.push(svg);
    next();
  }

  return through(onChunk, onEnd);
};
