#!/usr/bin/env node

var opts = {
    domain:'Domain-A',
    logDirectory: __dirname + '/../logs',
    fileNamePattern: 'hourly-test-<date>.log',
    dateFormat:'YYYY.MM.DD-HH'
};

var log = require('../lib/SimpleLogger').createRollingFileLogger( opts );

setInterval(function() {
    // write some stuff...
    log.trace('this is a simple trace log statement (should not show)');
    log.debug('this is a simple debug log statement (should not show)');
    log.info('this is a simple info log statement/entry');
    log.warn('this is a simple warn log statement/entry');
    log.error('this is a simple error log statement/entry');
    log.fatal('this is a simple fatal log statement/entry');

    log.info('set the level to all');
    log.setLevel('all');
    log.trace('this is a simple trace log statement (should show)');
    log.debug('this is a simple debug log statement (should show)');

}, 800);

var appender = log.getAppenders()[0];
console.log('write to file: ', appender.__protected().currentFile );

setTimeout(function() {
    console.log('exiting...');
    process.exit( 0 );
}, 2000);
