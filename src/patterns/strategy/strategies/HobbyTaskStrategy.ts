import { TaskStrategy, TaskData } from '../TaskStrategy';

export class HobbyTaskStrategy implements TaskStrategy {
  async createTask(taskData: TaskData): Promise<TaskData> {
    return {
      ...taskData,
      title: `[Hobby] ${taskData.title}`,
      priority: 'low', // Hobbies are usually low priority
    };
  }
}