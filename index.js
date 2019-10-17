const semver = require("semver");
const npmFetch = require("npm-registry-fetch");
const { noopLogger } = require("./utils");

const setLatestTag = async (
  pkgName,
  version,
  npmConfig,
  { dryRun, logger, successMessage }
) => {
  logger.info(`${pkgName}: Crowning ${version}.`);

  if (dryRun) {
    logger.info(`${pkgName}: ${successMessage}`);
    return;
  }

  try {
    await npmFetch(`/-/package/${pkgName}/dist-tags/latest`, {
      ...npmConfig,
      method: "PUT",
      body: JSON.stringify(version),
      headers: {
        "content-type": "application/json"
      }
    });
  } catch (e) {
    logger.error(`${pkgName}: Unsuccessful coronation.`);
    console.log(e);
    throw e;
  }

  logger.info(`${pkgName}: ${successMessage}`);
};

module.exports = async (
  pkgName,
  npmConfig,
  { logger = noopLogger, dryRun = false }
) => {
  const pkgData = await npmFetch.json(pkgName, npmConfig);

  const latestTag = (pkgData["dist-tags"] || {})["latest"];
  const availableVersions = Object.keys(pkgData["versions"] || {});
  const sortedVersionsDesc = availableVersions.sort((v1, v2) =>
    semver.lt(v1, v2) ? 1 : -1
  );
  const latestAvailableVersion = sortedVersionsDesc[0];

  const crown = async successMessage =>
    await setLatestTag(pkgName, latestAvailableVersion, npmConfig, {
      dryRun,
      logger,
      successMessage
    });

  if (!latestAvailableVersion) {
    logger.error(`${pkgName}: No monarchs exists!`);
    return;
  }

  if (!latestTag) {
    logger.warn(
      `${pkgName}: Abstence of an aristocratic system! Fixing with immidiate cronation.`
    );
    await crown("Long live the Queen!");
    return;
  }

  if (semver.eq(latestTag, latestAvailableVersion)) {
    logger.verbose(`${pkgName}: ${latestTag} is our undubted queen.`);
    return;
  }

  if (semver.gt(latestAvailableVersion, latestTag)) {
    logger.info(
      `${pkgName}: ${latestTag} no longer the youngest monarch of ${pkgName} and it's time for her to abdicate.`
    );
    await crown("Long live the Queen!");
  } else {
    logger.warn(
      `${pkgName}: The Queen ${latestTag} is dead! An accession must take place to safeguard the aristocracy.`
    );
    await crown("The Queen is dead, long live the Queen!");
  }
};
