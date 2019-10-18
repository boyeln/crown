#!/usr/bin/env node

const meow = require("meow");

const checkPackageLatestTag = require("./index");
const {
  getNpmConfig,
  getAllPackagesByName,
  getPackagesAndDependenciesByName,
  noop
} = require("./utils");

const cli = meow(
  `
  Ensures the youngest (newest) monarch (version) within kingdoms (packages)
  holds the royal office (is taggeed as latest).

  Usage
    $ crown [<kingdom>...] [options]
      
  Options
    --verbose   Indulge in verbosity.
    --dry-run   Run without updating.
    --no-info   Hide info output.
    --no-warn   Hide warnings.
    --no-error  Hide errors.
    --help      Display this text.
    --version   Display the version.

  Configuration
    crown adheres to the the .npmrc file within your home directory.
  
  Terminology
    Imagine the npm package registry as a world of aristocracies. 
    Each package is regarded as a kingdom, and its dependencies are its
    neighboring kingdoms. Each kingdom (if it's a proper aristocracy) has one
    or more monarchs (the versions of the package). The reigning monarch (the
    version tagged with latest), is known as the Queen. Each kingdom (package)
    must have exactly one queen (latest version) at any given point. Opposed to
    the usual aristocracy systems, the youngest (newest) monarch (version)
    should always rule (be tagged as latest).

  Why do I need this?
    Not all queens gives the throne away when a younger monarch comes along.
    Hence, a system to regularly inspect the queen of a kingdom and abdicates
    her if she's not the youngest monarch of the kingdom is useful. This
    library does just that. It inspect one or more kingdoms and their
    neighboring kingsoms (recursivly). If a kingdom has a monarch younger than
    the queen, the queen is abdicated and the younger monarch is crowned. If
    for some reason the kingdom does not have a queen (no latest tag), the
    youngest monarch is immidiety crowned to recover from the aristocratic
    collapse. Also, if the queen is deceased (the version tagged as latest does
    not exist), the youngest monarch is also immidietly crowned.
`,
  {
    flags: {
      verbose: {
        type: "boolean",
        default: false
      },
      info: {
        type: "boolean",
        default: true
      },
      warn: {
        type: "boolean",
        default: true
      },
      error: {
        type: "boolean",
        default: true
      },
      "dry-run": {
        type: "boolean",
        default: false
      }
    },
    description: false
  }
);

async function main(input, { dryRun, verbose, info, warn, error }) {
  const npmConfig = getNpmConfig();

  const logger = {
    verbose: verbose ? console.log : noop,
    info: info ? console.info : noop,
    warn: warn ? console.warn : noop,
    error: error ? console.error : noop
  };

  logger.info("Resolving kingdoms...");

  try {
    const packages =
      input.length === 0
        ? await getAllPackagesByName(npmConfig)
        : await getPackagesAndDependenciesByName(input, npmConfig);

    logger.info("Inspecting reigning monarchs...");

    for (pkg of packages) {
      await checkPackageLatestTag(pkg, npmConfig, { logger, dryRun });
    }

    logger.info("Done.");
  } catch (e) {
    console.error(e.message);

    if (e.message.includes("401")) {
      console.log("There is likely something wrong with your credentials.");
      console.log("Use `npm adduser` to add credentials.");
    }
    process.exit(1);
  }
}

main(cli.input, cli.flags);
