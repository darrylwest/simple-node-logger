#!/usr/bin/env node

var conf = {};

conf.readLoggerConfig = function() {
    var opts = {
        logDirectory: __dirname + '/../logs',
        fileNamePattern: 'dynamic-<date>.log',
        dateFormat:'YYYY.MM.DD-a',
        level:'info'
    };

    return opts;
};

// console.log(conf.readLoggerConfig() );

var log = require('../lib/SimpleLogger').createRollingFileLogger( conf );

// write some stuff...
log.trace('this is a simple trace log statement (should not show)');
log.debug('this is a simple debug log statement (should not show)');
log.info('this is a simple info log statement/entry');
log.warn('this is a simple warn log statement/entry');
log.error('this is a simple error log statement/entry');
log.fatal('this is a simple fatal log statement/entry');

var appender = log.getAppenders()[0];
console.log('write to file: ', appender.__protected().currentFile );

// rolling file writer uses interval, so we need to exit 
setTimeout(function() {
    log.info('changed level...');
    // process.exit( 0 );
}, 1000);

