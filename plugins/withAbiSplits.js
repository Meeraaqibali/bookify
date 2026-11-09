const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAbiSplits(config) {
  return withAppBuildGradle(config, (config) => {
    // Add ABI splits to reduce APK size
    config.modResults.contents = config.modResults.contents.replace(
      /android {/,
      `android {
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
            universalApk false
        }
    }`
    );
    return config;
  });
};
