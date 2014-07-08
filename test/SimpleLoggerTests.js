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
                'addAppender',
                '__protected'
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
            var log = logger.createLogger('MyCategory', 'warn');

            should.exist( log );
            log.__protected().category.should.equal( 'MyCategory' );
            log.getLevel().should.equal( 'warn' );

            log.should.be.instanceof( Logger );
        });
    });

    describe('#domain', function() {
        var opts = createOptions(),
            manager;

        opts.domain = 'MyDomain';
        opts.level = 'error';

        manager = new SimpleLogger( opts );

        it('should create a simple logger with a domain', function() {
            manager.__protected().domain.should.equal( opts.domain );
            manager.__protected().dfltLevel.should.equal( opts.level );
        });

        it('should create a log with specified domain, category and level', function() {
            var log = manager.createLogger('MyCat');

            log.getLevel().should.equal( opts.level );
            log.__protected().domain.should.equal( opts.domain );

            // default to a single console appender
            log.getAppenders().length.should.equal( 1 );
        });
    });
});
