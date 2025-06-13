import { TaskStrategyFactory } from '../patterns/strategy/strategies/TaskStrategyFactory';
import { TaskStrategyContext } from '../patterns/strategy/TaskStrategyContext';
import { TaskData } from '../patterns/strategy/TaskStrategy';

export class TaskService {
  /**
   * Creates a task using the appropriate strategy based on type
   */
  async createTask(taskData: Partial<TaskData>): Promise<TaskData> {
    // Validate required fields
    if (!taskData.title || !taskData.type) {
      throw new Error('Title and type are required');
    }

    // Validate data
    this.validateTaskData(taskData);

    // Set defaults
    const completeTaskData: TaskData = {
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'normal',
      type: taskData.type
    };

    // Apply strategy pattern
    const strategy = TaskStrategyFactory.create(completeTaskData.type);
    const context = new TaskStrategyContext(strategy);
    
    return await context.createTask(completeTaskData);
  }

  /**
   * Validates task data before processing
   */
  private validateTaskData(taskData: Partial<TaskData>): void {
    const validTypes = ['simple', 'complex', 'personal', 'work', 'hobby'];
    const validPriorities = ['low', 'normal', 'high', 'urgent'];

    if (taskData.type && !validTypes.includes(taskData.type)) {
      throw new Error(`Invalid task type: ${taskData.type}`);
    }

    if (taskData.priority && !validPriorities.includes(taskData.priority)) {
      throw new Error(`Invalid priority: ${taskData.priority}`);
    }

    if (taskData.title && taskData.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
  }

  /**
   * Updates a task (future implementation)
   */
  async updateTask(id: string, updates: Partial<TaskData>): Promise<TaskData> {
    this.validateTaskData(updates);
    // TODO: Implementation when we have persistence
    throw new Error('Not implemented yet');
  }
}