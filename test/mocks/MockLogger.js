/**
 * @class MockLogger
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/8/14 5:16 PM
 */
const dash = require('lodash' ),
    Logger = require('../../lib/Logger' ),
    MockAppender = require('./MockAppender');

const MockLogger = function(opts) {
    'use strict';

    const mock = this,
        appender = new MockAppender();

    if (!opts) opts = {};
    if (!opts.pid) opts.pid = 'test12345';
    if (!opts.appenders) opts.appenders = [ appender ];
    if (!opts.level) opts.level = 'trace';

    dash.extend( this, new Logger(opts) );

    this.getLogEntries = function() {
        return appender.entries;
    };
};

MockLogger.createLogger = function(category, level) {
    'use strict';

    const opts = {};

    if (category) opts.category = category;
    if (level) opts.level = level;

    return new MockLogger( opts );
};

module.exports = MockLogger;
