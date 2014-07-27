/**
 * @class RollingFileAppender
 *
 * roll on size and/or date/time;
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/27/14 9:52 AM
 */
var Logger = require('./Logger' ),
    AbstractAppender = require('./AbstractAppender' ),
    fs = require( 'fs' ),
    path = require( 'path' );

var RollingFileAppender = function(options) {
    'use strict';

    var appender = this,
        typeName = options.typeName,
        fileDirectory = options.fileDirectory,
        fileNamePattern = options.fileNamePattern,
        level = options.level || Logger.DEFAULT_LEVEL,
        levels = options.levels || Logger.STANDARD_LEVELS,
        currentLevel = levels.indexOf( level ),
        writer = options.writer;

    if (!typeName) {
        typeName = options.typeName = 'RollingFileAppender';
    }

    AbstractAppender.extend( this, options );

    /**
     * default formatter for this appender;
     * @param entry
     */
    this.formatter = function(entry) {
        var fields = appender.formatEntry( entry );

        fields.push( '\n' );

        return fields.join( appender.separator );
    };

    /**
     * call formatter then write the entry to the console output
     * @param entry - the log entry
     */
    this.write = function(entry) {
        if (levels.indexOf( entry.level ) >= currentLevel) {
            writer.write( appender.formatter( entry ) );
        }
    };

    // constructor tests
    if (!fileDirectory) throw new Error('appender must be constructed with a file directory');
    if (!fileNamePattern) throw new Error('appender must be constructed with a file name pattern');
};

module.exports = RollingFileAppender;