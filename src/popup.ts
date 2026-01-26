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
        <div class="todo-content">
          <span class="todo-text">${this.escapeHtml(todo.text)}</span>
          <span class="todo-timestamp">${this.formatTimestamp(todo.createdAt)}</span>
        </div>
        <button class="todo-delete" title="删除">×</button>
      </div>
    `).join('');

    this.todoList.innerHTML = html;
  }

  /**
   * 格式化时间戳
   */
  private formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const date = new Date(timestamp);

    // 小于1分钟：刚刚
    if (diff < 60000) {
      return '刚刚';
    }

    // 小于1小时：X分钟前
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }

    // 今天：HH:mm
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    // 昨天：昨天 HH:mm
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // 本周：周X HH:mm
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (date > weekAgo) {
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      return `周${weekdays[date.getDay()]} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // 更早：MM-DD HH:mm
    return date.toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
