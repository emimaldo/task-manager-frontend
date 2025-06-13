import { TaskStrategy, TaskData } from '../TaskStrategy';

export class WorkTaskStrategy implements TaskStrategy {
  async createTask(taskData: TaskData): Promise<TaskData> {
    return {
      ...taskData,
      title: `[Work] ${taskData.title}`,
      priority: taskData.priority === 'low' ? 'normal' : taskData.priority, // Work tasks should have at least normal priority
    };
  }
}