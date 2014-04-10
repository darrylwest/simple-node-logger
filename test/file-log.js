#!/usr/bin/env node 

var fs = require('fs'),
    file = 'file-test.log',
    log = require('../logger').createLogger( file ),
    types = [ 'debug', 'info', 'warn', 'error', 'fatal' ];

log.setLevel('debug');

types.forEach(function(type) {
    log[ type ]('file/stdout test ', type, ' log at ', Date.now());
});

fs.exists( file, function(exist) {
    if (!exist) {
        throw new Error('TEST FAIL: file: ', file, ' does not exist...');
    }
});

