import { describe, it, expect } from 'vitest'
import { HobbyTaskStrategy } from '../../../src/patterns/strategy/strategies/HobbyTaskStrategy'
import { TaskData } from '../../../src/patterns/strategy/TaskStrategy'

describe('HobbyTaskStrategy', () => {
  it('should create a HobbyTaskStrategy instance', () => {
    const strategy = new HobbyTaskStrategy()
    expect(strategy).toBeInstanceOf(HobbyTaskStrategy)
  })

  it('should add [Hobby] prefix to task title and set priority to low', async () => {
    const strategy = new HobbyTaskStrategy()
    const taskData: TaskData = {
      title: 'Learn guitar',
      description: 'Practice guitar for 30 minutes daily',
      priority: 'high', // Should be overridden to low
      type: 'hobby'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Hobby] Learn guitar')
    expect(result.description).toBe('Practice guitar for 30 minutes daily')
    expect(result.priority).toBe('low') // Always set to low for hobbies
    expect(result.type).toBe('hobby')
  })

  it('should override priority to low regardless of input priority', async () => {
    const strategy = new HobbyTaskStrategy()
    const priorities: Array<'low' | 'normal' | 'high' | 'urgent'> = ['low', 'normal', 'high', 'urgent']

    for (const inputPriority of priorities) {
      const taskData: TaskData = {
        title: `Hobby task with ${inputPriority} priority`,
        description: 'Test hobby task',
        priority: inputPriority,
        type: 'hobby'
      }

      const result = await strategy.createTask(taskData)

      expect(result.priority).toBe('low') // Always low for hobbies
      expect(result.title).toBe(`[Hobby] Hobby task with ${inputPriority} priority`)
    }
  })

  it('should preserve description and type properties', async () => {
    const strategy = new HobbyTaskStrategy()
    const taskData: TaskData = {
      title: 'Paint landscape',
      description: 'Watercolor painting of mountain scenery',
      priority: 'urgent',
      type: 'hobby'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Hobby] Paint landscape')
    expect(result.description).toBe('Watercolor painting of mountain scenery')
    expect(result.priority).toBe('low')
    expect(result.type).toBe('hobby')
  })

  it('should handle empty descriptions', async () => {
    const strategy = new HobbyTaskStrategy()
    const taskData: TaskData = {
      title: 'Read book',
      description: '',
      priority: 'normal',
      type: 'hobby'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Hobby] Read book')
    expect(result.description).toBe('')
    expect(result.priority).toBe('low')
    expect(result.type).toBe('hobby')
  })

  it('should handle special characters in title', async () => {
    const strategy = new HobbyTaskStrategy()
    const taskData: TaskData = {
      title: 'Learn C++ & Python!',
      description: 'Programming as a hobby',
      priority: 'high',
      type: 'hobby'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Hobby] Learn C++ & Python!')
    expect(result.description).toBe('Programming as a hobby')
    expect(result.priority).toBe('low')
  })

  it('should handle long titles', async () => {
    const strategy = new HobbyTaskStrategy()
    const longTitle = 'This is a very long hobby task title that contains many words and characters to test how the strategy handles lengthy inputs'
    const taskData: TaskData = {
      title: longTitle,
      description: 'Test description',
      priority: 'urgent',
      type: 'hobby'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe(`[Hobby] ${longTitle}`)
    expect(result.priority).toBe('low')
  })
})