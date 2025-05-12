# Task Manager Frontend

This is the frontend part of the Task Manager project, built using **Vue 3** and **TypeScript**. It includes the Strategy pattern to manage different rendering strategies for tasks.

## Project Structure

- `src/patterns/strategy/` – Contains the Strategy pattern implementation.
- `src/components/TaskList.vue` – Main UI for listing tasks.
- `src/App.vue` – Root Vue component.

## Scripts

```bash
npm install       # Install dependencies
npm run dev       # Run development server
npm run build     # Build for production
```

## Requirements

- Node.js >= 18
- Vite
- Vue 3

## Design Pattern Used

- **Strategy**: Allows the app to switch between different task rendering strategies dynamically.
