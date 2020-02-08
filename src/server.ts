import Promise from 'bluebird';
import hapi, {Request} from 'hapi';
import config from 'config';
import {Logger} from './lib/logger';
import routes from './routes';
import methods from './plugins/methods';
import logging from './plugins/logging';
import documentation from './plugins/documentation';

export interface ServerMethods {
  logger(): Logger;
}

export function serverMethods(request: Request): ServerMethods {
  return request.server.methods as any;
}

const port = process.env.PORT || (config.has('port') ? config.get('port') : null) || 3000;
const host = process.env.HOST || (config.has('host') ? config.get('host') : null) || 'localhost';

export default function buildServer(
  providedLogger?: Logger,
  serverLogs = true
): Promise<hapi.Server> {
  const server = new hapi.Server({
    host,
    port
  });

  const plugins = [
    {plugin: methods, options: {logger: providedLogger}},
    {plugin: logging, options: {serverLogs}},
    documentation
  ];

  return Promise.map(plugins, plugin => server.register(plugin as any))
    .then(() => server.route(routes))
    .then(() => server);
}
