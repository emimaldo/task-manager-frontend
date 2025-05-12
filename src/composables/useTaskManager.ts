import { ref } from 'vue';
import { TaskStrategyFactory } from '../patterns/strategy/strategies/TaskStrategyFactory';
import { TaskStrategyContext } from '../patterns/strategy/TaskStrategyContext';

export function useTaskManager() {
  const tasks = ref<{ title: string }[]>([]);
  const taskTitle = ref('');
  const taskType = ref('simple');

  const createTask = async () => {
    try {
      const strategy = TaskStrategyFactory.create(taskType.value);
      const context = new TaskStrategyContext(strategy);
      const task = await context.createTask(taskTitle.value);
      tasks.value.push(task);
      taskTitle.value = '';
    } catch (err: any) {
      console.error('Error creating task:', err.message);
    }
  };

  return {
    tasks,
    taskTitle,
    taskType,
    createTask,
  };
}
