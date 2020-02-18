import {Arg, FieldResolver, Query, Resolver, Root, Int, Ctx} from 'type-graphql';
import {tasks, ProjectData} from '../data';
import Project from '../schemas/Project';
import {ApolloContext} from '../server';

@Resolver(of => Project)
export default class {
  @Query(returns => Project, {nullable: true})
  async projectById(
    @Arg('id', type => Int) id: number,
    @Ctx() ctx: ApolloContext
  ): Promise<Project | undefined> {
    const {projectDatasource} = ctx.dataSources;
    return projectDatasource.selectById(id);
  }

  @FieldResolver()
  tasks(@Root() projectData: ProjectData) {
    return tasks.filter(task => {
      return task.project_id === projectData.id;
    });
  }
}
