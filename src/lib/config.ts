import Joi, {Schema as JoiSchema} from '@hapi/joi';
import pick from 'lodash/pick';
import logger from './logger';
import {NodeEnvs} from '../lib/constants';

interface EnvironmentVars {
  [key: string]: any;
}

function getValidNodeEnv() {
  const nodeEnvs = Joi.string();

  Object.values(NodeEnvs).forEach(value => {
    nodeEnvs.valid(value);
  });

  return nodeEnvs;
}

export default class Config {
  /* eslint-disable */
  static readonly apiConfigSchema: JoiSchema = Joi.object({
    NODE_ENV: getValidNodeEnv(),
    DB_URL: Joi.string().uri()
      .when('NODE_ENV', {
        is: Joi.string().valid('dev', 'docker'),
        then: Joi.required(),
        otherwise: Joi.optional()
      })
  });
  /* eslint-enable */

  public static init(providedEnv?: EnvironmentVars): Config {
    const toValidate = providedEnv || process.env;

    try {
      const {value} = Config.apiConfigSchema.validate(toValidate, {
        abortEarly: false,
        allowUnknown: true
      });

      return new Config(pick(value, Object.keys(Config.apiConfigSchema.describe().keys)));
    } catch (error) {
      logger.fatal('Environment variables failed validation', {error});
      throw error;
    }
  }

  readonly env: EnvironmentVars;

  private constructor(env: EnvironmentVars) {
    this.env = env;
  }

  public has(prop: string): boolean {
    return !!this.env[prop];
  }

  public get(prop: string): any {
    if (!this.env[prop]) {
      throw new Error(`Property "${prop}" does not exist `);
    }

    return this.env[prop];
  }
}
