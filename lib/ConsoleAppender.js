/**
 * @class ConsoleAppender
 * @classdesc ConsoleAppender writes to the console all entries at or above the specified level.
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14 12:02 PM
 */
const Logger = require('./Logger' ),
    AbstractAppender = require('./AbstractAppender' );

const ConsoleAppender = function(options) {
    'use strict';

    if (!options) options = {};

    let appender = this,
        typeName = options.typeName,
        level = options.level || Logger.STANDARD_LEVELS[0],
        levels = options.levels || Logger.STANDARD_LEVELS,
        currentLevel = levels.indexOf( level ),
        writer = options.writer || console.log;

    if (!typeName) {
        typeName = options.typeName = 'ConsoleAppender';
    }

    AbstractAppender.extend( this, options );

    /**
     * default formatter for this appender;
     * @param entry
     */
    this.formatter = function(entry) {
        var fields = appender.formatEntry( entry );

        return fields.join( appender.separator );
    };

    /**
     * call formatter then write the entry to the console output
     * @param entry - the log entry
     */
    this.write = function(entry) {
        if (levels.indexOf( entry.level ) >= currentLevel) {
            writer( appender.formatter( entry ));
        }
    };

    this.setLevel = function(level) {
        const idx = levels.indexOf( level );
        if (idx >= 0) {
            currentLevel = idx;
        }
    };
};

module.exports = ConsoleAppender;
