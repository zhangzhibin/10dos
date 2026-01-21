import { Todo, TodoStorage } from './types';

/**
 * Todo应用主类
 */
class TodoApp {
  private todos: Todo[] = [];
  private todoInput: HTMLInputElement;
  private todoList: HTMLElement;
  private readonly STORAGE_KEY = 'todos';

  constructor() {
    this.todoInput = document.getElementById('todoInput') as HTMLInputElement;
    this.todoList = document.getElementById('todoList') as HTMLElement;
  }

  /**
   * 初始化应用
   */
  async init(): Promise<void> {
    await this.loadTodos();
    this.bindEvents();
    this.render();
  }

  /**
   * 从Chrome存储加载todos
   */
  private async loadTodos(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.get([this.STORAGE_KEY], (result) => {
        const storage = result as TodoStorage;
        this.todos = storage.todos || [];
        resolve();
      });
    });
  }

  /**
   * 保存todos到Chrome存储
   */
  private async saveTodos(): Promise<void> {
    return new Promise((resolve) => {
      const storage: TodoStorage = { todos: this.todos };
      chrome.storage.sync.set(storage, () => {
        resolve();
      });
    });
  }

  /**
   * 绑定事件监听
   */
  private bindEvents(): void {
    // 输入框回车事件
    this.todoInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.handleAddTodo();
      }
    });

    // 任务列表事件委托
    this.todoList.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const todoItem = target.closest('.todo-item') as HTMLElement;
      
      if (!todoItem) return;

      const todoId = todoItem.dataset.id!;

      // 复选框点击
      if (target.classList.contains('todo-checkbox')) {
        this.toggleTodo(todoId);
      }
      
      // 删除按钮点击
      if (target.classList.contains('todo-delete')) {
        this.deleteTodo(todoId);
      }
    });
  }

  /**
   * 添加新任务
   */
  private handleAddTodo(): void {
    const text = this.todoInput.value.trim();
    
    if (!text) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now()
    };

    this.todos.unshift(newTodo); // 新任务添加到顶部
    this.todoInput.value = '';
    
    this.saveTodos();
    this.render();
  }

  /**
   * 切换任务完成状态
   */
  private toggleTodo(id: string): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.render();
    }
  }

  /**
   * 删除任务
   */
  private deleteTodo(id: string): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveTodos();
    this.render();
  }

  /**
   * 渲染任务列表
   */
  private render(): void {
    if (this.todos.length === 0) {
      this.todoList.innerHTML = '';
      return;
    }

    const html = this.todos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${todo.completed ? 'checked' : ''}
        >
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <button class="todo-delete" title="删除">×</button>
      </div>
    `).join('');

    this.todoList.innerHTML = html;
  }

  /**
   * 转义HTML特殊字符
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp().init();
});
