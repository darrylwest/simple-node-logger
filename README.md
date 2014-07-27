# Simple Node Logger
- - -

A simple multi-level logger for console, file, and rolling file appenders.

- levels: trace, debug, info, warn, error and fatal levels (plus all and off)
- flexible appender/formatters with default to HH:MM:ss.SSS LEVEL message
- add appenders to send output to console, file, etc
- change log levels on the fly
- domain and category columns
- overridable format methods in base appender

## Installation

    npm install simple-node-logger --save


## How to use

	// create a stdout console logger
	var log = new require('simple-node-logger').createSimpleLogger();

or

	// create a stdout and file logger
	var log = require('simple-node-logger').createSimpleLogger('project.log');

or

	// create a file only file logger
	var log = require('simple-node-logger').createSimpleFileLogger('project.log');
	
or

    // create a rolling file logger based on date/time
    var opts = {
        logDirectory:'/mylogfiles',
        fileNamePattern:'roll-<DATE>.log',
        dateFormat:'YYYY.MM.DD'
    };

    var log = require('simple-node-logger').createRollingFileLogger( opts );

The first use will simply log to the console.  The second will log to the console and to the project.log file.  The third logs to the file only. The forth creates a rolling file log system in the target log folder.

## Log Levels

The default level is 'info' but the log level can be set by doing this:

	log.setLevel('warn');
	
This sets the log level to warn and suppresses debug and info messages.

## Default Formats

### Simple Logger

The default format is HH:mm:ss.SSS LEVEL message. For example, the log message:

	log.info('subscription to ', channel, ' accepted at ', new Date().toJSON());

Yields:

	14:14:21.363 INFO  subscription to /devchannel accepted at 2014-04-10T14:20:52.938Z
	
### Category Logger

If you create a logger with a category name, all log statements will include this category.  Typically a category is a class or module name.  If you create a logger with the category name 'MyCategory', the log statement would format like this:

	 14:14:21.363 INFO  MyCategory subscription to /devchannel accepted at 2014-04-10T14:20:52.938Z
	 
## Appenders

### Console

### File

### Rolling File

#### Valid Date Formats

Date formats must map to acceptable file names so have more restrictions than typical dates.  If you use delimiters, you are restricted to a dash or dot delimiter to separate year, month, day and hour.  Valid examples include:

	MMDD  // simple month day that rolls at midnight (no delimiters)
	YYYY.MM.DD-HH // year month day and hour that can roll up to once per hour
	YYYY-MM-DD.a // year month day and am/pm that rolls twice per day
	YYYY-MMM-DD // year month day where month is the short name (Mar, Apr, etc)
	
The default format YYYY.MM.DD is used if the format is not supplied.

## Dynamic Configuration

Create a javascript configuration that implements 'readConfig' to return configuration details.  

## Examples

The examples folder includes a handful of simple to not so simple cases for console, file, multi-appender, category, etc.

## Customizations

### Appenders

Adding a new appender is as easy as implementing write( logEntry ).  The easiest way to implement is by extending the base class AbstractAppender.  You may also easily override the formatting, order, etc by overriding or providing your own abstract or concrete appender.

For example, you can extend the AbstractAppender to create a JSON appender by doing this:

    var AbstractAppender = require('simple-node-logger').AbstractAppender;

    var JSONAppender = function() {
    	'use strict';
    	var appender = this;
    	
        var opts = {
            typeName:'JSONAppender'
        };
        
        AbstractAppender.extend( this, opts );
        
        // format and write all entry/statements
        this.write = function(entry) {
        	var fields = appender.formatEntry( entry );
        	
        	process.stdout.write( JSON.stringify( entry ) + '\n' );
        };
    };

## Unit Tests

All unit tests are written in mocha/chai/should and can be run from the command line by doing this:

	make test
	
There is also a file watcher that can be invoked with this:

	make watch
	
## Mocks

Mocks used for testing include MockLogger and MockAppender.  Typically you would use MockLogger for unit tests like this:

    var MockLogger = require('simple-node-logger').mocks.MockLogger;

    var log = MockLogger.createLogger('MyCategory');

    log.info('this is a log statement');
    log.getLogEnties().length.should.equal( 1 );
    
MockLogger extends Logger and uses MockAppender to capture log entries.

## License

Apache 2.0

- - -
<p><small><em>version 0.91.81</em></small></p>
