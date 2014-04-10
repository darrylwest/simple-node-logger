#!/usr/bin/env node 

var log = require('../logger').createLogger(),
    types = [ 'debug', 'info', 'warn', 'error', 'fatal' ];

log.setLevel('debug');

types.forEach(function(type) {
    log[ type ]('stdout test ', type, ' log at ', Date.now());
});

