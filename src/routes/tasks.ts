import express from 'express';
import { TaskStrategyFactory } from '../patterns/strategy/strategies/TaskStrategyFactory';
import { TaskStrategyContext } from '../patterns/strategy/TaskStrategyContext';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { title, type } = req.body;

    const strategy = TaskStrategyFactory.create(type);
    const context = new TaskStrategyContext(strategy);
    const task = await context.createTask(title);

    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
