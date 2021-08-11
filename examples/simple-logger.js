#!/usr/bin/env node

const log = require('../lib/SimpleLogger').createSimpleLogger({level: 'info'});

log.trace('this is a simple trace log statement (should not show)');
log.debug('this is a simple debug log statement (should not show)');
log.info('this is a simple info log statement/entry');
log.warn('this is a simple warn log statement/entry');
log.error('this is a simple error log statement/entry');
log.fatal('this is a simple fatal log statement/entry');

// test logging a null
log.error();

log.info('set the level to all');
log.setLevel('all');
log.trace('this is a simple trace log statement (should show)');
log.debug('this is a simple debug log statement (should show)');

// example of an override
log.warn = function() {
    const args = Array.prototype.slice.call(arguments);
    const entry = log.log('warn', args);

    process.nextTick(function() {
        console.log('custom:', JSON.stringify(entry));
    });
};

log.warn('this is an override test...');

