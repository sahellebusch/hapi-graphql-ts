import Joi from '@hapi/joi';
import {ServerRoute} from '@hapi/hapi';
import failAction from '../../lib/fail-action';
import getById from '../../handler/project/get-by-id';
import {ProjectSchema} from '../../schemas/joi';

/* eslint-disable */
const idSchema = Joi.object({ id: Joi.number().positive() })
/* eslint-enable */

const getProjectById: ServerRoute = {
  method: 'GET',
  path: '/project/{id}',
  options: {
    auth: false,
    handler: getById,
    description: 'Get project by id',
    notes: 'Returns project.',
    tags: ['api'],
    response: {
      schema: ProjectSchema
    },
    cors: {
      origin: ['*']
    },
    validate: {
      failAction,
      params: idSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    }
  }
};

export default getProjectById;
