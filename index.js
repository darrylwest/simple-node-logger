
/** darryl.west@raincitysoftware.com **/

const fs = require( 'fs' );

module.exports = require('./lib/SimpleLogger');
module.exports.AbstractAppender = require('./lib/AbstractAppender');
module.exports.Logger = require('./lib/Logger');

module.exports.appenders = {
    ConsoleAppender:require('./lib/ConsoleAppender'),
    FileAppender:require('./lib/FileAppender'),
    RollingFileAppender:require('./lib/RollingFileAppender')
};

if (fs.existsSync('./test/')) {
    module.exports.mocks = {
        MockAppender: require('./test/mocks/MockAppender'),
        MockLogger: require('./test/mocks/MockLogger')
    };
}

