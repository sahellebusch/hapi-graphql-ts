import { Server } from '@hapi/hapi';
import httpStatus from 'http-status-codes';
import buildServer from '../../../server';
import injector from '../lib/injector';
import { IDatabase } from 'pg-promise';

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
    buildServer({ providedLogger: mockLogger }).then(srv => {
      server = srv;
    })
  );

  beforeEach(async () => injector.truncateTable('project'));

  test(`should respond with a 404 with empty projects table`, async () => {
    const result = await server.inject({
      method: 'GET',
      url: '/project/1'
    });

    const expectedResponse = {
      statusCode: 404,
      error: 'Not Found',
      message: 'Project with id "1" not found'
    };
    expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
    expect(JSON.parse(result.payload)).toEqual(expectedResponse);
  });

  test('should respond with a project by id', async () => {
    const testProject = {
      id: 1,
      name: 'This damn project'
    };

    const inserted = (await injector.inject('project', testProject))[0];
    const actual = inserted;
    actual.created = actual.created.toISOString();
    actual.updated = actual.updated.toISOString();

    const result = await server.inject({
      method: 'GET',
      url: '/project/1'
    });

    expect(result.statusCode).toEqual(httpStatus.OK);
    expect(JSON.parse(result.payload)).toEqual(actual);
  });

  test('should respond with a 500 error when an error occurs', async () => {
    const mockConnection = {
      oneOrNone: () => Promise.reject({ boom: 'roasted' })
    };

    const serverThatShouldBlowUp = await buildServer({
      providedLogger: mockLogger,
      providedConnection: (mockConnection as unknown) as IDatabase<unknown>
    });

    const result = await serverThatShouldBlowUp.inject({
      method: 'GET',
      url: '/project/1'
    });

    const expectedResponse = {
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
      statusCode: 500
    };

    expect(result.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(result.payload)).toEqual(expectedResponse);
  });
});
