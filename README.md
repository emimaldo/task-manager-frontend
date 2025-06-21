# Task Manager Frontend



This is the frontend part of the Task Manager project, built using **Vue 3** and **TypeScript**. It demonstrates the implementation of multiple design patterns including Strategy and Factory patterns for flexible task management.

## Project Structure

```
src/
├── patterns/
│   └── strategy/
│       ├── TaskStrategy.ts              # Strategy interface
│       ├── TaskStrategyContext.ts       # Context class
│       └── strategies/
│           ├── TaskStrategyFactory.ts   # Factory for creating strategies
│           ├── SimpleTaskStrategy.ts    # Simple task implementation
│           ├── ComplexTaskStrategy.ts   # Complex task implementation
│           ├── PersonalTaskStrategy.ts  # Personal task implementation
│           ├── WorkTaskStrategy.ts      # Work task implementation
│           └── HobbyTaskStrategy.ts     # Hobby task implementation
├── composables/
│   └── useTaskManager.ts                # Vue 3 composable for task management
├── services/
│   └── TaskService.ts                   # HTTP service layer
├── routes/
│   └── tasks.ts                         # API route definitions
└── App.vue                              # Root Vue component

tests/
├── unit/
│   ├── composables/
│   │   └── useTaskManager.test.ts       # Composable tests (25 tests)
│   ├── services/
│   │   └── TaskService.test.ts          # Service layer tests (27 tests)
│   └── strategies/
│       ├── SimpleTaskStrategy.test.ts   # Simple strategy tests (15 tests)
│       ├── ComplexTaskStrategy.test.ts  # Complex strategy tests (15 tests)
│       ├── PersonalTaskStrategy.test.ts # Personal strategy tests (15 tests)
│       ├── WorkTaskStrategy.test.ts     # Work strategy tests (15 tests)
│       ├── HobbyTaskStrategy.test.ts    # Hobby strategy tests (15 tests)
│       └── TaskStrategyFactory.test.ts  # Factory tests (15 tests)
└── integration/
    └── task-manager.test.ts             # End-to-end integration tests
```

## Design Patterns Implementation

### Strategy Pattern
Allows the application to switch between different task creation algorithms dynamically without changing the client code.

**Key Components:**
- **TaskStrategy (Interface)**: Defines the contract for task creation strategies
- **TaskStrategyContext**: Maintains a reference to a strategy and delegates work to it
- **Concrete Strategies**: `SimpleTaskStrategy` and `ComplexTaskStrategy`

```typescript
// Usage example
const context = new TaskStrategyContext(strategy);
const task = context.createTask("My Task");
```

### Factory Method Pattern
Encapsulates the object creation logic and provides a centralized way to instantiate the correct strategy based on task type.

**Benefits:**
- **Decoupling**: Client code doesn't need to know about concrete strategy classes
- **Centralization**: All creation logic is in one place
- **Extensibility**: Easy to add new strategies without modifying existing code

```typescript
// Usage example
const strategy = TaskStrategyFactory.create('simple');
const context = new TaskStrategyContext(strategy);
```

### Pattern Combination Benefits

1. **Loose Coupling**: Components depend on abstractions, not concrete implementations
2. **Single Responsibility**: Each class has one reason to change
3. **Open/Closed Principle**: Open for extension, closed for modification
4. **Easy Testing**: Strategies can be mocked and tested independently

## Scripts

```bash
npm install       # Install dependencies
npm run dev       # Run development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run type-check # Run TypeScript compiler check
npm test          # Run all tests
npm run test:ui   # Run tests with UI
npm run coverage  # Run tests with coverage report
```

## 🧪 Testing Implementation

### Testing Stack
- **Vitest**: Modern testing framework optimized for Vite projects
- **Vue Test Utils**: Official testing utilities for Vue components
- **TypeScript**: Full type safety in tests
- **jsdom**: DOM simulation for component testing

### Test Structure

```
tests/
├── unit/
│   ├── composables/
│   │   └── useTaskManager.test.ts      # Composable logic tests
│   ├── services/
│   │   └── TaskService.test.ts         # Service layer tests
│   └── strategies/
│       ├── SimpleTaskStrategy.test.ts   # Strategy pattern tests
│       ├── ComplexTaskStrategy.test.ts
│       ├── PersonalTaskStrategy.test.ts
│       ├── WorkTaskStrategy.test.ts
│       ├── HobbyTaskStrategy.test.ts
│       └── TaskStrategyFactory.test.ts
└── integration/
    └── task-manager.test.ts            # End-to-end workflow tests
```

