/**
 *
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/7/14 5:15 PM
 */
var Logger = require('./Logger' ),
    moment = require('moment' ),
    fs = require( 'fs' ),
    path = require( 'path' );

var FileAppender = function(options) {
    'use strict';

    var appender = this,
        typeName = options.typeName || 'FileAppender',
        logFilePath = options.logFilePath,
        level = options.level || Logger.DEFAULT_LEVEL,
        levels = options.levels || Logger.STANDARD_LEVELS,
        currentLevel = levels.indexOf( level ),
        separator = options.separator || ' ',
        writer = options.writer;

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
        fields.push( '\n' );

        return fields.join( separator );
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

    /**
     * return the type name of this appender (ConsoleAppender)
     */
    this.getTypeName = function() {
        return typeName;
    };


    // writer is opened on construction
    var openWriter = function() {
        if (!writer) {
            var file = path.normalize( logFilePath ),
                opts = {
                    flags:'a',
                    encoding:'utf8',
                    mode:438 // decimal for 0666
                };

            writer = fs.createWriteStream( logFilePath, opts );
            writer.write('\n');
        }
    };

    this.closeWriter = function() {
        if (writer) {
            writer.end('\n');
        }
    };

    // constructor tests
    if (!logFilePath) throw new Error('appender must be constructed with a log file path');

    openWriter();
};

module.exports = FileAppender;