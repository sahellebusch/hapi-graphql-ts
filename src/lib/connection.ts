import pgp from './pgp';
import {IDatabase} from 'pg-promise';
import Config from './config';

let connection: IDatabase<unknown>;

export default function(config?: Config): IDatabase<{}> {
  if (!connection) {
    if (!config) {
      throw new Error('connection has not been instantiated, please provide config');
    }

    connection = pgp(config.get('DB_URL'));
  }

  return connection;
}
