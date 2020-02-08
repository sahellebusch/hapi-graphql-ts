import {Server} from 'hapi';
import httpStatus from 'http-status-codes';
import buildServer from '../../../server';

function noop(): void {
  return;
}

const mockLogger = {
  info: noop,
  debug: noop,
  warn: noop,
  error: noop
};

describe('/status', () => {
  let server: Server = null;

  beforeAll(() =>
    buildServer(mockLogger, false).then(srv => {
      server = srv;
    }));

  test(`should respond 'ok' when the service is healthy`, () =>
    server
      .inject({
        method: 'GET',
        url: '/status'
      })
      .then(({statusCode, result: reponse}) => {
        expect(statusCode).toEqual(httpStatus.OK);
        expect(reponse).toEqual({status: 'Ok'});
      }));
});
