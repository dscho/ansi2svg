ansi2svg
========

![Dependencies](https://david-dm.org/Rundik/ansi2svg.svg)

It is a stream to transform terminal color sequences to svg image. Forked from [ansi2html](https://github.com/marinintim/ansi2html).

## Usage
```bash
tmux capture-pane -et 0: -p | ./ansi2svg > out.svg
# will write svg into out.svg
```
