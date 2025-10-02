const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration pour résoudre l'erreur <anonymous>
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
  unstable_enablePackageExports: true,
};

config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve('metro-minify-terser'),
};

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Ignorer les requêtes pour <anonymous>
      if (req.url.includes('<anonymous>')) {
        return res.end();
      }
      return middleware(req, res, next);
    };
  }
};

module.exports = config;