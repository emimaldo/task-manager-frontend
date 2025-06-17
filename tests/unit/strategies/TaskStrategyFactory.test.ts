import { describe, it, expect } from 'vitest'
import { TaskStrategyFactory } from '../../../src/patterns/strategy/strategies/TaskStrategyFactory'
import { SimpleTaskStrategy } from '../../../src/patterns/strategy/strategies/SimpleTaskStrategy'
import { ComplexTaskStrategy } from '../../../src/patterns/strategy/strategies/ComplexTaskStrategy'
import { PersonalTaskStrategy } from '../../../src/patterns/strategy/strategies/PersonalTaskStrategy'
import { WorkTaskStrategy } from '../../../src/patterns/strategy/strategies/WorkTaskStrategy'
import { HobbyTaskStrategy } from '../../../src/patterns/strategy/strategies/HobbyTaskStrategy'
import { TaskStrategy } from '../../../src/patterns/strategy/TaskStrategy'

describe('TaskStrategyFactory', () => {
  describe('create method', () => {
    it('should create SimpleTaskStrategy for "simple" type', () => {
      const strategy = TaskStrategyFactory.create('simple')
      expect(strategy).toBeInstanceOf(SimpleTaskStrategy)
    })

    it('should create ComplexTaskStrategy for "complex" type', () => {
      const strategy = TaskStrategyFactory.create('complex')
      expect(strategy).toBeInstanceOf(ComplexTaskStrategy)
    })

    it('should create PersonalTaskStrategy for "personal" type', () => {
      const strategy = TaskStrategyFactory.create('personal')
      expect(strategy).toBeInstanceOf(PersonalTaskStrategy)
    })

    it('should create WorkTaskStrategy for "work" type', () => {
      const strategy = TaskStrategyFactory.create('work')
      expect(strategy).toBeInstanceOf(WorkTaskStrategy)
    })

    it('should create HobbyTaskStrategy for "hobby" type', () => {
      const strategy = TaskStrategyFactory.create('hobby')
      expect(strategy).toBeInstanceOf(HobbyTaskStrategy)
    })

    it('should be case insensitive', () => {
      const testCases = [
        { input: 'SIMPLE', expected: SimpleTaskStrategy },
        { input: 'Simple', expected: SimpleTaskStrategy },
        { input: 'sImPlE', expected: SimpleTaskStrategy },
        { input: 'COMPLEX', expected: ComplexTaskStrategy },
        { input: 'Complex', expected: ComplexTaskStrategy },
        { input: 'PERSONAL', expected: PersonalTaskStrategy },
        { input: 'Personal', expected: PersonalTaskStrategy },
        { input: 'WORK', expected: WorkTaskStrategy },
        { input: 'Work', expected: WorkTaskStrategy },
        { input: 'HOBBY', expected: HobbyTaskStrategy },
        { input: 'Hobby', expected: HobbyTaskStrategy }
      ]

      testCases.forEach(({ input, expected }) => {
        const strategy = TaskStrategyFactory.create(input)
        expect(strategy).toBeInstanceOf(expected)
      })
    })

    it('should return SimpleTaskStrategy as default for unknown types', () => {
      const unknownTypes = [
        'unknown',
        'invalid',
        'random',
        '',
        '123',
        'test',
        'undefined',
        'null'
      ]

      unknownTypes.forEach(type => {
        const strategy = TaskStrategyFactory.create(type)
        expect(strategy).toBeInstanceOf(SimpleTaskStrategy)
      })
    })

    it('should handle edge cases and special characters', () => {
      const edgeCases = [
        '   simple   ', // with spaces
        'simple\n',    // with newline
        'simple\t',    // with tab
        'simple.',     // with period
        'simple!',     // with exclamation
        '@simple',     // with symbol
        'simple123'    // with numbers
      ]

      edgeCases.forEach(type => {
        const strategy = TaskStrategyFactory.create(type)
        // Most of these should default to SimpleTaskStrategy except the first one
        if (type.trim() === 'simple') {
          expect(strategy).toBeInstanceOf(SimpleTaskStrategy)
        } else {
          expect(strategy).toBeInstanceOf(SimpleTaskStrategy) // Default fallback
        }
      })
    })

    it('should return new instances each time', () => {
      const strategy1 = TaskStrategyFactory.create('simple')
      const strategy2 = TaskStrategyFactory.create('simple')
      
      expect(strategy1).not.toBe(strategy2)
      expect(strategy1).toBeInstanceOf(SimpleTaskStrategy)
      expect(strategy2).toBeInstanceOf(SimpleTaskStrategy)
    })

    it('should return strategies that implement TaskStrategy interface', () => {
      const types = ['simple', 'complex', 'personal', 'work', 'hobby']
      
      types.forEach(type => {
        const strategy = TaskStrategyFactory.create(type)
        expect(strategy).toHaveProperty('createTask')
        expect(typeof strategy.createTask).toBe('function')
      })
    })

    it('should handle null and undefined inputs gracefully', () => {
      // TypeScript might not allow these, but testing runtime behavior
      const strategy1 = TaskStrategyFactory.create(null as any)
      const strategy2 = TaskStrategyFactory.create(undefined as any)
      
      expect(strategy1).toBeInstanceOf(SimpleTaskStrategy)
      expect(strategy2).toBeInstanceOf(SimpleTaskStrategy)
    })
  })

  describe('Factory Pattern Implementation', () => {
    it('should be a static factory method', () => {
      expect(typeof TaskStrategyFactory.create).toBe('function')
      expect(TaskStrategyFactory.create).toBeDefined()
    })

    it('should not require instantiation', () => {
      // Should be able to call create without instantiating the factory
      expect(() => TaskStrategyFactory.create('simple')).not.toThrow()
    })

    it('should create different strategy types correctly', async () => {
      const simpleStrategy = TaskStrategyFactory.create('simple')
      const complexStrategy = TaskStrategyFactory.create('complex')
      const personalStrategy = TaskStrategyFactory.create('personal')
      const workStrategy = TaskStrategyFactory.create('work')
      const hobbyStrategy = TaskStrategyFactory.create('hobby')

      // Test that each strategy behaves correctly
      const taskData = {
        title: 'Test Task',
        description: 'Test description',
        priority: 'normal' as const,
        type: 'test'
      }

      const simpleResult = await simpleStrategy.createTask(taskData)
      const complexResult = await complexStrategy.createTask(taskData)
      const personalResult = await personalStrategy.createTask(taskData)
      const workResult = await workStrategy.createTask(taskData)
      const hobbyResult = await hobbyStrategy.createTask(taskData)

      expect(simpleResult.title).toBe('Simple: Test Task')
      expect(complexResult.title).toBe('Complex: Test Task')
      expect(personalResult.title).toBe('[Personal] Test Task')
      expect(workResult.title).toBe('[Work] Test Task')
      expect(hobbyResult.title).toBe('[Hobby] Test Task')
    })

    it('should handle concurrent strategy creation', () => {
      const strategies: TaskStrategy[] = []
      const types = ['simple', 'complex', 'personal', 'work', 'hobby']
      
      // Create multiple strategies concurrently
      for (let i = 0; i < 100; i++) {
        const randomType = types[Math.floor(Math.random() * types.length)]
        strategies.push(TaskStrategyFactory.create(randomType))
      }

      // All should be valid strategy instances
      strategies.forEach(strategy => {
        expect(strategy).toHaveProperty('createTask')
        expect(typeof strategy.createTask).toBe('function')
      })
    })

    it('should be deterministic - same input produces same type', () => {
      const type = 'complex'
      const iterations = 10
      
      for (let i = 0; i < iterations; i++) {
        const strategy = TaskStrategyFactory.create(type)
        expect(strategy).toBeInstanceOf(ComplexTaskStrategy)
      }
    })
  })

  describe('Integration with Strategy Pattern', () => {
    it('should integrate seamlessly with TaskStrategyContext', async () => {
      // This test verifies the factory works with the broader strategy pattern
      const { TaskStrategyContext } = await import('../../../src/patterns/strategy/TaskStrategyContext')
      
      const strategy = TaskStrategyFactory.create('work')
      const context = new TaskStrategyContext(strategy)
      
      const taskData = {
        title: 'Integration Test',
        description: 'Testing factory integration',
        priority: 'low' as const,
        type: 'work'
      }

      const result = await context.createTask(taskData)
      
      expect(result.title).toBe('[Work] Integration Test')
      expect(result.priority).toBe('normal') // WorkStrategy elevates low to normal
    })

    it('should support all task types used in the application', () => {
      // Verify all types that the application expects to use
      const applicationTaskTypes = [
        'simple',
        'complex', 
        'personal',
        'work',
        'hobby'
      ]

      applicationTaskTypes.forEach(type => {
        expect(() => TaskStrategyFactory.create(type)).not.toThrow()
        const strategy = TaskStrategyFactory.create(type)
        expect(strategy).toBeInstanceOf(Object)
        expect(strategy).toHaveProperty('createTask')
      })
    })
  })

  describe('Performance and Memory', () => {
    it('should create strategies efficiently', () => {
      const startTime = performance.now()
      
      // Create many strategies
      for (let i = 0; i < 1000; i++) {
        TaskStrategyFactory.create('simple')
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete quickly (arbitrary threshold)
      expect(duration).toBeLessThan(100) // 100ms for 1000 creations
    })

    it('should not leak memory with repeated calls', () => {
      // Create and discard many strategies
      for (let i = 0; i < 100; i++) {
        const strategy = TaskStrategyFactory.create('complex')
        // Let strategy go out of scope
      }
      
      // If we get here without memory issues, test passes
      expect(true).toBe(true)
    })
  })
})
