#!/usr/bin/env node

var SimpleLogger = require('../index.js');
    AbstractAppender = SimpleLogger.AbstractAppender,
    manager = new SimpleLogger();

var JSONAppender = function() {
    var appender = this,
        opts = {
            typeName:'JSONAppender'
        };

    AbstractAppender.extend( this, opts );

    this.write = function(entry) {
        var fields = appender.formatEntry( entry );
        process.stdout.write( JSON.stringify( fields ) + '\n');
    };
};

manager.addAppender( new JSONAppender() );
var log = manager.createLogger('JsonTest');

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

