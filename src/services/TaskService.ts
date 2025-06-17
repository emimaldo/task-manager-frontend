import { TaskStrategyFactory } from '../patterns/strategy/strategies/TaskStrategyFactory';
import { TaskStrategyContext } from '../patterns/strategy/TaskStrategyContext';
import { TaskData } from '../patterns/strategy/TaskStrategy';

export class TaskService {
  private baseURL = 'http://localhost:3001/api';

  /**
   * Get all tasks from the backend
   */
  async getAllTasks(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/tasks`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get a specific task by ID
   */
  async getTaskById(id: string): Promise<any> {
    if (!id || id.trim() === '') {
      throw new Error('Task ID is required');
    }

    try {
      const response = await fetch(`${this.baseURL}/tasks/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Creates a task using the appropriate strategy based on type
   */
  async createTask(taskData: Partial<TaskData>): Promise<TaskData> {
    // Validate data first
    this.validateTaskData(taskData);

    // Additional check for required fields after validation
    if (!taskData.title || !taskData.type) {
      throw new Error('Title and type are required');
    }

    try {
      const response = await fetch(`${this.baseURL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Updates a task
   */
  async updateTask(id: string, updates: Partial<TaskData>): Promise<TaskData> {
    if (!id || id.trim() === '') {
      throw new Error('Task ID is required');
    }

    this.validateTaskData(updates);

    try {
      const response = await fetch(`${this.baseURL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new Error('Task ID is required');
    }

    try {
      const response = await fetch(`${this.baseURL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Validates task data before processing
   */
  validateTaskData(taskData: Partial<TaskData>): void {
    const validTypes = ['simple', 'complex', 'personal', 'work', 'hobby'];
    const validPriorities = ['low', 'normal', 'high'];

    // Check for title: if it's provided, it should not be empty or just whitespace
    if (taskData.title !== undefined && (!taskData.title || taskData.title.trim().length === 0)) {
      throw new Error('Title is required');
    }

    // Check for type: if it's provided, it should be valid
    if (taskData.type && !validTypes.includes(taskData.type)) {
      throw new Error('Type must be simple, personal, work, hobby, or complex');
    }

    // Check for priority: if it's provided, it should be valid
    if (taskData.priority && !validPriorities.includes(taskData.priority)) {
      throw new Error('Priority must be low, normal, or high');
    }
  }

  /**
   * Check if a priority value is valid
   */
  isValidPriority(priority: string): boolean {
    const validPriorities = ['low', 'normal', 'high'];
    return validPriorities.includes(priority);
  }

  /**
   * Check if a type value is valid
   */
  isValidType(type: string): boolean {
    const validTypes = ['simple', 'complex', 'personal', 'work', 'hobby'];
    return validTypes.includes(type);
  }
}