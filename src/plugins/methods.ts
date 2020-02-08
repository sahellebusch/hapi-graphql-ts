import Promise from 'bluebird';
import {Server} from 'hapi';

import defaultLogger, {Logger} from '../lib/logger';

const packageInfo = require('../../package'); /* tslint:disable-line:no-var-requires */

export interface MethodOptions {
  logger: Logger;
}

export default {
  name: 'methods',
  version: packageInfo.version,
  register: (server: Server, options: MethodOptions) => {
    const logger = options.logger || defaultLogger;
    server.method('logger', (() => logger) as any);
    return Promise.resolve();
  }
};
