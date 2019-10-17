const os = require("os");
const fs = require("fs");
const path = require("path");
const ini = require("ini");
const carve = require("@boyeborg/carve");
const npmFetch = require("npm-registry-fetch");

const getNpmConfig = () => {
  const configPath = path.join(os.homedir(), ".npmrc");
  const configFile = fs.readFileSync(configPath, "utf-8");
  return ini.parse(configFile);
};

const getAllPackagesByName = async npmConfig => {
  const results = await npmFetch.json("/-/all", npmConfig);
  return Object.values(results)
    .splice(1)
    .map(pkg => pkg.name);
};

const getPackagesAndDependenciesByName = async (packages, npmConfig) => {
  const registry = npmConfig.registry;
  const carvedPackages = await carve(packages, { registry });
  const packageNames = Object.keys(carvedPackages);
  // Remove version tag
  return packageNames.map(pkg =>
    pkg
      .split("@")
      .slice(0, -1)
      .join("@")
  );
};

const noop = () => {};

const noopLogger = { verbose: noop, info: noop, warn: noop, error: noop };

module.exports = {
  getNpmConfig,
  getAllPackagesByName,
  getPackagesAndDependenciesByName,
  noop,
  noopLogger
};
