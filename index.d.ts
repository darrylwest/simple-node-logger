///<reference lib="ES2015"/>
///<reference types="moment"/>

import moment = require("moment");

type STANDARD_LEVELS = SimpleLogger.STANDARD_LEVELS;
type Logger = SimpleLogger.Logger;

type IConsoleAppenderOptions = SimpleLogger.IConsoleAppenderOptions;
type ConsoleAppender = SimpleLogger.appenders.ConsoleAppender;
type IFileAppenderOptions = SimpleLogger.IFileAppenderOptions;
type FileAppender = SimpleLogger.appenders.FileAppender;
type IRollingFileAppenderOptions = SimpleLogger.IRollingFileAppenderOptions;
type RollingFileAppender = SimpleLogger.appenders.RollingFileAppender;
type AbstractAppender = SimpleLogger.AbstractAppender;
type ISimpleLoggerOptions = SimpleLogger.ISimpleLoggerOptions;
declare class SimpleLogger
{
	constructor(opts?: ISimpleLoggerOptions);
	createLogger(options?: SimpleLogger.ILoggerOptions): Logger;
	createLogger(category?: string, level?: STANDARD_LEVELS): Logger;
	createConsoleAppender(opts?: IConsoleAppenderOptions): ConsoleAppender;
	createFileAppender(opts?: IFileAppenderOptions): FileAppender;
	createRollingFileAppender(opts?: IRollingFileAppenderOptions): RollingFileAppender;
	addAppender<T extends AbstractAppender>(appender: AbstractAppender): T;
	getAppenders(): AbstractAppender[];
	getLoggers(): Logger[];
	startRefreshThread(): void;
	setAllLoggerLevels(level: STANDARD_LEVELS): void;
	readConfig(completeCallback?: (err?: any) => void): void;
}



declare namespace SimpleLogger
{
	export type STANDARD_LEVELS = 'all' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
	interface IEntry
	{
		ts: moment.MomentInput;
		pid: number;
		domain?: string;
		category?: string;
		level: STANDARD_LEVELS;
		msg: any | any[];
	}
	interface ISimpleLoggerOptions
	{
		domain?: string;
		loggers?: Logger[];
		level?: STANDARD_LEVELS;
		loggerConfigFile?: string;
		refresh?: number;
		fs?: any;
		createInterval?: typeof setInterval;
		minRefresh?: number;
		errorEventName?: string;
	}
	export interface ILoggerOptions
	{
		pid?: number;
		errorEventName?: string;
		domain?: string;
		category?: string;
		level?: STANDARD_LEVELS;
		levels?: STANDARD_LEVELS[];
		appenders?: AbstractAppender[]
	}
	export namespace Logger
	{
		var STANDARD_LEVELS: STANDARD_LEVELS[];
		var DEFAULT_LEVEL: STANDARD_LEVELS;
	}
	export class Logger
	{

		constructor(options?: ILoggerOptions);
		/**
		 * log the statement message
		 *
		 * @param level the level of this message (label, i.e, info, warn, etc)
		 * @param msg
		 */
		log(level: STANDARD_LEVELS, msg: any[] | any): void;

		/**
		 * set the level
		 *
		 * @param lvl one of the recognized logger levels
		 */
		setLevel(lvl: STANDARD_LEVELS): void;

		/**
		 * return the current level string
		 */
		getLevel(): STANDARD_LEVELS;

		/**
		 * set the list of appenders
		 * @param appenderList
		 */
		setAppenders(appenderList: AbstractAppender[]): void;

		/**
		 * add an appender to the list
		 *
		 * @param appender - implements write method
		 */
		addAppender<T extends AbstractAppender>(appender: T): T;

		/**
		 * remove the appender using the type name
		 */
		removeAppender(typeName: string): void;


		getAppenders(): AbstractAppender[];
		isDebug(): boolean;
		isInfo(): boolean;

		/**
		 * return the status map with log counts for each level
		 */
		getStats(): Map<STANDARD_LEVELS, number>;

		getCategory(): string | undefined;

		getDomain(): string | undefined;

		all(...arr: any[]): void;
		trace(...arr: any[]): void;
		debug(...arr: any[]): void;
		info(...arr: any[]): void;
		warn(...arr: any[]): void;
		error(...arr: any[]): void;
		fatal(...arr: any[]): void;
	}

