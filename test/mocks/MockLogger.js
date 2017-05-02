/**
 * @class MockLogger
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/8/14 5:16 PM
 */
const dash = require('lodash' ),
    Logger = require('../../lib/Logger' ),
    MockAppender = require('./MockAppender');

const MockLogger = function(options) {
    'use strict';

    const opts = Object.assign({}, options);

    // const mock = this;
    const appender = new MockAppender();

    // set these if not passed in
    if (!opts.pid) {
        opts.pid = 'test12345';
    }
    if (!opts.appenders) {
        opts.appenders = [ appender ];
    }
    if (!opts.level) {
        opts.level = 'trace';
    }

    dash.extend( this, new Logger(opts) );

    this.getLogEntries = function() {
        return appender.entries;
    };
};

MockLogger.createLogger = function(category, level) {
    'use strict';

    const opts = {};

    if (category) {
        opts.category = category;
    }
    if (level) {
        opts.level = level;
    }

    return new MockLogger( opts );
};

module.exports = MockLogger;
