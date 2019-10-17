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
