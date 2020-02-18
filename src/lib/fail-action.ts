import {Request, ResponseToolkit} from '@hapi/hapi';
import {serverMethods} from '../server';
import {NodeEnvs} from '../lib/constants';

export default async function failAction(
  request: Request,
  _: ResponseToolkit,
  error: Error | undefined
): Promise<Error> {
  const methods = serverMethods(request);
  const env = methods.config().get('NODE_ENV');

  if (env === NodeEnvs.DEV || env === NodeEnvs.DOCKER) {
    const logger = methods.logger();
    logger.error('Validation Error:', error);
  }

  return error;
}
