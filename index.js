
module.exports = require('./lib/SimpleLogger');
module.exports.AbstractAppender = require('./lib/AbstractAppender');
module.exports.Logger = require('./lib/Logger');

module.exports.mocks = {
    MockAppender:require('./test/mocks/MockAppender'),
    MockLogger:require('./test/mocks/MockLogger')
};
