/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 7/7/14 9:44 AM
 */
var should = require('chai').should(),
    dash = require( 'lodash' ),
    casual = require( 'casual' ),
    Logger = require('../lib/Logger' ),
    SimpleLogger = require( '../lib/SimpleLogger');

describe('SimpleLogger', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        return opts;
    };

    describe('#instance', function() {
        var logger = new SimpleLogger( createOptions() ),
            methods = [
                'createLogger',
                'createConsoleAppender',
                'createFileAppender',
                'addAppender'
            ];

        it('should create an instance of SimpleLogger', function() {
            should.exist( logger );
            logger.should.be.instanceof( SimpleLogger );
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( logger ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                logger[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('createLogger', function() {
        var logger = new SimpleLogger( createOptions() );

        it('should create a basic logger with console appender', function() {
            
        });
    });
});
