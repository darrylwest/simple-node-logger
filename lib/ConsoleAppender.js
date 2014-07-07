/**
 * @class ConsoleAppender
 * @classdesc ConsoleAppender writes to the console all entries at or above the specified level.
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14 12:02 PM
 */
var Logger = require('./Logger' ),
    moment = require('moment');

var ConsoleAppender = function(options) {
    'use strict';

    var appender = this,
        typeName = options.typeName || 'ConsoleAppender',
        level = options.level || Logger.STANDARD_LEVELS[0],
        levels = options.levels || Logger.STANDARD_LEVELS,
        currentLevel = levels.indexOf( level ),
        separator = options.separator || ': ',
        writer = options.writer || console.log;

    /**
     * default formatter for this appender;
     * @param entry
     */
    this.formatter = function(entry) {
        var fields = [];

        fields.push( moment( entry.ts ).format('HH:mm:ss.SSS') );
        fields.push( entry.level.toUpperCase() );
        fields.push( entry.category );
        fields.push( entry.msg.join('') );

        return fields.join( separator );
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

    /**
     * return the type name of this appender (ConsoleAppender)
     */
    this.getTypeName = function() {
        return typeName;
    };
};

module.exports = ConsoleAppender;
