const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withDisableInlineModules(config) {
  return withGradleProperties(config, (config) => {
    // Remove any existing inline module properties that cause the JSON crash
    config.modResults = config.modResults.filter(
      (item) => !item.key.includes('expo.inlineModules.watchedDirectories')
    );
    
    // Force it to be exactly an empty array []
    config.modResults.push({
      type: 'property',
      key: 'expo.inlineModules.watchedDirectories',
      value: '[]',
    });
    
    return config;
  });
};
