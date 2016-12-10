#!/usr/bin/env node

// dpw@alameda.local
// 2015.03.04
'use strict';

const fs = require('fs');
const spawn = require('child_process').spawn;
const clearScreen = '[H[2J';

let files = new Set();
let tid;

const run = function() {
    process.stdout.write( clearScreen ); 
    console.log('Changed files: ', files);

    let runner = spawn( 'make', [ 'test' ] );

    runner.stdout.on('data', function( data ) {
        process.stdout.write( data );
    });

    runner.stderr.on('data', function( data ) {
        process.stdout.write( data );
    });

    runner.on('close', function(code) {
        tid = null;
        files.clear();
    });
};

const changeHandler = function(event, filename) {
    if ( filename.endsWith('.js') ) {
        files.add( filename );

        if (!tid) {
            tid = setTimeout(function() {
                run();
            }, 250);
        }
    }
};

// run();
fs.watch( './lib', { recursive:true }, changeHandler );
fs.watch( './test', { recursive:true }, changeHandler );

