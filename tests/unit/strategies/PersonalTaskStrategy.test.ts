import { describe, it, expect } from 'vitest'
import { PersonalTaskStrategy } from '../../../src/patterns/strategy/strategies/PersonalTaskStrategy'
import { TaskData } from '../../../src/patterns/strategy/TaskStrategy'

describe('PersonalTaskStrategy', () => {
  it('should create a PersonalTaskStrategy instance', () => {
    const strategy = new PersonalTaskStrategy()
    expect(strategy).toBeInstanceOf(PersonalTaskStrategy)
  })

  it('should add [Personal] prefix to task title', async () => {
    const strategy = new PersonalTaskStrategy()
    const taskData: TaskData = {
      title: 'Buy groceries',
      description: 'Weekly grocery shopping',
      priority: 'normal',
      type: 'personal'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Personal] Buy groceries')
    expect(result.description).toBe('Weekly grocery shopping')
    expect(result.priority).toBe('normal')
    expect(result.type).toBe('personal')
  })

  it('should preserve all other task properties', async () => {
    const strategy = new PersonalTaskStrategy()
    const taskData: TaskData = {
      title: 'Call mom',
      description: 'Weekly check-in call',
      priority: 'high',
      type: 'personal'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Personal] Call mom')
    expect(result.description).toBe('Weekly check-in call')
    expect(result.priority).toBe('high')
    expect(result.type).toBe('personal')
  })

  it('should handle empty descriptions', async () => {
    const strategy = new PersonalTaskStrategy()
    const taskData: TaskData = {
      title: 'Exercise',
      description: '',
      priority: 'low',
      type: 'personal'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Personal] Exercise')
    expect(result.description).toBe('')
    expect(result.priority).toBe('low')
  })

  it('should handle all priority levels', async () => {
    const strategy = new PersonalTaskStrategy()
    const priorities: Array<'low' | 'normal' | 'high' | 'urgent'> = ['low', 'normal', 'high', 'urgent']

    for (const priority of priorities) {
      const taskData: TaskData = {
        title: `Task with ${priority} priority`,
        description: 'Test description',
        priority,
        type: 'personal'
      }

      const result = await strategy.createTask(taskData)

      expect(result.priority).toBe(priority)
      expect(result.title).toBe(`[Personal] Task with ${priority} priority`)
    }
  })
})
