import {ServerRoute} from '@hapi/hapi';

function getStatus(): any {
  return {
    status: 'Ok'
  };
}

const route: ServerRoute = {
  method: 'GET',
  path: '/status',
  options: {
    auth: false,
    handler: getStatus,
    description: 'Status',
    notes: 'Returns a positive status if the service is alive and healthy',
    tags: ['api', 'status'],
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

export default route;
