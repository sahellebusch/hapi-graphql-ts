import hapi, {Request} from '@hapi/hapi';
import Config from './lib/config';
import {Logger} from './lib/logger';
import routes from './routes';
import methods from './plugins/methods';
import logging from './plugins/logging';
import documentation from './plugins/documentation';
import 'reflect-metadata';
import {buildSchema} from 'type-graphql';
import ProjectResolver from './resolvers/ProjectResolver';
import TaskResolver from './resolvers/TaskResolver';
import {ApolloServer} from './apollo-server-hapi';
import {IDatabase} from 'pg-promise';
import ProjectDataSource from './datasource/Project';
import getConnection from './lib/connection';

export interface ServerMethods {
  logger(): Logger;
  projectDatasource(): ProjectDataSource;
  config(): Config;
}

interface DataSources {
  projectDatasource: ProjectDataSource;
}

export interface ApolloContext {
  dataSources: DataSources;
}

export function serverMethods(request: Request): ServerMethods {
  return request.server.methods as any;
}

const port = process.env.PORT || 3001;
const host = process.env.HOST || '0.0.0.0';

interface ServerOpts {
  config?: Config;
  serverLogs?: boolean;
  providedLogger?: Logger;
  providedConnection?: IDatabase<unknown>;
}

export default async function buildServer(serverOpts: ServerOpts): Promise<hapi.Server> {
  const {
    config = Config.init(),
    providedLogger,
    providedConnection,
    serverLogs = true
  } = serverOpts;

  const app = new hapi.Server({
    host,
    port
  });

  const connection = providedConnection || getConnection(config);
  const projectDatasource = new ProjectDataSource(config, connection);

  await app.route(routes);
  await app.register({
    plugin: methods,
    options: {logger: providedLogger, projectDatasource, config}
  });

  await app.register({plugin: logging, options: {serverLogs}});
  await app.register(documentation);

  const schema = await buildSchema({
    resolvers: [ProjectResolver, TaskResolver],
    emitSchemaFile: true
  });

  const apolloServer = new ApolloServer({
    schema,
    dataSources: () => ({projectDatasource})
  });

  await apolloServer.applyMiddleware({
    app
  });

  await apolloServer.installSubscriptionHandlers(app.listener);

  return app;
}
