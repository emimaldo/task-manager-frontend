import { TaskStrategy, TaskData } from '../TaskStrategy';

export class SimpleTaskStrategy implements TaskStrategy {
  async createTask(taskData: TaskData): Promise<TaskData> {
    return {
      ...taskData,
      title: `Simple: ${taskData.title}`,
    };
  }
}
