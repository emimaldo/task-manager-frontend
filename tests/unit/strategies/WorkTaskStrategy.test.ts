import { describe, it, expect } from 'vitest'
import { WorkTaskStrategy } from '../../../src/patterns/strategy/strategies/WorkTaskStrategy'
import { TaskData } from '../../../src/patterns/strategy/TaskStrategy'

describe('WorkTaskStrategy', () => {
  it('should create a WorkTaskStrategy instance', () => {
    const strategy = new WorkTaskStrategy()
    expect(strategy).toBeInstanceOf(WorkTaskStrategy)
  })

  it('should add [Work] prefix to task title', async () => {
    const strategy = new WorkTaskStrategy()
    const taskData: TaskData = {
      title: 'Finish quarterly report',
      description: 'Complete Q4 financial report',
      priority: 'normal',
      type: 'work'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Work] Finish quarterly report')
    expect(result.description).toBe('Complete Q4 financial report')
    expect(result.priority).toBe('normal')
    expect(result.type).toBe('work')
  })

  it('should elevate low priority to normal for work tasks', async () => {
    const strategy = new WorkTaskStrategy()
    const taskData: TaskData = {
      title: 'Check emails',
      description: 'Morning email check',
      priority: 'low',
      type: 'work'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Work] Check emails')
    expect(result.priority).toBe('normal') // Should be elevated from 'low'
    expect(result.description).toBe('Morning email check')
    expect(result.type).toBe('work')
  })

  it('should preserve normal priority', async () => {
    const strategy = new WorkTaskStrategy()
    const taskData: TaskData = {
      title: 'Team meeting',
      description: 'Weekly standup',
      priority: 'normal',
      type: 'work'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Work] Team meeting')
    expect(result.priority).toBe('normal')
    expect(result.description).toBe('Weekly standup')
  })

  it('should preserve high priority', async () => {
    const strategy = new WorkTaskStrategy()
    const taskData: TaskData = {
      title: 'Fix production bug',
      description: 'Critical issue affecting users',
      priority: 'high',
      type: 'work'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Work] Fix production bug')
    expect(result.priority).toBe('high')
    expect(result.description).toBe('Critical issue affecting users')
  })

  it('should preserve urgent priority', async () => {
    const strategy = new WorkTaskStrategy()
    const taskData: TaskData = {
      title: 'Server outage response',
      description: 'Emergency server maintenance',
      priority: 'urgent',
      type: 'work'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Work] Server outage response')
    expect(result.priority).toBe('urgent')
    expect(result.description).toBe('Emergency server maintenance')
  })

  it('should handle empty descriptions', async () => {
    const strategy = new WorkTaskStrategy()
    const taskData: TaskData = {
      title: 'Review code',
      description: '',
      priority: 'normal',
      type: 'work'
    }

    const result = await strategy.createTask(taskData)

    expect(result.title).toBe('[Work] Review code')
    expect(result.description).toBe('')
    expect(result.priority).toBe('normal')
  })

  it('should handle multiple low priority tasks and elevate all to normal', async () => {
    const strategy = new WorkTaskStrategy()
    const lowPriorityTasks = [
      'Update documentation',
      'Clean up workspace',
      'Organize files'
    ]

    for (const taskTitle of lowPriorityTasks) {
      const taskData: TaskData = {
        title: taskTitle,
        description: 'Test description',
        priority: 'low',
        type: 'work'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe(`[Work] ${taskTitle}`)
      expect(result.priority).toBe('normal') // All should be elevated
    }
  })

  it('should preserve all task properties except modified ones', async () => {
    const strategy = new WorkTaskStrategy()
    const taskData: TaskData = {
      title: 'Design new feature',
      description: 'Create mockups for user dashboard',
      priority: 'high',
      type: 'work'
    }

    const result = await strategy.createTask(taskData)

    // Verify only title gets prefix and priority logic is applied
    expect(result.title).toBe('[Work] Design new feature')
    expect(result.description).toBe(taskData.description)
    expect(result.priority).toBe(taskData.priority) // Should remain 'high'
    expect(result.type).toBe(taskData.type)
  })

  describe('Priority elevation logic', () => {
    it('should only elevate exactly "low" priority', async () => {
      const strategy = new WorkTaskStrategy()
      
      // Test that only 'low' gets elevated, not other values
      const priorities: Array<'normal' | 'high' | 'urgent'> = ['normal', 'high', 'urgent']
      
      for (const priority of priorities) {
        const taskData: TaskData = {
          title: `Task with ${priority} priority`,
          description: 'Test description',
          priority,
          type: 'work'
        }

        const result = await strategy.createTask(taskData)

        expect(result.priority).toBe(priority) // Should remain unchanged
        expect(result.title).toBe(`[Work] Task with ${priority} priority`)
      }
    })

    it('should demonstrate the work priority upgrade rule', async () => {
      const strategy = new WorkTaskStrategy()
      
      // Create a mapping of input to expected output priorities
      const priorityTests = [
        { input: 'low', expected: 'normal' },
        { input: 'normal', expected: 'normal' },
        { input: 'high', expected: 'high' },
        { input: 'urgent', expected: 'urgent' }
      ] as const

      for (const test of priorityTests) {
        const taskData: TaskData = {
          title: `Test task`,
          description: `Priority test: ${test.input} -> ${test.expected}`,
          priority: test.input,
          type: 'work'
        }

        const result = await strategy.createTask(taskData)

        expect(result.priority).toBe(test.expected)
      }
    })
  })

  describe('Edge cases', () => {
    it('should handle tasks with special characters in title', async () => {
      const strategy = new WorkTaskStrategy()
      const taskData: TaskData = {
        title: 'Review & approve budget (2024)',
        description: 'Annual budget review',
        priority: 'high',
        type: 'work'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('[Work] Review & approve budget (2024)')
    })

    it('should handle empty title', async () => {
      const strategy = new WorkTaskStrategy()
      const taskData: TaskData = {
        title: '',
        description: 'Task with empty title',
        priority: 'low',
        type: 'work'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('[Work] ')
      expect(result.priority).toBe('normal') // Still should elevate priority
    })
  })
})