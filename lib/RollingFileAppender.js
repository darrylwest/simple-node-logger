/**
 * @class RollingFileAppender
 *
 * roll on size and/or date/time;
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/27/14 9:52 AM
 */
var Logger = require( './Logger' ),
    AbstractAppender = require( './AbstractAppender' ),
    dash = require( 'lodash' ),
    moment = require( 'moment' ),
    fs = require( 'fs' ),
    path = require( 'path' );

var RollingFileAppender = function(options) {
    'use strict';

    var appender = this,
        typeName = options.typeName,
        autoOpen = dash.isBoolean( options.autoOpen ) ? options.autoOpen : true,
        logDirectory = options.logDirectory,
        fileNamePattern = options.fileNamePattern,
        dateFormat = options.dateFormat || 'YYYY.MM.DD',
        level = options.level || Logger.DEFAULT_LEVEL,
        levels = options.levels || Logger.STANDARD_LEVELS,
        currentLevel = levels.indexOf( level ),
        writers = [];

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
            var writer = getWriter();
            writer.write( appender.formatter( entry ) );
        }
    };

    this.checkForRoll = function(now) {
        // check to see if the
    };

    this.createFileName = function(now) {
        var dt;

        if (now || now instanceof moment) {
            dt = now.format( dateFormat );
        } else {
            dt = moment().format( dateFormat );
        }

        return fileNamePattern.replace( /<DATE>/i, dt );
    };

    var getWriter = function() {
        return writers[0];
    };

    var openWriter = function(filename) {
        var file = appender.createFileName( new Date() ),
            writer;
    };

    // constructor tests
    if (!logDirectory) throw new Error('appender must be constructed with a log directory');
    if (!fileNamePattern) throw new Error('appender must be constructed with a file name pattern');

    if (autoOpen) {
        writers.push( openWriter() );
    }
};

module.exports = RollingFileAppender;