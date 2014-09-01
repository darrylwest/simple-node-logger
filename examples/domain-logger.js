#!/usr/bin/env node

var filename = '/tmp/file-test.log';
console.log('a category logger with console and file appenders...\nlog file: ', filename);

var SimpleLogger = require('../lib/SimpleLogger'),
    opts = {
        domain:'MyDomain',
        dfltLevel:'debug'
    },
    manager = new SimpleLogger( opts ),
    log1,
    log2;

manager.addAppender( manager.createConsoleAppender() );
manager.addAppender( manager.createFileAppender( { logFilePath:filename } ));

log1 = manager.createLogger( 'CategoryOne' );
log2 = manager.createLogger( 'CategoryTwo' );

log1.trace('this is a simple info log statement/entry: ', opts);
log1.debug('this is a simple debug log statement (should not show)');
log1.info('this is a simple trace log statement: ', { thedate:new Date() }, ', now: ', new Date(), 1,2,3 );
log2.trace('this is a simple warn log statement/entry');
log1.error('this is a simple error log statement/entry: ', manager, 4,5);
log2.fatal('this is a simple fatal log statement/entry');

log2.trace('this is a simple trace log statement (should show)');
log1.debug('this is a simple debug log statement (should show)');

