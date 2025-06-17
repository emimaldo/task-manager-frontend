import { describe, it, expect, beforeEach } from 'vitest';
import { SimpleTaskStrategy } from '../../../src/patterns/strategy/strategies/SimpleTaskStrategy';
import { TaskData } from '../../../src/patterns/strategy/TaskStrategy';

describe('SimpleTaskStrategy', () => {
  let strategy: SimpleTaskStrategy;

  beforeEach(() => {
    strategy = new SimpleTaskStrategy();
  });

  describe('createTask', () => {
    it('should add "Simple:" prefix to task title', async () => {
      const taskData: TaskData = {
        title: 'Test Task',
        description: 'Test description',
        priority: 'normal',
        type: 'simple'
      };

      const result = await strategy.createTask(taskData);

      expect(result.title).toBe('Simple: Test Task');
    });

    it('should preserve all other task properties unchanged', async () => {
      const taskData: TaskData = {
        title: 'Original Title',
        description: 'Original description',
        priority: 'high',
        type: 'simple'
      };

      const result = await strategy.createTask(taskData);

      expect(result.description).toBe('Original description');
      expect(result.priority).toBe('high');
      expect(result.type).toBe('simple');
    });

    it('should handle empty title correctly', async () => {
      const taskData: TaskData = {
        title: '',
        description: 'Some description',
        priority: 'low',
        type: 'simple'
      };

      const result = await strategy.createTask(taskData);

      expect(result.title).toBe('Simple: ');
    });

    it('should handle special characters in title', async () => {
      const taskData: TaskData = {
        title: 'Special @#$% Characters & Symbols!',
        description: 'Test',
        priority: 'normal',
        type: 'simple'
      };

      const result = await strategy.createTask(taskData);

      expect(result.title).toBe('Simple: Special @#$% Characters & Symbols!');
    });

    it('should work with different priority levels', async () => {
      const priorities: Array<'low' | 'normal' | 'high'> = ['low', 'normal', 'high'];

      for (const priority of priorities) {
        const taskData: TaskData = {
          title: 'Test Task',
          description: 'Test',
          priority,
          type: 'simple'
        };

        const result = await strategy.createTask(taskData);

        expect(result.priority).toBe(priority);
        expect(result.title).toBe('Simple: Test Task');
      }
    });

    it('should handle long titles', async () => {
      const longTitle = 'A'.repeat(1000);
      const taskData: TaskData = {
        title: longTitle,
        description: 'Test',
        priority: 'normal',
        type: 'simple'
      };

      const result = await strategy.createTask(taskData);

      expect(result.title).toBe(`Simple: ${longTitle}`);
    });

    it('should handle unicode characters in title', async () => {
      const taskData: TaskData = {
        title: '📋 Task with 🚀 emojis and 中文',
        description: 'Unicode test',
        priority: 'normal',
        type: 'simple'
      };

      const result = await strategy.createTask(taskData);

      expect(result.title).toBe('Simple: 📋 Task with 🚀 emojis and 中文');
    });

    it('should not modify the original task data object', async () => {
      const originalTaskData: TaskData = {
        title: 'Original',
        description: 'Original description',
        priority: 'normal',
        type: 'simple'
      };

      await strategy.createTask(originalTaskData);

      expect(originalTaskData.title).toBe('Original');
      expect(originalTaskData.description).toBe('Original description');
      expect(originalTaskData.priority).toBe('normal');
      expect(originalTaskData.type).toBe('simple');
    });

    it('should return a new object instance', async () => {
      const taskData: TaskData = {
        title: 'Test',
        description: 'Test',
        priority: 'normal',
        type: 'simple'
      };

      const result = await strategy.createTask(taskData);

      expect(result).not.toBe(taskData);
      expect(result).toEqual({
        ...taskData,
        title: 'Simple: Test'
      });
    });

    it('should be asynchronous and return a Promise', async () => {
      const taskData: TaskData = {
        title: 'Async Test',
        description: 'Test async behavior',
        priority: 'normal',
        type: 'simple'
      };

      const promise = strategy.createTask(taskData);
      expect(promise).toBeInstanceOf(Promise);

      const result = await promise;
      expect(result.title).toBe('Simple: Async Test');
    });
  });

  describe('Strategy Pattern Implementation', () => {
    it('should implement TaskStrategy interface', () => {
      expect(strategy).toHaveProperty('createTask');
      expect(typeof strategy.createTask).toBe('function');
    });

    it('should be instantiable multiple times with independent behavior', async () => {
      const strategy1 = new SimpleTaskStrategy();
      const strategy2 = new SimpleTaskStrategy();

      const taskData1: TaskData = {
        title: 'Task 1',
        description: 'First task',
        priority: 'low',
        type: 'simple'
      };

      const taskData2: TaskData = {
        title: 'Task 2',
        description: 'Second task',
        priority: 'high',
        type: 'simple'
      };

      const result1 = await strategy1.createTask(taskData1);
      const result2 = await strategy2.createTask(taskData2);

      expect(result1.title).toBe('Simple: Task 1');
      expect(result2.title).toBe('Simple: Task 2');
      expect(result1).not.toBe(result2);
    });
  });
});