	export interface IAbstractAppenderOptions
	{
		typeName?: string;
		timestampFormat?: string;
		prettyPrint?: boolean;
		separator?: string;
		level?: STANDARD_LEVELS;
		levels?: STANDARD_LEVELS[];
	}
	export interface IConsoleAppenderOptions extends IAbstractAppenderOptions
	{
		typeName?: string;
		writer?: Function;
	}
	export interface IFileAppenderOptions extends IAbstractAppenderOptions
	{
		typeName?: string;
		fs?: any;
		autoOpen?: boolean;
		logFilePath: string;
		writer?: any;
	}
	export interface IRollingFileAppenderOptions extends IAbstractAppenderOptions
	{
		typeName?: string;
		fs?: any;
		autoOpen?: boolean;
		logDirectory: string;
		fileNamePattern: string;
		dateFormat?: string;
		currentFile?: string;
		createInterval?: typeof setInterval;
	}

	export abstract class AbstractAppender
	{
		constructor(options?: IAbstractAppenderOptions);
		/**
		 * format the entry and return the field list
		 *
		 * @param entry the log entry
		 * @param thisArg - use this to override the base object
		 *
		 * @returns field array
		 */
		formatEntry(entry: any, thisArg?: AbstractAppender): string[];

		/**
		 * format the message
		 *
		 * @param msg the log message
		 * @param thisArg - use this to override the base object
		 *
		 * @returns field array
		 */
		formatMessage(msg: any | any[], thisArg?: AbstractAppender): string;

		formatDate(value: Date): string;
		formatObject(value: any): string;
		formatLevel(level: STANDARD_LEVELS): string;
		formatTimestamp(ts: moment.MomentInput): string;
		getTypeName(): string;

		//formatter(entry: any): string;
		abstract write(entry: IEntry): void;
		abstract setLevel(level: STANDARD_LEVELS): void;

		__protected(): any;
	}

	//export type IConsoleAppenderOptions = appenders.IConsoleAppenderOptions;
	//export type IFileAppenderOptions = appenders.IFileAppenderOptions;
	//export type IRollingFileAppenderOptions = appenders.IRollingFileAppenderOptions;

	export namespace appenders
	{


		export class ConsoleAppender extends AbstractAppender
		{
			constructor(options: IAbstractAppenderOptions & IConsoleAppenderOptions);
			formatter(entry: IEntry): string;
			write(entry: IEntry): void;
			setLevel(level: STANDARD_LEVELS): void;
		}


		export class FileAppender extends AbstractAppender
		{
			constructor(options?: IFileAppenderOptions);
			formatter(entry: IEntry): string;
			write(entry: IEntry): void;
			setLevel(level: STANDARD_LEVELS): void;
		}


		export class RollingFileAppender extends AbstractAppender
		{
			constructor(options?: IRollingFileAppenderOptions);
			formatter(entry: IEntry): string;
			write(entry: IEntry): void;
			setLevel(level: STANDARD_LEVELS): void;

			checkForRoll(now?: moment.Moment): boolean;
			createFileName(now?: moment.Moment): string;
		}
	}


	/**
	 * static convenience method to create a file logger (no console logging);
	 *
	 * @param options - if string then it's the logFilePath, else options with the logFilePath
	 * @returns Logger
	 */
	export function createSimpleLogger(): Logger;
	export function createSimpleLogger(logFilePath: string): Logger;
	export function createSimpleLogger(options: ISimpleLoggerOptions &
		Partial<IConsoleAppenderOptions> &
		Partial<IFileAppenderOptions>): Logger;

	/**
	 * create a rolling file logger by passing options to SimpleLogger and Logger.  this enables setting
	 * of domain, category, etc.
	 *
	 * @param options
	 * @returns rolling logger
	 */
	export function createSimpleFileLogger(logFilePath: string): Logger;
	export function createSimpleFileLogger(options: ISimpleLoggerOptions &
		IFileAppenderOptions): Logger;

	/**
	 * create a rolling file appender and add it to the appender list
	 *
	 * @param options
	 * @returns the appender
	 */
	export function createRollingFileLogger(options: ISimpleLoggerOptions &
		IRollingFileAppenderOptions &
	{ readLoggerConfig?: Function }): Logger;

	/**
	 * create a log manager
	 *
	 * @param options - file or rolling file specs;
	 */
	export function createLogManager(options?: ISimpleLoggerOptions &
		Partial<IRollingFileAppenderOptions> &
		Partial<IConsoleAppenderOptions> &
	{ readLoggerConfig?: Function }): SimpleLogger;
}

export = SimpleLogger;




