import Promise from 'bluebird';
import {Server} from 'hapi';

import defaultLogger, {Logger} from '../lib/logger';

const packageInfo = require('../../package'); // eslint-disable-line @typescript-eslint/no-var-requires

export interface MethodOptions {
  logger: Logger;
}

export default {
  name: 'methods',
  version: packageInfo.version,
  register: (server: Server, options: MethodOptions): Promise<void> => {
    const logger = options.logger || defaultLogger;
    server.method('logger', (() => logger) as any);
    return Promise.resolve();
  }
};
