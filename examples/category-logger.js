#!/usr/bin/env node

var filename = '/tmp/file-test.log';
console.log('a category logger with console and file appenders...\nlog file: ', filename);

var SimpleLogger = require('../lib/SimpleLogger'),
    manager = new SimpleLogger(),
    log1,
    log2;

manager.addAppender( manager.createConsoleAppender() );
manager.addAppender( manager.createFileAppender( { logFilePath:filename } ));

log1 = manager.createLogger( 'CategoryOne', 'trace' );
log2 = manager.createLogger( 'CategoryTwo', 'trace' );

log1.trace('this is a simple trace log statement (should not show)');
log1.debug('this is a simple debug log statement (should not show)');
log1.info('this is a simple info log statement/entry');
log2.warn('this is a simple warn log statement/entry');
log1.error('this is a simple error log statement/entry');
log2.fatal('this is a simple fatal log statement/entry');

log2.trace('this is a simple trace log statement (should show)');
log1.debug('this is a simple debug log statement (should show)');

