import express from 'express';
import { TaskService } from '../services/TaskService';

const router = express.Router();
const taskService = new TaskService();

router.post('/', async (req, res) => {
  try {
    const { title, description, priority, type } = req.body;

    const task = await taskService.createTask({
      title,
      description,
      priority,
      type
    });

    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
