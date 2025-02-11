const path = require('path');
const moment = require('moment');

module.exports = {
  i18n: {
    localeDetection: true,
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    localePath: path.resolve('./public/locales'),
    keySeparator: '.',
    serializeConfig: false, // More info at https://github.com/isaachinman/next-i18next#unserialisable-configs
    interpolation: {
      format: function (value, format, lng) {
        if (value instanceof Date) return moment(value).format(format);
        return value;
      },
    },
  },
};
