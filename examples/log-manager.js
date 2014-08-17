#!/usr/bin/env node

var opts = {
    logDirectory: __dirname + '/../logs',
    fileNamePattern: 'apptest-<date>.log',
    dateFormat:'YYYY.MM.DD-HHa'
};

var manager = require('../lib/SimpleLogger').createLogManager( );
log = manager.createLogger('MyCategory');

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

