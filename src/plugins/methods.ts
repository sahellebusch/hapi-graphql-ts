import {Server} from '@hapi/hapi';
import defaultLogger, {Logger} from '../lib/logger';
import Config from '../lib/config';
import ProjectDatasource from '../datasource/Project';

const packageInfo = require('../../package'); // eslint-disable-line @typescript-eslint/no-var-requires

export interface MethodOptions {
  logger: Logger;
  projectDatasource: ProjectDatasource;
  config: Config;
}

export default {
  name: 'methods',
  version: packageInfo.version,
  register: async (server: Server, options: MethodOptions): Promise<void> => {
    const config = options.config;
    const logger = options.logger || defaultLogger;

    server.method('logger', (() => logger) as any);
    server.method('projectDatasource', (() => options.projectDatasource) as any);
    server.method('config', (() => config) as any);
  }
};
