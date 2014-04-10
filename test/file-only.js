#!/usr/bin/env node 

var fs = require('fs'),
    file = 'logs/file-only-test.log',
    log = require('../logger').createFileLogger( file ),
    types = [ 'debug', 'info', 'warn', 'error', 'fatal' ];

types.forEach(function(type) {
    log[ type ]('file/stdout test ', type, ' log at ', Date.now());
});

fs.exists( file, function(exist) {
    if (!exist) {
        throw new Error('TEST FAIL: file: ', file, ' does not exist...');
    }
});

