import { describe, it, expect, beforeEach } from 'vitest'
import { ComplexTaskStrategy } from '../../../src/patterns/strategy/strategies/ComplexTaskStrategy'
import { TaskData } from '../../../src/patterns/strategy/TaskStrategy'

describe('ComplexTaskStrategy', () => {
  let strategy: ComplexTaskStrategy

  beforeEach(() => {
    strategy = new ComplexTaskStrategy()
  })

  describe('createTask', () => {
    it('should create a ComplexTaskStrategy instance', () => {
      expect(strategy).toBeInstanceOf(ComplexTaskStrategy)
    })

    it('should add "Complex:" prefix to task title', async () => {
      const taskData: TaskData = {
        title: 'Implement new feature',
        description: 'Build a complex feature with multiple components',
        priority: 'normal',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: Implement new feature')
      expect(result.description).toBe('Build a complex feature with multiple components')
      expect(result.priority).toBe('normal')
      expect(result.type).toBe('complex')
    })

    it('should elevate low priority to normal for complex tasks', async () => {
      const taskData: TaskData = {
        title: 'Refactor legacy code',
        description: 'Complex refactoring task',
        priority: 'low',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: Refactor legacy code')
      expect(result.priority).toBe('normal') // Should be elevated from 'low'
      expect(result.description).toBe('Complex refactoring task')
      expect(result.type).toBe('complex')
    })

    it('should preserve normal priority', async () => {
      const taskData: TaskData = {
        title: 'Database migration',
        description: 'Migrate to new database schema',
        priority: 'normal',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: Database migration')
      expect(result.priority).toBe('normal')
      expect(result.description).toBe('Migrate to new database schema')
    })

    it('should preserve high priority', async () => {
      const taskData: TaskData = {
        title: 'Security vulnerability fix',
        description: 'Fix critical security issue',
        priority: 'high',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: Security vulnerability fix')
      expect(result.priority).toBe('high')
      expect(result.description).toBe('Fix critical security issue')
    })

    it('should preserve urgent priority', async () => {
      const taskData: TaskData = {
        title: 'System outage resolution',
        description: 'Emergency system recovery',
        priority: 'urgent',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: System outage resolution')
      expect(result.priority).toBe('urgent')
      expect(result.description).toBe('Emergency system recovery')
    })

    it('should handle empty descriptions', async () => {
      const taskData: TaskData = {
        title: 'Algorithm optimization',
        description: '',
        priority: 'normal',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: Algorithm optimization')
      expect(result.description).toBe('')
      expect(result.priority).toBe('normal')
    })

    it('should handle empty title correctly', async () => {
      const taskData: TaskData = {
        title: '',
        description: 'Complex task with empty title',
        priority: 'low',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: ')
      expect(result.priority).toBe('normal') // Still should elevate priority
    })

    it('should handle special characters in title', async () => {
      const taskData: TaskData = {
        title: 'API v2.0 upgrade & migration (Phase 1)',
        description: 'Complex system upgrade',
        priority: 'high',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: API v2.0 upgrade & migration (Phase 1)')
    })

    it('should not modify the original task data object', async () => {
      const originalTaskData: TaskData = {
        title: 'Original Complex Task',
        description: 'Original description',
        priority: 'low',
        type: 'complex'
      }

      await strategy.createTask(originalTaskData)

      expect(originalTaskData.title).toBe('Original Complex Task')
      expect(originalTaskData.priority).toBe('low')
      expect(originalTaskData.description).toBe('Original description')
      expect(originalTaskData.type).toBe('complex')
    })

    it('should return a new object instance', async () => {
      const taskData: TaskData = {
        title: 'Test Complex Task',
        description: 'Test description',
        priority: 'low',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result).not.toBe(taskData)
      expect(result).toEqual({
        ...taskData,
        title: 'Complex: Test Complex Task',
        priority: 'normal'
      })
    })
  })

  describe('Priority elevation logic', () => {
    it('should only elevate exactly "low" priority to "normal"', async () => {
      const strategy = new ComplexTaskStrategy()
      
      // Test that only 'low' gets elevated, not other values
      const priorities: Array<'normal' | 'high' | 'urgent'> = ['normal', 'high', 'urgent']
      
      for (const priority of priorities) {
        const taskData: TaskData = {
          title: `Task with ${priority} priority`,
          description: 'Test description',
          priority,
          type: 'complex'
        }

        const result = await strategy.createTask(taskData)

        expect(result.priority).toBe(priority) // Should remain unchanged
        expect(result.title).toBe(`Complex: Task with ${priority} priority`)
      }
    })

    it('should demonstrate the complex priority upgrade rule', async () => {
      const strategy = new ComplexTaskStrategy()
      
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
          type: 'complex'
        }

        const result = await strategy.createTask(taskData)

        expect(result.priority).toBe(test.expected)
      }
    })
  })

  describe('Strategy Pattern Implementation', () => {
    it('should implement TaskStrategy interface', () => {
      expect(strategy).toHaveProperty('createTask')
      expect(typeof strategy.createTask).toBe('function')
    })

    it('should be instantiable multiple times with independent behavior', async () => {
      const strategy1 = new ComplexTaskStrategy()
      const strategy2 = new ComplexTaskStrategy()

      const taskData1: TaskData = {
        title: 'Complex Task 1',
        description: 'First complex task',
        priority: 'low',
        type: 'complex'
      }

      const taskData2: TaskData = {
        title: 'Complex Task 2',
        description: 'Second complex task',
        priority: 'high',
        type: 'complex'
      }

      const result1 = await strategy1.createTask(taskData1)
      const result2 = await strategy2.createTask(taskData2)

      expect(result1.title).toBe('Complex: Complex Task 1')
      expect(result1.priority).toBe('normal') // Elevated from low
      expect(result2.title).toBe('Complex: Complex Task 2')
      expect(result2.priority).toBe('high') // Preserved
      expect(result1).not.toBe(result2)
    })

    it('should be asynchronous and return a Promise', async () => {
      const taskData: TaskData = {
        title: 'Async Complex Test',
        description: 'Test async behavior',
        priority: 'normal',
        type: 'complex'
      }

      const promise = strategy.createTask(taskData)
      expect(promise).toBeInstanceOf(Promise)

      const result = await promise
      expect(result.title).toBe('Complex: Async Complex Test')
    })
  })

  describe('Edge cases', () => {
    it('should handle tasks with very long titles', async () => {
      const longTitle = 'A'.repeat(500) + ' Complex Task'
      const taskData: TaskData = {
        title: longTitle,
        description: 'Complex task with long title',
        priority: 'normal',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe(`Complex: ${longTitle}`)
    })

    it('should handle unicode characters in title', async () => {
      const taskData: TaskData = {
        title: '🔧 Complex Task with 🚀 emojis and 中文字符',
        description: 'Unicode test for complex tasks',
        priority: 'normal',
        type: 'complex'
      }

      const result = await strategy.createTask(taskData)

      expect(result.title).toBe('Complex: 🔧 Complex Task with 🚀 emojis and 中文字符')
    })
  })
})
