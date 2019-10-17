# crown

**This library considers npm an aristocratic system.**

> The full honorary title of react version 16.10.2: "16.10 the Second, by the
> Grace of God of React, Defender of the Faith"

## npm as an aristocracy

Each package is regarded as a kingdom, and its dependencies are its
neighboring kingdoms. Each kingdom (if it's a proper aristocracy) has one or
more monarchs (the versions of the package). The reigning monarch (the version
tagged with latest), is known as the Queen. Each kingdom (package) must have
exactly one queen (latest version) at any given point. Opposed to the usual
aristocracy systems, the yongest (newest) monarch (version) should always rule
(be tagged as latest).

## What do you need this library for?

Not all queens gives the throne away when a younger monarch comes along. Hence,
a system to regularly inspect the queen of a kingdom and abdicates her if she's
not the youngest monarch of the kingdom is useful. This library does just that.
It inspect one or more kingdoms and their neighboring kingsoms (recursivly).
If a kingdom has a monarch younger than the queen, the queen is abdicated and
the younger monarch is crowned. If for some reason the kingdom does not have a
queen (no latest tag), the youngest monarch is immidiety crowned to recover
from the aristocratic collapse. Also, if the queen is deceased (the version
tagged as latest does not exist), the youngest monarch is also immidietly
crowned.

## Install

Install with npm:

```
npm install --global @boyeborg/crown
```

## Usage

```
$ crown --help

  Ensures the youngest (newest) monarch (version) within kingdoms (packages)
  holds the royal office (is taggeed as latest).

  Usage
    $ crown [<package>...] [options]

  Options
    --verbose   Indulge in verbosity.
    --dry-run   Run without updating.
    --no-info   Hides info output.
    --no-warn   Hide warnings.
    --no-error  Hide errors.
    --help      Display this text.
    --version   Display the version.

  Configuration
    crown adheres to the the .npmrc file within your home directory.
```

You can also use the package as a module like so:

```
const crown = require("@boyeborg/crown");

const npmConfig = {
  token: "secret"
  /* other npm config, see https://github.com/npm/npm-registry-fetch */
};
const logger = {
  verbose: (msg) => { /* Handle verbose message */ },
  info: (msg) => { /* Handle info message */ },
  warn: (msg) => { /* Handle warn message */ },
  error: (msg) => { /* Handle error message */ }
};

crown("react", { token: "secret" }).then(() => console.log("done!"));
```
