import {Request, Util} from '@hapi/hapi';
import {serverMethods} from '../../server';
import {Boom, internal, notFound} from '@hapi/boom';
import Project from '../../schemas/Project';

export default async function getById(request: Request): Promise<Project | Boom> {
  const methods = serverMethods(request);
  const projectDatasource = methods.projectDatasource();
  const logger = methods.logger();

  const {id} = request.params as Util.Dictionary<string>;
  try {
    const project = await projectDatasource.selectById(parseInt(id));
    if (!project) {
      return notFound(`Project with id "${id}" not found`);
    }
    return project;
  } catch (error) {
    logger.error('Error retrieving project by id', {error});
    return internal('Error occurred retrieving project by id');
  }
}
