import {Arg, FieldResolver, Mutation, Query, Int, Resolver, Root} from 'type-graphql';
import {projects, tasks, TaskData} from '../data';
import Task from '../schemas/Task';

@Resolver(of => Task)
export default class {
  @Query(returns => [Task])
  fetchTasks(): TaskData[] {
    return tasks;
  }

  @Query(returns => Task, {nullable: true})
  getTask(@Arg('id', type => Int) id: number): TaskData | undefined {
    return tasks.find(task => task.id === id);
  }

  @Mutation(returns => Task)
  markAsCompleted(@Arg('id', type => Int) id: number): TaskData {
    const task = tasks.find(task => {
      return task.id === id;
    });
    if (!task) {
      throw new Error(`Couldn't find the task with id ${id}`);
    }
    if (task.completed === true) {
      throw new Error(`Task with id ${id} is already completed`);
    }
    task.completed = true;
    return task;
  }

  @FieldResolver()
  project(@Root() taskData: TaskData) {
    return projects.find(project => {
      return project.id === taskData.project_id;
    });
  }
}
