import {Server} from '@hapi/hapi';
import httpStatus from 'http-status-codes';
import buildServer from '../../../server';
import injector from '../lib/injector';

function noop(): void {
  return;
}

const mockLogger = {
  info: noop,
  warn: noop,
  error: noop,
  fatal: noop
};

describe('/graphql#project', () => {
  let server: Server = null;

  beforeAll(async () =>
    buildServer({providedLogger: mockLogger}).then(srv => {
      server = srv;
    })
  );

  beforeEach(async () => injector.truncateTable('project'));

  test(`should respond with a null response with empty projects table`, async () => {
    const query = `
query getProjectsById($id: Int!) {
  projectById(id: $id) {
    id,
    name,
    created,
    updated
  }
}
`;

    const nullResponse = {data: {projectById: null}};

    const result = await server.inject({
      method: 'POST',
      url: '/graphql',
      payload: JSON.stringify({query, variables: {id: 1}})
    });

    expect(result.statusCode).toEqual(httpStatus.OK);
    expect(JSON.parse(result.payload)).toEqual(nullResponse);
  });

  test('should respond with a project by id', async () => {
    const testProject = {
      id: 1,
      name: 'This damn project'
    };

    const inserted = (await injector.inject('project', testProject))[0];

    const query = `
query getProjectsById($id: Int!) {
  projectById(id: $id) {
    id,
    name,
    created,
    updated
  }
}
`;

    const actual = inserted;
    actual.created = actual.created.toISOString();
    actual.updated = actual.updated.toISOString();

    const result = await server.inject({
      method: 'POST',
      url: '/graphql',
      payload: JSON.stringify({query, variables: {id: 1}})
    });

    const {data} = JSON.parse(result.payload);
    expect(result.statusCode).toEqual(httpStatus.OK);
    expect(data.projectById).toEqual(actual);
  });
});
