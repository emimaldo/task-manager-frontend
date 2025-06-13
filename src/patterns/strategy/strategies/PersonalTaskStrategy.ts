import { TaskStrategy, TaskData } from '../TaskStrategy';

export class PersonalTaskStrategy implements TaskStrategy {
  async createTask(taskData: TaskData): Promise<TaskData> {
    return {
      ...taskData,
      title: `[Personal] ${taskData.title}`,
    };
  }
}