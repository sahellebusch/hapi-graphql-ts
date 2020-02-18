import {Server} from '@hapi/hapi';
import swagger from 'hapi-swagger';
import inert from '@hapi/inert';
import vision from '@hapi/vision';

const packageInfo = require('../../package'); // eslint-disable-line @typescript-eslint/no-var-requires

const swaggerPlugin: any = {
  plugin: swagger,
  options: {
    info: {
      title: 'Idiomatic Hapi + Typescript server.',
      version: packageInfo.version
    },
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
};

export default {
  name: 'documentation',
  version: packageInfo.version,
  register: (server: Server): Promise<void> => server.register([inert, vision, swaggerPlugin])
};
