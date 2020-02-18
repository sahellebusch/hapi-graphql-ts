import {Server} from '@hapi/hapi';
import httpStatus from 'http-status-codes';
import buildServer from '../../../server';

function noop(): void {
  return;
}

const mockLogger = {
  info: noop,
  warn: noop,
  error: noop,
  fatal: noop
};

describe('/status', () => {
  let server: Server = null;

  beforeAll(() =>
    buildServer({providedLogger: mockLogger}).then(srv => {
      server = srv;
    })
  );

  test(`should respond 'ok' when the service is healthy`, () =>
    server
      .inject({
        method: 'GET',
        url: '/status'
      })
      .then(({statusCode, result: response}) => {
        expect(statusCode).toEqual(httpStatus.OK);
        expect(response).toEqual({status: 'Ok'});
      }));
});
