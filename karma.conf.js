module.exports = function(config) {
  config.set({
    browsers: ['myPhantomJS'],

    // you can define custom flags
    customLaunchers: {
      'myPhantomJS': {
        base: 'PhantomJS',
        options: {
           settings: {
            webSecurityEnabled: false
          },
        },
      }
    },

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },

    frameworks: ['jasmine'],
    files: [
      'https://cdn.jsdelivr.net/lodash/4.16.4/lodash.min.js',
      'src/js/*.js',
      'src/test/*.spec.js'
    ],

    reporters: ['mocha'],

  });
};