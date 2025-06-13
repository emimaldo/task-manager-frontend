export interface TaskData {
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: string;
}

export interface TaskStrategy {
  createTask(taskData: TaskData): Promise<TaskData>;
}
  