<template>
  <div class="container">
    <h1>🚀 Task Manager</h1>
    <p class="subtitle">Demonstrating Design Patterns in Action</p>

    <!-- Error display -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading">
      ⏳ Loading...
    </div>

    <!-- Task creation form -->
    <div class="task-form">
      <h3>Create New Task</h3>
      
      <div class="form-group">
        <label for="taskType">Task Type:</label>
        <select id="taskType" v-model="taskType" :disabled="loading">
          <option value="personal">👤 Personal</option>
          <option value="work">💼 Work</option>
          <option value="simple">📝 Simple Task</option>
          <option value="complex">⚙️ Complex Task</option>
          <option value="hobby">🎨 Hobby</option>
        </select>
      </div>

      <div class="form-group">
        <label for="taskTitle">Task Title:</label>
        <input 
          id="taskTitle"
          v-model="taskTitle" 
          placeholder="Enter task title" 
          :disabled="loading"
          @keyup.enter="createTask"
        />
      </div>

      <div class="form-group">
        <label for="taskDescription">Description:</label>
        <textarea 
          id="taskDescription"
          v-model="taskDescription" 
          placeholder="Enter task description (optional)" 
          :disabled="loading"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="taskPriority">Priority:</label>
        <select id="taskPriority" v-model="taskPriority" :disabled="loading">
          <option value="low">🟢 Low</option>
          <option value="normal">🟡 Normal</option>
          <option value="high">🟠 High</option>
          <option value="urgent">🔴 Urgent</option>
        </select>
      </div>

      <button 
        @click="createTask" 
        :disabled="loading || !taskTitle.trim()"
        class="btn btn-primary"
      >
        ➕ Create Task
      </button>
    </div>

    <!-- Tasks list -->
    <div class="tasks-section">
      <div class="tasks-header">
        <h3>Tasks ({{ tasks.length }})</h3>
        <button @click="loadTasks" class="btn btn-secondary" :disabled="loading">
          🔄 Refresh
        </button>
      </div>

      <div v-if="tasks.length === 0 && !loading" class="empty-state">
        📭 No tasks yet. Create your first task above!
      </div>

      <div v-else class="tasks-list">
        <div 
          v-for="task in tasks" 
          :key="task.id" 
          class="task-item"
          :class="{ 'task-completed': task.completed }"
        >
          <div class="task-content">
            <div class="task-header">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-type" :class="`type-${task.type}`">
                {{ task.type === 'simple' ? '📝' : '⚙️' }} {{ task.type }}
              </span>
            </div>
            
            <div class="task-meta">
              <span class="task-id">ID: {{ task.id }}</span>
              <span class="task-date">Created: {{ formatDate(task.createdAt) }}</span>
            </div>
          </div>

          <div class="task-actions">
            <button 
              @click="editTask(task)" 
              class="btn btn-small btn-edit"
              :disabled="loading"
            >
              ✏️ Edit
            </button>
            <button 
              @click="deleteTask(task.id)" 
              class="btn btn-small btn-danger"
              :disabled="loading"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <div v-if="editingTask" class="modal-overlay" @click="cancelEdit">
      <div class="modal" @click.stop>
        <h3>Edit Task</h3>
        <input 
          v-model="editingTitle" 
          placeholder="Task title"
          @keyup.enter="saveEdit"
        />
        <div class="modal-actions">
          <button @click="saveEdit" class="btn btn-primary">💾 Save</button>
          <button @click="cancelEdit" class="btn btn-secondary">❌ Cancel</button>
        </div>
      </div>
    </div>

    <!-- Design patterns info -->
    <div class="patterns-info">
      <h3>🎨 Design Patterns Used</h3>
      <div class="patterns-grid">
        <div class="pattern-card">
          <h4>🏭 Factory Method</h4>
          <p>Creates different types of tasks (Simple/Complex)</p>
        </div>
        <div class="pattern-card">
          <h4>👁️ Observer</h4>
          <p>Notifies when tasks are created or modified</p>
        </div>
        <div class="pattern-card">
          <h4>🗄️ Repository</h4>
          <p>Abstracts data access and storage operations</p>
        </div>
        <div class="pattern-card">
          <h4>🔄 Command</h4>
          <p>Encapsulates operations with undo/redo support</p>
        </div>
        <div class="pattern-card">
          <h4>🎯 Strategy</h4>
          <p>Different algorithms for task processing</p>
        </div>
        <div class="pattern-card">
          <h4>🏗️ Decorator</h4>
          <p>Adds features like priority and deadlines</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useTaskManager } from './composables/useTaskManager';

const { 
  tasks, 
  taskTitle, 
  taskDescription,
  taskType, 
  taskPriority,
  loading, 
  error, 
  loadTasks, 
  createTask, 
  deleteTask, 
  updateTask 
} = useTaskManager();

// Edit functionality
const editingTask = ref<any>(null);
const editingTitle = ref('');

const editTask = (task: any) => {
  editingTask.value = task;
  editingTitle.value = task.title;
};

const saveEdit = async () => {
  if (editingTask.value && editingTitle.value.trim()) {
    await updateTask(editingTask.value.id, editingTitle.value.trim());
    cancelEdit();
  }
};

const cancelEdit = () => {
  editingTask.value = null;
  editingTitle.value = '';
};

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Load tasks when component mounts
onMounted(() => {
  loadTasks();
});
</script>
  
  <style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-style: italic;
}

/* Error and loading states */
.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
}

.loading {
  text-align: center;
  color: #3498db;
  padding: 1rem;
  font-weight: bold;
}

/* Task form */
.task-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.task-form h3 {
  margin-top: 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #3498db;
}

input:disabled, select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
}

.btn-edit {
  background: #f39c12;
  color: white;
}

.btn-edit:hover:not(:disabled) {
  background: #e67e22;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Tasks section */
.tasks-section {
  margin-bottom: 2rem;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tasks-header h3 {
  margin: 0;
  color: #2c3e50;
}

.empty-state {
  text-align: center;
  color: #7f8c8d;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 12px;
  font-size: 1.1rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 1px solid #e1e8ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.task-content {
  flex: 1;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.task-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.task-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.type-simple {
  background: #e8f5e8;
  color: #27ae60;
}

.type-complex {
  background: #fef3e2;
  color: #f39c12;
}

.task-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.task-completed {
  opacity: 0.6;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal input {
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Patterns info */
.patterns-info {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  margin-top: 2rem;
}

.patterns-info h3 {
  margin-top: 0;
  color: #2c3e50;
  text-align: center;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.pattern-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  text-align: center;
}

.pattern-card h4 {
  margin-top: 0;
  color: #3498db;
  font-size: 1.1rem;
}

.pattern-card p {
  margin-bottom: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    margin: 1rem;
    padding: 0.5rem;
  }
  
  .task-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .task-actions {
    align-self: flex-end;
  }
  
  .patterns-grid {
    grid-template-columns: 1fr;
  }
  
  .tasks-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
  