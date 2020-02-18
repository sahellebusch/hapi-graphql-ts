import {decamelize} from 'humps';
import {isArray, isPlainObject} from 'lodash';
import {IDatabase} from 'pg-promise';
import pgp from '../../../lib/pgp';
import getConnection from '../../../lib/connection';
import Config from '../../../lib/config';

class Injector {
  private connection: IDatabase<unknown>;

  constructor() {
    const config = Config.init();
    this.connection = getConnection(config);
  }

  /**
   * A function that can inject any object into a database. It will build a pg-promise#ColumnSet to insert.
   * injector.inject(connection, 'user', {id: 1, firstName: 'Boom', lastName: 'Roasted'})
   */
  public async inject(table: string, item: any): Promise<any> {
    const columns = Object.keys(item).map(key => {
      const config = {
        name: decamelize(key),
        prop: key
      };

      if (isPlainObject(item[key]) || isArray(item[key])) {
        return new pgp.helpers.Column({
          ...config,
          mod: ':json'
        });
      }

      return new pgp.helpers.Column(config);
    });

    const columnSet = new pgp.helpers.ColumnSet(columns, {table: decamelize(table)});
    const sql = `${pgp.helpers.insert(item, columnSet)} RETURNING *`;
    return this.connection.any(sql);
  }

  public async truncateTable(table: string): Promise<null> {
    return this.connection.none(`TRUNCATE ${table} RESTART IDENTITY CASCADE`);
  }
}

export default new Injector();
