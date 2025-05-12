import { TaskStrategy } from './TaskStrategy';

export class TaskStrategyContext {
  constructor(private strategy: TaskStrategy) {}

  createTask(title: string) {
    return this.strategy.createTask(title);
  }
}
