import { TaskStrategy } from '../TaskStrategy';

export class ComplexTaskStrategy implements TaskStrategy {
  async createTask(title: string): Promise<{ title: string }> {
    return { title: `Complex: ${title}` };
  }
}
