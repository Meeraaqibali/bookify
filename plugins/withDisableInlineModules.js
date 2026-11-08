const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withDisableInlineModules(config) {
  return withGradleProperties(config, (config) => {
    // Safely remove existing inline module properties.
    // We check that the item is a property AND has a key before calling includes().
    config.modResults = config.modResults.filter((item) => {
      if (item.type === 'property' && item.key && item.key.includes('expo.inlineModules.watchedDirectories')) {
        return false; // remove this item
      }
      return true; // keep everything else
    });

    // Add a clean property forced to an empty array.
    config.modResults.push({
      type: 'property',
      key: 'expo.inlineModules.watchedDirectories',
      value: '[]',
    });

    return config;
  });
};
