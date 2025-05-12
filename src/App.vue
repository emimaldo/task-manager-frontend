<template>
    <div class="container">
      <h1>Task Manager</h1>
  
      <select v-model="taskType">
        <option value="simple">Simple</option>
        <option value="complex">Complex</option>
      </select>
  
      <input v-model="taskTitle" placeholder="Enter task title" />
      <button @click="createTask">Create Task</button>
  
      <ul>
        <li v-for="(task, index) in tasks" :key="index">{{ task.title }}</li>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useTaskManager } from './composables/useTaskManager';
  
  const { tasks, taskTitle, taskType, createTask } = useTaskManager();
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
    margin: 2rem auto;
    font-family: sans-serif;
  }
  
  input, select, button {
    display: block;
    margin: 0.5rem 0;
    padding: 0.5rem;
    width: 100%;
  }
  </style>
  