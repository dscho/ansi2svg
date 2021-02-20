ansi2svg
========

![Dependencies](https://david-dm.org/Rundik/ansi2svg.svg)

It is a stream to transform terminal color sequences to svg image. Forked from [ansi2html](https://github.com/marinintim/ansi2html).

## Usage
```
var ansi2svg = require('stream-ansi2svg')

var s = Readable()
s.push('\u001b\[32m;Hello, Github')
s.push(null)

s.pipe(ansi2svg()).pipe(process.stdout)
// will output <span style="color: green;">Hello, Github</span>
```

## Options

There is a couple of options to trigger. Pass them as first argument to `ansi2svg`

```
var mySuperStream = ansi2svg({ style: 'class', prefix: 'mySuperPrefix-' })
s.pipe(mySuperStream).pipe(process.stdout)
// will output <span class="mySuperPrefix-color-green">Hello, Github</span>
```

`style`: 'inline' | 'class'. Inline is default and will apply styles, well, inline.
Class instead only adds classes to span, you should style them. Classes are named
with this pattern: `prefix-property-value`.

`prefix`: `ansi2svg-` | String. Has effect only with `style: 'class'`.