### Key Testing Patterns

#### 1. **Composable Testing (useTaskManager)**
Tests Vue 3 composables with reactive state management:

```typescript
describe('useTaskManager', () => {
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { tasks, taskTitle, loading } = useTaskManager();
    
    expect(tasks.value).toEqual([]);
    expect(taskTitle.value).toBe('');
    expect(loading.value).toBe(false);
  });

  it('should create a task successfully', async () => {
    // Mock API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockCreatedTask)
    });

    // Test the composable logic
    await createTask();
    
    expect(tasks.value).toHaveLength(1);
    expect(tasks.value[0]).toEqual(mockCreatedTask);
  });
});
```

#### 2. **Service Layer Testing (TaskService)**
Tests HTTP client services with mocked fetch:

```typescript
describe('TaskService', () => {
  it('should fetch all tasks successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockTasks)
    });

    const result = await taskService.getAllTasks();

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/tasks');
    expect(result).toEqual(mockTasks);
  });

  it('should validate required fields', async () => {
    const invalidData = { title: '', type: 'work' };
    
    await expect(taskService.createTask(invalidData))
      .rejects.toThrow('Title is required');
  });
});
```

#### 3. **Strategy Pattern Testing**
Tests design pattern implementations:

```typescript
describe('TaskStrategyFactory', () => {
  it('should create correct strategy for each type', () => {
    expect(TaskStrategyFactory.create('simple'))
      .toBeInstanceOf(SimpleTaskStrategy);
    expect(TaskStrategyFactory.create('complex'))
      .toBeInstanceOf(ComplexTaskStrategy);
  });

  it('should handle null input gracefully', () => {
    const strategy = TaskStrategyFactory.create(null);
    expect(strategy).toBeInstanceOf(SimpleTaskStrategy);
  });
});

describe('ComplexTaskStrategy', () => {
  it('should elevate priority and add prefix', async () => {
    const taskData = {
      title: 'Algorithm optimization',
      priority: 'low',
      type: 'complex'
    };

    const result = await strategy.createTask(taskData);

    expect(result.title).toBe('Complex: Algorithm optimization');
    expect(result.priority).toBe('normal'); // Elevated from 'low'
  });
});
```

#### 4. **Mock Management**
Comprehensive mocking strategies:

```typescript
// Global fetch mocking
global.fetch = vi.fn();

// Selective mocking with different responses
mockFetch
  .mockResolvedValueOnce({ ok: true, json: () => mockData })  // Success
  .mockResolvedValueOnce({ ok: false, status: 404 })         // Error
  .mockRejectedValueOnce(new Error('Network error'));        // Network failure
```

### Testing Features

#### ✅ **Comprehensive Coverage**
- **Unit Tests**: 100+ tests covering all components
- **Integration Tests**: End-to-end workflow validation
- **Error Handling**: Network failures, validation errors
- **Edge Cases**: Null inputs, empty data, concurrent operations

#### ✅ **Advanced Testing Techniques**
- **Async Testing**: Proper handling of promises and async operations
- **State Management**: Testing reactive Vue composables
- **HTTP Mocking**: Simulating API responses and failures
- **Type Safety**: Full TypeScript support in tests

#### ✅ **Test Quality Patterns**
- **Arrange-Act-Assert**: Clear test structure
- **Setup/Teardown**: Proper test isolation with `beforeEach`
- **Descriptive Names**: Self-documenting test descriptions
- **Single Responsibility**: One assertion per test concept

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run coverage

# Run specific test file
npm test TaskService.test.ts

# Run tests with UI
npm run test:ui
```

### Test Coverage Goals
- **Statements**: >95%
- **Branches**: >90%
- **Functions**: >95%
- **Lines**: >95%

## Requirements

- Node.js >= 18
- npm or yarn
- Vue 3
- TypeScript
- Vite

## Development Notes

This project serves as a practical example of implementing design patterns in a modern TypeScript/Vue.js application. The patterns demonstrated here can be extended and adapted for more complex scenarios in real-world applications.

## Future Enhancements

- Add more task strategies (e.g., `PriorityTaskStrategy`, `TimedTaskStrategy`)
- Implement Observer pattern for task state changes
- Add Command pattern for undo/redo functionality
