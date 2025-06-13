import { TaskStrategy, TaskData } from '../TaskStrategy';

export class ComplexTaskStrategy implements TaskStrategy {
  async createTask(taskData: TaskData): Promise<TaskData> {
    return {
      ...taskData,
      title: `Complex: ${taskData.title}`,
      priority: taskData.priority === 'low' ? 'normal' : taskData.priority, // Complex tasks have at least normal priority
    };
  }
}
