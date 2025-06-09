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
│           └── ComplexTaskStrategy.ts   # Complex task implementation
├── components/
│   └── TaskList.vue                     # Main UI component
└── App.vue                              # Root Vue component
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

### Factory Pattern
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
```

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
