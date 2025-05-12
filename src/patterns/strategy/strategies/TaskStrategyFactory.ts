import { TaskStrategy } from '../TaskStrategy';
import { SimpleTaskStrategy } from './SimpleTaskStrategy';
import { ComplexTaskStrategy } from './ComplexTaskStrategy';

export class TaskStrategyFactory {
  static create(type: string): TaskStrategy {
    switch (type) {
      case 'simple':
        return new SimpleTaskStrategy();
      case 'complex':
        return new ComplexTaskStrategy();
      default:
        throw new Error(`Invalid task type: ${type}`);
    }
  }
}
