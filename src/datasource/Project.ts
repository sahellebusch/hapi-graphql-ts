import {DataSource} from 'apollo-datasource';
import {IDatabase} from 'pg-promise';
import Config from '../lib/config';
import getConnection from '../lib/connection';
import Project from '../schemas/Project';

export default class ProjectDatasource extends DataSource {
  private connection: IDatabase<unknown>;

  constructor(config: Config, connection: IDatabase<unknown>) {
    super();
    this.connection = connection || getConnection(config);
  }

  public async selectAll(): Promise<Project[]> {
    const SELECT_ALL = `
  SELECT
    id,
    name,
    created,
    updated
  FROM "project"
`;
    return await this.connection.manyOrNone(SELECT_ALL);
  }

  public async selectById(id: number): Promise<Project | undefined> {
    const SELECT_BY_ID = `
  SELECT
    id,
    name,
    created,
    updated
  FROM "project"
  WHERE id = $[id]
`;
    return await this.connection.oneOrNone(SELECT_BY_ID, {id});
  }
}
