#!/usr/bin/env node

const port = 18034;

// configure to read the config file each 2 minutes...

const opts = {
    logDirectory: __dirname + '/../logs',
    fileNamePattern: 'dynamic-<date>.log',
    dateFormat: 'YYYY.MM.DD-a',
    domain: 'MyApplication-' + port,
    level: 'info',
    loggerConfigFile: __dirname + '/logger-config.json',
    refresh: 10 * 1000 // read/refresh each 60 seconds
};

console.log('config file: ', opts.loggerConfigFile);
const log = require('../lib/SimpleLogger').createRollingFileLogger(opts);

log.setLevel('trace');

// write some stuff...
log.trace('this is a simple trace log statement (should not show)');
log.debug('this is a simple debug log statement (should not show)');
log.info('this is a simple info log statement/entry');
log.warn('this is a simple warn log statement/entry');

const appender = log.getAppenders()[0];
console.log('write to file: ', appender.__protected().currentFile);

// rolling file writer uses interval, so we need to exit
let count = 5;
setInterval(function() {
    log.trace('trace time: ', new Date().toJSON());
    log.debug('debug time: ', new Date().toJSON());
    log.info('info time: ', new Date().toJSON());
    log.warn('warn mark tm');
    log.error('error mark tm');

    console.log(count);
    count--;
    if (count < 0) {
        process.exit(0);
    }
}, 1000);

