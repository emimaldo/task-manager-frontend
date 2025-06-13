import { TaskStrategy } from '../TaskStrategy';
import { SimpleTaskStrategy } from './SimpleTaskStrategy';
import { ComplexTaskStrategy } from './ComplexTaskStrategy';
import { PersonalTaskStrategy } from './PersonalTaskStrategy';
import { WorkTaskStrategy } from './WorkTaskStrategy';
import { HobbyTaskStrategy } from './HobbyTaskStrategy';

export class TaskStrategyFactory {
  static create(type: string): TaskStrategy {
    switch (type.toLowerCase()) {
      case 'simple':
        return new SimpleTaskStrategy();
      case 'complex':
        return new ComplexTaskStrategy();
      case 'personal':
        return new PersonalTaskStrategy();
      case 'work':
        return new WorkTaskStrategy();
      case 'hobby':
        return new HobbyTaskStrategy();
      default:
        return new SimpleTaskStrategy(); // Default to simple instead of throwing
    }
  }
}
