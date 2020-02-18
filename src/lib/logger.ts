import {ValidationError} from '@hapi/joi';
import {Boom} from '@hapi/boom';
import pick from 'lodash/pick';
import util from 'util';
import {NodeEnvs} from './constants';

export interface Logger {
  info(message: string, detail?: any): void;
  warn(message: string, detail?: any): void;
  error(message: string, detail?: any): void;
  fatal(message: string, detail?: any): void;
}

interface LogData {
  level: string;
  time: Date;
  message: string;
  detail?: any;
}

export enum LogLevels {
  info = 'INFO',
  warn = 'WARN',
  error = 'ERROR',
  fatal = 'FATAL'
}

const commonErrorFields = ['name', 'code', 'stack', 'message'];

function isJoiError(error: ValidationError | Error): error is ValidationError {
  return (error as ValidationError).isJoi !== undefined;
}

function isBoomError(error: Boom | Error): error is Boom {
  return (error as Boom).isBoom !== undefined;
}

function serializeError(error: ValidationError | Error): any {
  if (isJoiError(error)) {
    return pick(error, ['name', 'message', 'details']);
  } else if (isBoomError(error)) {
    return pick(error, ['data', 'output']);
  } else {
    return pick(error, commonErrorFields);
  }
}

export function assembleLog(level: LogLevels, message: string, detail?: any): string {
  const logData: LogData = {
    level,
    time: new Date(),
    message
  };

  // errors don't serialize, pick out common fields to be logged
  if (detail) {
    Object.keys(detail).forEach(key => {
      if (detail[key] instanceof Error) {
        detail[key] = serializeError(detail[key] as any);
      }
    });

    logData.detail = detail;
  }

  // use util.inspect to log a single line, otherwise each line is a new log event in splunk
  // depth of 5 captures Joi validation error context
  return util.inspect(logData, {depth: 5, compact: true, breakLength: Infinity});
}

function log(level: LogLevels, message: string, detail?: any): void {
  if (process.env.NODE_ENV === NodeEnvs.DOCKER) {
    console.log(message, detail);
  } else {
    const logData = assembleLog(level, message, detail);
    console.log(logData);
  }
}

export const logger: Logger = {
  info: (message: string, detail?: any) => log(LogLevels.info, message, detail),
  warn: (message: string, detail?: any) => log(LogLevels.warn, message, detail),
  error: (message: string, detail?: any) => log(LogLevels.error, message, detail),
  fatal: (message: string, detail?: any) => log(LogLevels.fatal, message, detail)
};

export default logger;
