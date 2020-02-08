import {Server} from 'hapi';
import {assert} from 'chai';
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

  before(() =>
    buildServer(mockLogger, false).then(srv => {
      server = srv;
    })
  );

  it(`should respond 'ok' when the service is healthy`, () =>
    server
      .inject({
        method: 'GET',
        url: '/status'
      })
      .then(({statusCode, result: reponse}) => {
        assert.equal(statusCode, httpStatus.OK);
        assert.deepEqual(reponse, {status: 'Ok'});
      }));
});
