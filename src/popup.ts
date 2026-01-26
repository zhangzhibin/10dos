import { Todo, TodoStorage } from './types';

/**
 * Todo应用主类
 */
type FilterMode = 'active' | 'completed';

class TodoApp {
  private todos: Todo[] = [];
  private todoInput: HTMLInputElement;
  private todoList: HTMLElement;
  private errorMessage: HTMLElement;
  private filterMode: FilterMode = 'active';
  private readonly STORAGE_KEY = 'todos';
  private readonly MAX_ACTIVE_TODOS = 10; // 最大未完成任务数
  private readonly MAX_COMPLETED_TODOS = 10; // 最大已完成任务数

  constructor() {
    this.todoInput = document.getElementById('todoInput') as HTMLInputElement;
    this.todoList = document.getElementById('todoList') as HTMLElement;
    this.errorMessage = document.getElementById('errorMessage') as HTMLElement;
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

    // 输入框输入时隐藏错误提示
    this.todoInput.addEventListener('input', () => {
      this.hideError();
    });

    // 分组切换按钮
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        const filter = target.dataset.filter as FilterMode;
        if (filter) {
          this.setFilterMode(filter);
        }
      });
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
   * 设置过滤模式
   */
  private setFilterMode(mode: FilterMode): void {
    this.filterMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const filterBtn = btn as HTMLElement;
      if (filterBtn.dataset.filter === mode) {
        filterBtn.classList.add('active');
      } else {
        filterBtn.classList.remove('active');
      }
    });
    
    this.render();
  }

  /**
   * 添加新任务
   */
  private handleAddTodo(): void {
    const text = this.todoInput.value.trim();
    
    if (!text) {
      this.hideError();
      return;
    }

    // 检查未完成任务数量
    const activeTodos = this.todos.filter(t => !t.completed);
    if (activeTodos.length >= this.MAX_ACTIVE_TODOS) {
      this.showError(`已有${this.MAX_ACTIVE_TODOS}个未完成任务，请先完成或删除一些任务后再添加`);
      return;
    }

    this.hideError();

    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now()
    };

    this.todos.push(newTodo); // 新任务添加到底部
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
      
      if (todo.completed) {
        // 标记为完成时，记录完成时间
        todo.completedAt = Date.now();
        // 限制已完成任务数量
        this.limitCompletedTodos();
      } else {
        // 取消完成时，清除完成时间
        delete todo.completedAt;
      }
      
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
   * 显示错误提示
   */
  private showError(message: string): void {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
    // 3秒后自动隐藏
    setTimeout(() => {
      this.hideError();
    }, 3000);
  }

  /**
   * 隐藏错误提示
   */
  private hideError(): void {
    this.errorMessage.style.display = 'none';
    this.errorMessage.textContent = '';
  }

  /**
   * 限制已完成任务数量（最多保留10个，删除最早完成的）
   */
  private limitCompletedTodos(): void {
    const completedTodos = this.todos.filter(t => t.completed && t.completedAt);
    
    if (completedTodos.length > this.MAX_COMPLETED_TODOS) {
      // 按完成时间排序，删除最早完成的
      const sortedCompleted = [...completedTodos].sort((a, b) => 
        (a.completedAt || 0) - (b.completedAt || 0)
      );
      const toDelete = sortedCompleted.slice(0, completedTodos.length - this.MAX_COMPLETED_TODOS);
      const toDeleteIds = new Set(toDelete.map(t => t.id));
      
      this.todos = this.todos.filter(t => !toDeleteIds.has(t.id));
    }
  }

  /**
   * 渲染任务列表
   */
  private render(): void {
    // 根据过滤模式筛选任务
    let filteredTodos = this.todos;
    if (this.filterMode === 'active') {
      filteredTodos = this.todos.filter(t => !t.completed);
    } else if (this.filterMode === 'completed') {
      filteredTodos = this.todos.filter(t => t.completed);
    }

    if (filteredTodos.length === 0) {
      const emptyText = this.filterMode === 'active' ? '暂无未完成任务' : '暂无已完成任务';
      this.todoList.innerHTML = `<div class="empty-state">${emptyText}</div>`;
      return;
    }

    // 按创建时间正序排序（旧任务在前，新任务在后）
    const sortedTodos = [...filteredTodos].sort((a, b) => a.createdAt - b.createdAt);

    // 计算分组内序号（从1开始，仅用于显示数量）
    const html = sortedTodos.map((todo, index) => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${todo.completed ? 'checked' : ''}
        >
        <span class="todo-number">${index + 1}</span>
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
   * 格式化时间戳 - 统一显示距离创建时间多久
   */
  private formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    // 小于1分钟：刚刚
    if (diff < 60000) {
      return '刚刚';
    }

    // 小于1小时：X分钟前
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }

    // 小于24小时：X小时前
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }

    // 小于7天：X天前
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    }

    // 小于30天：X周前
    if (diff < 2592000000) {
      const weeks = Math.floor(diff / 604800000);
      return `${weeks}周前`;
    }

    // 小于365天：X个月前
    if (diff < 31536000000) {
      const months = Math.floor(diff / 2592000000);
      return `${months}个月前`;
    }

    // 大于等于1年：X年前
    const years = Math.floor(diff / 31536000000);
    return `${years}年前`;
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
