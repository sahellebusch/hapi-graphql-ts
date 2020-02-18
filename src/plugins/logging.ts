import {Server} from '@hapi/hapi';
import good from '@hapi/good';

const packageInfo = require('../../package'); // eslint-disable-line @typescript-eslint/no-var-requires

export interface LoggingOptions {
  serverLogs?: boolean;
}

export default {
  name: 'logging',
  version: packageInfo.version,
  register: async (server: Server, options: LoggingOptions): Promise<void> => {
    if (!options.serverLogs) {
      return;
    }

    const logging: any = {
      plugin: good,
      options: {
        ops: {
          interval: 1000
        },
        reporters: {
          logs: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [
                {
                  log: '*',
                  response: {
                    include: 'api',
                    exclude: 'status'
                  }
                }
              ]
            },
            {
              module: 'good-console'
            },
            'stdout'
          ],
          errors: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{error: '*'}]
            },
            {
              module: 'good-console'
            },
            'stderr'
          ]
        }
      }
    };

    return server.register(logging);
  }
};
