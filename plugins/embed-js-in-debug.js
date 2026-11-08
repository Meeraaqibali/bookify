const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withEmbedJsInDebug(config) {
  return withAppBuildGradle(config, (config) => {
    // This adds the property to the react block in build.gradle
    config.modResults.contents = config.modResults.contents.replace(
      /react {/,
      `react {\n        debuggableVariants = []`
    );
    return config;
  });
};
