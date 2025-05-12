export interface TaskStrategy {
    createTask(title: string): Promise<{ title: string }>;
  }
  