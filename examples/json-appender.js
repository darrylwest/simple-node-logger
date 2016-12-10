#!/usr/bin/env node

const SimpleLogger = require('../index.js');
    Logger = require('../lib/Logger'),
    AbstractAppender = SimpleLogger.AbstractAppender,
    manager = new SimpleLogger();

const JSONAppender = function(options = {}) {
    const appender = this,
        opts = {
            typeName:'JSONAppender'
        };

    let level = options.level || Logger.STANDARD_LEVELS[1];
    let levels = options.levels || Logger.STANDARD_LEVELS;

    AbstractAppender.extend( this, opts );

    this.write = function(entry) {
        var fields = appender.formatEntry( entry );
        process.stdout.write( JSON.stringify( fields ) + '\n');
    };

    this.setLevel = function(level) {
        const idx = levels.indexOf(level);
        if (idx >= 0) {
            level = idx;
        }
    };
};

manager.addAppender( new JSONAppender() );
const log = manager.createLogger('JsonTest');

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

