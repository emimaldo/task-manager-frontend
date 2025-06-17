import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskService } from '../../../src/services/TaskService';
import { TaskData } from '../../../src/patterns/strategy/TaskStrategy';

// Mock the fetch function
global.fetch = vi.fn();

describe('TaskService', () => {
  let taskService: TaskService;
  const mockFetch = fetch as vi.MockedFunction<typeof fetch>;

  beforeEach(() => {
    taskService = new TaskService();
    vi.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should fetch all tasks successfully', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', description: 'Desc 1', priority: 'high', type: 'work', completed: false },
        { id: '2', title: 'Task 2', description: 'Desc 2', priority: 'normal', type: 'personal', completed: true }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockTasks)
      } as any);

      const result = await taskService.getAllTasks();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/tasks');
      expect(result).toEqual(mockTasks);
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as any);

      await expect(taskService.getAllTasks()).rejects.toThrow('Failed to fetch tasks: 500 Internal Server Error');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(taskService.getAllTasks()).rejects.toThrow('Network error');
    });
  });

  describe('getTaskById', () => {
    it('should fetch a specific task by id', async () => {
      const mockTask = { id: '1', title: 'Task 1', description: 'Desc 1', priority: 'high', type: 'work', completed: false };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockTask)
      } as any);

      const result = await taskService.getTaskById('1');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/tasks/1');
      expect(result).toEqual(mockTask);
    });

    it('should throw error when task not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as any);

      await expect(taskService.getTaskById('999')).rejects.toThrow('Failed to fetch task: 404 Not Found');
    });

    it('should validate task id parameter', async () => {
      await expect(taskService.getTaskById('')).rejects.toThrow('Task ID is required');
    });
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const taskData: TaskData = {
        title: 'New Task',
        description: 'New Description',
        priority: 'high',
        type: 'work'
      };

      const mockCreatedTask = {
        id: '1',
        ...taskData,
        completed: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockCreatedTask)
      } as any);

      const result = await taskService.createTask(taskData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      expect(result).toEqual(mockCreatedTask);
    });

    it('should validate required fields', async () => {
      const invalidTaskData = {
        title: '',
        description: 'Description',
        priority: 'high',
        type: 'work'
      } as TaskData;

      await expect(taskService.createTask(invalidTaskData)).rejects.toThrow('Title is required');
    });

    it('should validate priority values', async () => {
      const invalidTaskData = {
        title: 'Valid Title',
        description: 'Description',
        priority: 'invalid' as any,
        type: 'work'
      };

      await expect(taskService.createTask(invalidTaskData)).rejects.toThrow('Priority must be low, normal, or high');
    });

    it('should validate type values', async () => {
      const invalidTaskData = {
        title: 'Valid Title',
        description: 'Description',
        priority: 'high',
        type: 'invalid' as any
      };

      await expect(taskService.createTask(invalidTaskData)).rejects.toThrow('Type must be simple, personal, work, hobby, or complex');
    });

    it('should handle server errors during creation', async () => {
      const taskData: TaskData = {
        title: 'New Task',
        description: 'New Description',
        priority: 'high',
        type: 'work'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      } as any);

      await expect(taskService.createTask(taskData)).rejects.toThrow('Failed to create task: 400 Bad Request');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task successfully', async () => {
      const taskData: TaskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'low',
        type: 'personal'
      };

      const mockUpdatedTask = {
        id: '1',
        ...taskData,
        completed: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockUpdatedTask)
      } as any);

      const result = await taskService.updateTask('1', taskData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      expect(result).toEqual(mockUpdatedTask);
    });

    it('should validate task id for update', async () => {
      const taskData: TaskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'low',
        type: 'personal'
      };

      await expect(taskService.updateTask('', taskData)).rejects.toThrow('Task ID is required');
    });

    it('should handle update validation errors', async () => {
      const invalidTaskData = {
        title: '',
        description: 'Description',
        priority: 'high',
        type: 'work'
      } as TaskData;

      await expect(taskService.updateTask('1', invalidTaskData)).rejects.toThrow('Title is required');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      } as any);

      await taskService.deleteTask('1');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/tasks/1', {
        method: 'DELETE',
      });
    });

    it('should validate task id for deletion', async () => {
      await expect(taskService.deleteTask('')).rejects.toThrow('Task ID is required');
    });

    it('should handle deletion errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as any);

      await expect(taskService.deleteTask('999')).rejects.toThrow('Failed to delete task: 404 Not Found');
    });
  });

  describe('validation methods', () => {
    describe('validateTaskData', () => {
      it('should pass validation for valid task data', () => {
        const validTaskData: TaskData = {
          title: 'Valid Task',
          description: 'Valid Description',
          priority: 'high',
          type: 'work'
        };

        expect(() => taskService.validateTaskData(validTaskData)).not.toThrow();
      });

      it('should throw error for missing title', () => {
        const invalidTaskData = {
          title: '',
          description: 'Description',
          priority: 'high',
          type: 'work'
        } as TaskData;

        expect(() => taskService.validateTaskData(invalidTaskData)).toThrow('Title is required');
      });

      it('should throw error for whitespace-only title', () => {
        const invalidTaskData = {
          title: '   ',
          description: 'Description',
          priority: 'high',
          type: 'work'
        } as TaskData;

        expect(() => taskService.validateTaskData(invalidTaskData)).toThrow('Title is required');
      });

      it('should allow empty description', () => {
        const validTaskData: TaskData = {
          title: 'Valid Task',
          description: '',
          priority: 'high',
          type: 'work'
        };

        expect(() => taskService.validateTaskData(validTaskData)).not.toThrow();
      });
    });

    describe('isValidPriority', () => {
      it('should return true for valid priorities', () => {
        expect(taskService.isValidPriority('low')).toBe(true);
        expect(taskService.isValidPriority('normal')).toBe(true);
        expect(taskService.isValidPriority('high')).toBe(true);
      });

      it('should return false for invalid priorities', () => {
        expect(taskService.isValidPriority('invalid' as any)).toBe(false);
        expect(taskService.isValidPriority('urgent' as any)).toBe(false);
        expect(taskService.isValidPriority('' as any)).toBe(false);
      });
    });

    describe('isValidType', () => {
      it('should return true for valid types', () => {
        expect(taskService.isValidType('simple')).toBe(true);
        expect(taskService.isValidType('personal')).toBe(true);
        expect(taskService.isValidType('work')).toBe(true);
        expect(taskService.isValidType('hobby')).toBe(true);
        expect(taskService.isValidType('complex')).toBe(true);
      });

      it('should return false for invalid types', () => {
        expect(taskService.isValidType('invalid' as any)).toBe(false);
        expect(taskService.isValidType('business' as any)).toBe(false);
        expect(taskService.isValidType('' as any)).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      } as any);

      await expect(taskService.getAllTasks()).rejects.toThrow('Invalid JSON');
    });

    it('should handle network timeouts', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      await expect(taskService.getAllTasks()).rejects.toThrow('Request timeout');
    });
  });

  describe('API endpoint configuration', () => {
    it('should use the correct base URL', () => {
      expect(taskService['baseURL']).toBe('http://localhost:3001/api');
    });
  });
});
