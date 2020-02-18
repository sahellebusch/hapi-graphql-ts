import Joi from '@hapi/joi';

export const ProjectSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  created: Joi.date(),
  updated: Joi.date()
});
