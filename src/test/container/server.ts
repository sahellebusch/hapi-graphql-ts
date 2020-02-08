/*
 * This is just used for integration tests to keep a container running.
 */

import http from 'http';
import logger from '../../lib/logger';

const port = 5000;

const requestHandler = (request, response) => {
  response.end('Integration Tests > Unit Tests :)');
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if (err) {
    return logger.error('There was an issue starting the test server: ', err);
  }

  logger.info(`Test server is listening on ${port}`);
});
