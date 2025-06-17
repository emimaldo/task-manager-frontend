import { ref } from 'vue';

const API_BASE_URL = 'http://localhost:4000/api';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: 'personal' | 'work' | 'simple' | 'complex' | 'hobby';
  completed: boolean;
  createdAt: string;
}

export function useTaskManager() {
  const tasks = ref<Task[]>([]);
  const taskTitle = ref('');
  const taskDescription = ref('');
  const taskType = ref<Task['type']>('personal');
  const taskPriority = ref<Task['priority']>('normal');
  const loading = ref(false);
  const error = ref('');

  // Load tasks from the backend
  const loadTasks = async () => {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      tasks.value = data;
    } catch (err: any) {
      error.value = `Error loading tasks: ${err.message}`;
      console.error('Error loading tasks:', err);
    } finally {
      loading.value = false;
    }
  };

  // Create new task using the backend
  const createTask = async () => {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskTitle.value,
          description: taskDescription.value,
          priority: taskPriority.value,
          type: taskType.value,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTask = await response.json();
      tasks.value.push(newTask);
      
      // Clear all form fields
      taskTitle.value = '';
      taskDescription.value = '';
      taskPriority.value = 'normal';
      taskType.value = 'personal';
      
    } catch (err: any) {
      error.value = `Error creating task: ${err.message}`;
      console.error('Error creating task:', err);
    } finally {
      loading.value = false;
    }
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove from local list
      tasks.value = tasks.value.filter(task => task.id !== taskId);
      
    } catch (err: any) {
      error.value = `Error deleting task: ${err.message}`;
      console.error('Error deleting task:', err);
    } finally {
      loading.value = false;
    }
  };

  // Update task
  const updateTask = async (taskId: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'completed'>>) => {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();
      
      // Update in local list
      const index = tasks.value.findIndex(task => task.id === taskId);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
      
    } catch (err: any) {
      error.value = `Error updating task: ${err.message}`;
      console.error('Error updating task:', err);
    } finally {
      loading.value = false;
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  };

  return {
    tasks,
    taskTitle,
    taskDescription,
    taskType,
    taskPriority,
    loading,
    error,
    loadTasks,
    createTask,
    deleteTask,
    updateTask,
    toggleTaskCompletion,
  };
}
