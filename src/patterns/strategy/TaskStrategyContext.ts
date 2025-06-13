import { TaskStrategy, TaskData } from './TaskStrategy';

export class TaskStrategyContext {
  constructor(private strategy: TaskStrategy) {}

  createTask(taskData: TaskData) {
    return this.strategy.createTask(taskData);
  }
}
