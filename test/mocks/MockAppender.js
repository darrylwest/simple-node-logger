/**
 * @class MockAppender
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14 8:41 AM
 */
const MockAppender = function() {
    'use strict';
    const Logger = require('../../lib/Logger' );

    let level  = Logger.DEFAULT_LEVEL;
    let levels = Logger.STANDARD_LEVELS;
    let currentLevel = levels.indexOf( level );

    let appender = this;

    this.entries = [];

    this.setLevel = function(level) {
        let idx = levels.indexOf( level );
        if (idx >= 0) {
            currentLevel = idx;
        }
    };

    this.getCurrentLevel = function() {
        return currentLevel;
    };

    this.write = function(entry) {
        appender.entries.push( entry );
    };
};

module.exports = MockAppender;
