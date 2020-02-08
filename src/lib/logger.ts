type Nullable<A> = A | null | undefined;

export type LogDetail = string | object;

export interface Logger {
  info<A>(message: string, detail?: Nullable<A>): void;
  error<A>(message: string, detail?: Nullable<A>): void;
}

const logLevels = {
  info: 'INFO',
  error: 'ERROR'
};

const log = <A>(level: string, message: string, detail?: Nullable<A>) => {
  if (detail) {
    const detailMessage = typeof detail === 'object' ? JSON.stringify(detail, null, 1) : detail;
    console.log(`${level}: ${message}`, detailMessage); // tslint:disable-line:no-console
  } else {
    console.log(`${level}: ${message}`); // tslint:disable-line:no-console
  }
};

export const logger: Logger = {
  info: <A>(message: string, detail?: Nullable<A>) => log(logLevels.info, message, detail),
  error: <A>(message: string, detail?: Nullable<A>) => log(logLevels.error, message, detail)
};

export default logger;
