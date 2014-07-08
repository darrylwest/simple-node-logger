#!/usr/bin/env node

var filename = './logs/json-test.log';
console.log('opening log file: ', filename);

var SimpleLogger = require('../lib/SimpleLogger');
    manager = new SimpleLogger(),
    opts = {
        logFilePath:filename
    },
    appender = manager.createFileAppender( opts );

appender.formatter = function(entry) {
    var fields = appender.formatEntry( entry );

    fields[1] = entry.level;

    return JSON.stringify( fields ) + '\n';
};

manager.addAppender( appender );
var log = manager.createLogger('JSON');

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

