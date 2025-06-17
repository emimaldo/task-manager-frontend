import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTaskManager, Task } from '../../../src/composables/useTaskManager';

// Mock fetch globally
global.fetch = vi.fn();

describe('useTaskManager', () => {
  let mockFetch: vi.MockedFunction<typeof fetch>;
  
  beforeEach(() => {
    mockFetch = global.fetch as vi.MockedFunction<typeof fetch>;
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const {
        tasks,
        taskTitle,
        taskDescription,
        taskType,
        taskPriority,
        loading,
        error,
      } = useTaskManager();

      expect(tasks.value).toEqual([]);
      expect(taskTitle.value).toBe('');
      expect(taskDescription.value).toBe('');
      expect(taskType.value).toBe('personal');
      expect(taskPriority.value).toBe('normal');
      expect(loading.value).toBe(false);
      expect(error.value).toBe('');
    });

    it('should return all required methods', () => {
      const manager = useTaskManager();

      expect(typeof manager.loadTasks).toBe('function');
      expect(typeof manager.createTask).toBe('function');
      expect(typeof manager.deleteTask).toBe('function');
      expect(typeof manager.updateTask).toBe('function');
      expect(typeof manager.toggleTaskCompletion).toBe('function');
    });
  });

  describe('loadTasks', () => {
    it('should load tasks successfully', async () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Description 1',
          priority: 'high',
          type: 'work',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Description 2',
          priority: 'normal',
          type: 'personal',
          completed: true,
          createdAt: '2024-01-02T00:00:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockTasks)
      } as any);

      const { tasks, loadTasks, loading, error } = useTaskManager();

      await loadTasks();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/tasks');
      expect(tasks.value).toEqual(mockTasks);
      expect(loading.value).toBe(false);
      expect(error.value).toBe('');
    });

    it('should handle loading state correctly', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce(promise as any);

      const { loadTasks, loading } = useTaskManager();

      // Start loading
      const loadPromise = loadTasks();
      
      // Should be loading
      expect(loading.value).toBe(true);

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: vi.fn().mockResolvedValueOnce([])
      });

      await loadPromise;

      // Should not be loading anymore
      expect(loading.value).toBe(false);
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      } as any);

      const { loadTasks, error, loading } = useTaskManager();

      await loadTasks();

      expect(error.value).toContain('Error loading tasks');
      expect(error.value).toContain('HTTP error! status: 500');
      expect(loading.value).toBe(false);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { loadTasks, error, loading } = useTaskManager();

      await loadTasks();

      expect(error.value).toContain('Error loading tasks');
      expect(error.value).toContain('Network error');
      expect(loading.value).toBe(false);
    });

    it('should clear previous errors on successful load', async () => {
      const { loadTasks, error } = useTaskManager();

      // First, simulate an error
      mockFetch.mockRejectedValueOnce(new Error('First error'));
      await loadTasks();
      expect(error.value).toContain('First error');

      // Then, simulate a successful load
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce([])
      } as any);

      await loadTasks();
      expect(error.value).toBe('');
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockCreatedTask: Task = {
        id: '1',
        title: 'New Task',
        description: 'New Description',
        priority: 'high',
        type: 'work',
        completed: false,
        createdAt: '2024-01-01T00:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockCreatedTask)
      } as any);

      const {
        tasks,
        taskTitle,
        taskDescription,
        taskPriority,
        taskType,
        createTask,
        loading,
        error
      } = useTaskManager();

      // Set form values
      taskTitle.value = 'New Task';
      taskDescription.value = 'New Description';
      taskPriority.value = 'high';
      taskType.value = 'work';

      await createTask();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Task',
          description: 'New Description',
          priority: 'high',
          type: 'work',
        }),
      });

      expect(tasks.value).toHaveLength(1);
      expect(tasks.value[0]).toEqual(mockCreatedTask);
      expect(loading.value).toBe(false);
      expect(error.value).toBe('');
    });

    it('should clear form fields after successful creation', async () => {
      const mockCreatedTask: Task = {
        id: '1',
        title: 'New Task',
        description: 'New Description',
        priority: 'high',
        type: 'work',
        completed: false,
        createdAt: '2024-01-01T00:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockCreatedTask)
      } as any);

      const {
        taskTitle,
        taskDescription,
        taskPriority,
        createTask
      } = useTaskManager();

      // Set form values
      taskTitle.value = 'New Task';
      taskDescription.value = 'New Description';
      taskPriority.value = 'high';

      await createTask();

      expect(taskTitle.value).toBe('');
      expect(taskDescription.value).toBe('');
      expect(taskPriority.value).toBe('normal');
    });

    it('should handle creation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      } as any);

      const { createTask, error, loading } = useTaskManager();

      await createTask();

      expect(error.value).toContain('Error creating task');
      expect(error.value).toContain('HTTP error! status: 400');
      expect(loading.value).toBe(false);
    });

    it('should handle network errors during creation', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { createTask, error, loading } = useTaskManager();

      await createTask();

      expect(error.value).toContain('Error creating task');
      expect(error.value).toContain('Network error');
      expect(loading.value).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      } as any);

      const { tasks, deleteTask, loading, error } = useTaskManager();

      // Pre-populate tasks
      tasks.value = [
        {
          id: '1',
          title: 'Task to delete',
          description: 'Description',
          priority: 'normal',
          type: 'personal',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          title: 'Task to keep',
          description: 'Description',
          priority: 'normal',
          type: 'personal',
          completed: false,
          createdAt: '2024-01-02T00:00:00Z'
        }
      ];

      await deleteTask('1');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1', {
        method: 'DELETE',
      });

      expect(tasks.value).toHaveLength(1);
      expect(tasks.value[0].id).toBe('2');
      expect(loading.value).toBe(false);
      expect(error.value).toBe('');
    });

    it('should handle deletion errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      } as any);

      const { deleteTask, error, loading } = useTaskManager();

      await deleteTask('nonexistent');

      expect(error.value).toContain('Error deleting task');
      expect(error.value).toContain('HTTP error! status: 404');
      expect(loading.value).toBe(false);
    });

    it('should handle network errors during deletion', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { deleteTask, error, loading } = useTaskManager();

      await deleteTask('1');

      expect(error.value).toContain('Error deleting task');
      expect(error.value).toContain('Network error');
      expect(loading.value).toBe(false);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updatedTask: Task = {
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'high',
        type: 'work',
        completed: true,
        createdAt: '2024-01-01T00:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(updatedTask)
      } as any);

      const { tasks, updateTask, loading, error } = useTaskManager();

      // Pre-populate tasks
      tasks.value = [
        {
          id: '1',
          title: 'Original Task',
          description: 'Original Description',
          priority: 'normal',
          type: 'personal',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      const updates = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'high' as const,
        completed: true
      };

      await updateTask('1', updates);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      expect(tasks.value[0]).toEqual(updatedTask);
      expect(loading.value).toBe(false);
      expect(error.value).toBe('');
    });

    it('should handle partial updates', async () => {
      const updatedTask: Task = {
        id: '1',
        title: 'Original Task',
        description: 'Original Description',
        priority: 'normal',
        type: 'personal',
        completed: true,
        createdAt: '2024-01-01T00:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(updatedTask)
      } as any);

      const { tasks, updateTask } = useTaskManager();

      // Pre-populate tasks
      tasks.value = [
        {
          id: '1',
          title: 'Original Task',
          description: 'Original Description',
          priority: 'normal',
          type: 'personal',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      // Only update completion status
      await updateTask('1', { completed: true });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });

      expect(tasks.value[0].completed).toBe(true);
    });

    it('should handle update errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      } as any);

      const { updateTask, error, loading } = useTaskManager();

      await updateTask('1', { title: 'Updated Title' });

      expect(error.value).toContain('Error updating task');
      expect(error.value).toContain('HTTP error! status: 400');
      expect(loading.value).toBe(false);
    });

    it('should handle network errors during update', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { updateTask, error, loading } = useTaskManager();

      await updateTask('1', { title: 'Updated Title' });

      expect(error.value).toContain('Error updating task');
      expect(error.value).toContain('Network error');
      expect(loading.value).toBe(false);
    });

    it('should not update if task is not found locally', async () => {
      const updatedTask: Task = {
        id: '999',
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'high',
        type: 'work',
        completed: true,
        createdAt: '2024-01-01T00:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(updatedTask)
      } as any);

      const { tasks, updateTask } = useTaskManager();

      // Pre-populate tasks with different id
      tasks.value = [
        {
          id: '1',
          title: 'Different Task',
          description: 'Description',
          priority: 'normal',
          type: 'personal',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      await updateTask('999', { title: 'Updated Title' });

      // Original task should remain unchanged
      expect(tasks.value[0].title).toBe('Different Task');
      expect(tasks.value).toHaveLength(1);
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle task completion from false to true', async () => {
      const originalTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Description',
        priority: 'normal',
        type: 'personal',
        completed: false,
        createdAt: '2024-01-01T00:00:00Z'
      };

      const updatedTask: Task = {
        ...originalTask,
        completed: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(updatedTask)
      } as any);

      const { tasks, toggleTaskCompletion } = useTaskManager();

      tasks.value = [originalTask];

      await toggleTaskCompletion('1');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });
    });

    it('should toggle task completion from true to false', async () => {
      const originalTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Description',
        priority: 'normal',
        type: 'personal',
        completed: true,
        createdAt: '2024-01-01T00:00:00Z'
      };

      const updatedTask: Task = {
        ...originalTask,
        completed: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(updatedTask)
      } as any);

      const { tasks, toggleTaskCompletion } = useTaskManager();

      tasks.value = [originalTask];

      await toggleTaskCompletion('1');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: false }),
      });
    });

    it('should handle non-existent task gracefully', async () => {
      const { tasks, toggleTaskCompletion } = useTaskManager();

      tasks.value = [
        {
          id: '1',
          title: 'Existing Task',
          description: 'Description',
          priority: 'normal',
          type: 'personal',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      // Should not throw or make any API calls
      await toggleTaskCompletion('nonexistent');

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('reactive state management', () => {
    it('should maintain reactive state across multiple operations', async () => {
      const { tasks, taskTitle, taskDescription, createTask, loading } = useTaskManager();

      // Mock successful creation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          id: '1',
          title: 'Test Task',
          description: 'Test Description',
          priority: 'normal',
          type: 'personal',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z'
        })
      } as any);

      // Set form values
      taskTitle.value = 'Test Task';
      taskDescription.value = 'Test Description';

      expect(tasks.value).toHaveLength(0);
      expect(loading.value).toBe(false);

      await createTask();

      expect(tasks.value).toHaveLength(1);
      expect(taskTitle.value).toBe('');
      expect(taskDescription.value).toBe('');
      expect(loading.value).toBe(false);
    });

    it('should be independent across multiple composable instances', () => {
      const manager1 = useTaskManager();
      const manager2 = useTaskManager();

      manager1.taskTitle.value = 'Manager 1 Task';
      manager2.taskTitle.value = 'Manager 2 Task';

      expect(manager1.taskTitle.value).toBe('Manager 1 Task');
      expect(manager2.taskTitle.value).toBe('Manager 2 Task');
    });
  });

  describe('API configuration', () => {
    it('should use correct API base URL', () => {
      const { loadTasks } = useTaskManager();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce([])
      } as any);

      loadTasks();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/tasks');
    });
  });
});
