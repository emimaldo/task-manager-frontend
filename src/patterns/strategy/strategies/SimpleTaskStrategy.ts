import { TaskStrategy } from '../TaskStrategy';

export class SimpleTaskStrategy implements TaskStrategy {
  async createTask(title: string): Promise<{ title: string }> {
    return { title: `Simple: ${title}` };
  }
}
