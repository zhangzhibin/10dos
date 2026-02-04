/** Mock task groups for testing. "#mock 0" = load real data; "#mock 1".."#mock 4" = load mock group 1..4. */
const MOCK_GROUPS = [
    // Group 1: Urgency mix (green / yellow / red)
    [
        { text: 'Set up Chrome extension manifest and project structure', hoursAgo: 2 },
        { text: 'Implement TypeScript build and popup entry', hoursAgo: 12 },
        { text: 'Add todo CRUD with chrome.storage.sync', hoursAgo: 20 },
        { text: 'Design popup UI and basic styles', hoursAgo: 23 },
        { text: 'Add Active/Completed filter tabs', hoursAgo: 30 },
        { text: 'Implement urgency colors (24h/72h rules)', hoursAgo: 48 },
        { text: 'Add timestamp display and relative time formatting', hoursAgo: 60 },
        { text: 'Enforce 10 active and 10 completed limits', hoursAgo: 96 },
        { text: 'Localize UI to English and fix list height for Chrome', hoursAgo: 120 },
        { text: 'Add mock data loader for testing', hoursAgo: 168 },
    ],
    // Group 2: All recent (all green)
    [
        { text: 'Review popup layout and spacing', hoursAgo: 1 },
        { text: 'Tweak checkbox and delete button styles', hoursAgo: 4 },
        { text: 'Test storage sync across devices', hoursAgo: 8 },
        { text: 'Verify filter switch behavior', hoursAgo: 12 },
        { text: 'Check timestamp formatting edge cases', hoursAgo: 16 },
        { text: 'Confirm 10-slot list height on Chrome 144', hoursAgo: 20 },
        { text: 'Document mock load in README', hoursAgo: 22 },
        { text: 'Add #mock N input handler', hoursAgo: 23 },
        { text: 'Final regression pass', hoursAgo: 23 },
        { text: 'Prepare release build', hoursAgo: 23 },
    ],
    // Group 3: 5 active + 5 completed
    [
        { text: 'Open extension popup', hoursAgo: 1 },
        { text: 'Type #mock 3 and press Enter', hoursAgo: 1 },
        { text: 'Switch to Completed tab', hoursAgo: 2 },
        { text: 'Verify completed items show Created/Done times', hoursAgo: 2 },
        { text: 'Uncomplete one item and check it moves to Active', hoursAgo: 3 },
        { text: 'Set up Chrome extension manifest and project structure', hoursAgo: 48, completed: true },
        { text: 'Implement TypeScript build and popup entry', hoursAgo: 72, completed: true },
        { text: 'Add todo CRUD with chrome.storage.sync', hoursAgo: 96, completed: true },
        { text: 'Design popup UI and basic styles', hoursAgo: 120, completed: true },
        { text: 'Add Active/Completed filter tabs', hoursAgo: 144, completed: true },
    ],
    // Group 4: All old (all red)
    [
        { text: 'Legacy: Migrate from Manifest V2', hoursAgo: 168 },
        { text: 'Legacy: Remove jQuery dependency', hoursAgo: 192 },
        { text: 'Legacy: Refactor to TypeScript', hoursAgo: 216 },
        { text: 'Legacy: Replace localStorage with chrome.storage', hoursAgo: 240 },
        { text: 'Legacy: Add options page', hoursAgo: 264 },
        { text: 'Legacy: Implement keyboard shortcuts', hoursAgo: 288 },
        { text: 'Legacy: Add export to JSON', hoursAgo: 312 },
        { text: 'Legacy: Support dark theme', hoursAgo: 336 },
        { text: 'Legacy: i18n for multiple languages', hoursAgo: 360 },
        { text: 'Legacy: Performance audit', hoursAgo: 384 },
    ],
];
class TodoApp {
    constructor() {
        this.todos = [];
        this.filterMode = 'active';
        this.STORAGE_KEY = 'todos';
        this.MAX_ACTIVE_TODOS = 10; // 最大未完成任务数
        this.MAX_COMPLETED_TODOS = 10; // 最大已完成任务数
        this.LIST_SLOTS = 10; // 列表始终显示的位置数
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.errorMessage = document.getElementById('errorMessage');
    }
    /**
     * 初始化应用
     */
    async init() {
        await this.loadTodos();
        this.bindEvents();
        this.render();
    }
    /**
     * 从Chrome存储加载todos
     */
    async loadTodos() {
        return new Promise((resolve) => {
            chrome.storage.sync.get([this.STORAGE_KEY], async (result) => {
                const storage = result;
                this.todos = storage.todos || [];
                let needSave = false;
                // 兼容旧数据：为已完成但没有completedAt的任务添加completedAt（使用createdAt）
                this.todos.forEach(todo => {
                    if (todo.completed && !todo.completedAt) {
                        todo.completedAt = todo.createdAt;
                        needSave = true;
                    }
                });
                // 加载后检查并限制已完成任务数量
                const beforeCount = this.todos.length;
                this.limitCompletedTodos();
                const afterCount = this.todos.length;
                // 如果删除了任务或修改了数据，需要保存
                if (needSave || beforeCount !== afterCount) {
                    await this.saveTodos();
                }
                resolve();
            });
        });
    }
    /**
     * 保存todos到Chrome存储
     */
    async saveTodos() {
        return new Promise((resolve) => {
            const storage = { todos: this.todos };
            chrome.storage.sync.set(storage, () => {
                resolve();
            });
        });
    }
    /**
     * 绑定事件监听
     */
    bindEvents() {
        // 输入框回车事件
        this.todoInput.addEventListener('keypress', (e) => {
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
            btn.addEventListener('click', (e) => {
                const target = e.target;
                const filter = target.dataset.filter;
                if (filter) {
                    this.setFilterMode(filter);
                }
            });
        });
        // 任务列表事件委托
        this.todoList.addEventListener('click', (e) => {
            const target = e.target;
            const todoItem = target.closest('.todo-item');
            if (!todoItem)
                return;
            const todoId = todoItem.dataset.id;
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
    setFilterMode(mode) {
        this.filterMode = mode;
        // 更新按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const filterBtn = btn;
            if (filterBtn.dataset.filter === mode) {
                filterBtn.classList.add('active');
            }
            else {
                filterBtn.classList.remove('active');
            }
        });
        this.render();
    }
    /**
     * 添加新任务（或解析 #mock N 加载 mock/实际数据）
     * #mock 0 = 加载实际存储数据，#mock 1..4 = 加载对应 mock 组
     */
    async handleAddTodo() {
        const text = this.todoInput.value.trim();
        if (!text) {
            this.hideError();
            return;
        }
        // #mock N → #mock 0 加载实际数据，#mock 1..4 加载第 N 组 mock
        const mockMatch = text.match(/^#mock\s*(\d+)$/i);
        if (mockMatch) {
            const groupIndex = parseInt(mockMatch[1], 10);
            if (groupIndex === 0) {
                await this.loadTodos();
                this.todoInput.value = '';
                this.hideError();
                this.showError('Loaded real data.');
                setTimeout(() => this.hideError(), 1500);
                this.render();
                return;
            }
            if (groupIndex >= 1 && groupIndex <= MOCK_GROUPS.length) {
                this.loadMockGroup(groupIndex - 1);
                this.todoInput.value = '';
                this.hideError();
                return;
            }
            this.showError(`Use #mock 0 for real data, #mock 1–${MOCK_GROUPS.length} for mock groups.`);
            return;
        }
        // 检查未完成任务数量
        const activeTodos = this.todos.filter(t => !t.completed);
        if (activeTodos.length >= this.MAX_ACTIVE_TODOS) {
            this.showError(`You already have ${this.MAX_ACTIVE_TODOS} active tasks. Complete or delete some before adding more.`);
            return;
        }
        this.hideError();
        const newTodo = {
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
     * Load mock task group by index (0-based).
     */
    loadMockGroup(groupIndex) {
        const defs = MOCK_GROUPS[groupIndex];
        const now = Date.now();
        this.todos = defs.map((d, i) => {
            const createdAt = now - d.hoursAgo * 60 * 60 * 1000;
            const completed = !!d.completed;
            return {
                id: `mock-${now}-${groupIndex}-${i}`,
                text: d.text,
                completed,
                createdAt,
                ...(completed ? { completedAt: createdAt } : {}),
            };
        });
        this.saveTodos();
        this.render();
    }
    /**
     * 切换任务完成状态
     */
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            if (todo.completed) {
                // 标记为完成时，记录完成时间
                todo.completedAt = Date.now();
                // 限制已完成任务数量
                this.limitCompletedTodos();
            }
            else {
                // 取消完成时，当做新任务：更新创建时间为当前时间，清除完成时间
                todo.createdAt = Date.now();
                delete todo.completedAt;
            }
            this.saveTodos();
            this.render();
        }
    }
    /**
     * 删除任务
     */
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    /**
     * 显示错误提示
     */
    showError(message) {
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
    hideError() {
        this.errorMessage.style.display = 'none';
        this.errorMessage.textContent = '';
    }
    /**
     * 限制已完成任务数量（最多保留10个，删除最早完成的）
     */
    limitCompletedTodos() {
        const completedTodos = this.todos.filter(t => t.completed);
        if (completedTodos.length > this.MAX_COMPLETED_TODOS) {
            // 按完成时间排序（如果没有completedAt，使用createdAt作为完成时间）
            const sortedCompleted = [...completedTodos].sort((a, b) => {
                const aTime = a.completedAt || a.createdAt;
                const bTime = b.completedAt || b.createdAt;
                return aTime - bTime;
            });
            // 删除最早完成的（保留最新的10个）
            const toDelete = sortedCompleted.slice(0, completedTodos.length - this.MAX_COMPLETED_TODOS);
            const toDeleteIds = new Set(toDelete.map(t => t.id));
            this.todos = this.todos.filter(t => !toDeleteIds.has(t.id));
        }
    }
    /**
     * 渲染任务列表
     */
    render() {
        // 根据过滤模式筛选任务
        let filteredTodos = this.todos;
        if (this.filterMode === 'active') {
            filteredTodos = this.todos.filter(t => !t.completed);
        }
        else if (this.filterMode === 'completed') {
            filteredTodos = this.todos.filter(t => t.completed);
        }
        // 按创建时间正序排序（旧任务在前，新任务在后）
        const sortedTodos = [...filteredTodos].sort((a, b) => a.createdAt - b.createdAt);
        // 计算分组内序号（从1开始，仅用于显示数量）
        const tasksHtml = sortedTodos.map((todo, index) => {
            // 已完成任务显示创建时间和完成时间
            let timestampHtml = '';
            if (todo.completed && todo.completedAt) {
                timestampHtml = `
          <span class="todo-timestamp">
            <span class="timestamp-label">Created: </span>${this.formatTimestamp(todo.createdAt)}
            <span class="timestamp-separator"> | </span>
            <span class="timestamp-label">Done: </span>${this.formatTimestamp(todo.completedAt)}
          </span>
        `;
            }
            else {
                timestampHtml = `<span class="todo-timestamp">${this.formatTimestamp(todo.createdAt)}</span>`;
            }
            // 计算未完成任务的紧急程度
            let urgencyClass = '';
            if (!todo.completed) {
                const urgency = this.getUrgencyLevel(todo.createdAt);
                urgencyClass = `urgency-${urgency}`;
            }
            return `
      <div class="todo-item ${todo.completed ? 'completed' : ''} ${urgencyClass}" data-id="${todo.id}">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${todo.completed ? 'checked' : ''}
        >
        <span class="todo-number">${index + 1}</span>
        <div class="todo-content">
          <span class="todo-text">${this.escapeHtml(todo.text)}</span>
          ${timestampHtml}
        </div>
        <button class="todo-delete" title="Delete">×</button>
      </div>
    `;
        }).join('');
        // 补足空位，使列表始终显示 LIST_SLOTS 个位置；空位也显示序号，仅内容为空
        const emptySlotsCount = Math.max(0, this.LIST_SLOTS - sortedTodos.length);
        const emptySlotsHtml = Array.from({ length: emptySlotsCount }, (_, i) => `<div class="todo-item todo-item-empty" aria-hidden="true"><input type="checkbox" class="todo-checkbox todo-checkbox-empty" disabled><span class="todo-number">${sortedTodos.length + i + 1}</span><div class="todo-content"></div></div>`).join('');
        this.todoList.innerHTML = tasksHtml + emptySlotsHtml;
    }
    /**
     * 格式化时间戳 - 统一显示距离创建时间多久
     */
    formatTimestamp(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        if (diff < 60000) {
            return 'Just now';
        }
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} min ago`;
        }
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} hr ago`;
        }
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days} day${days === 1 ? '' : 's'} ago`;
        }
        if (diff < 2592000000) {
            const weeks = Math.floor(diff / 604800000);
            return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
        }
        if (diff < 31536000000) {
            const months = Math.floor(diff / 2592000000);
            return `${months} month${months === 1 ? '' : 's'} ago`;
        }
        const years = Math.floor(diff / 31536000000);
        return `${years} year${years === 1 ? '' : 's'} ago`;
    }
    /**
     * 获取任务紧急程度
     * @param createdAt 创建时间戳
     * @returns 'low' | 'medium' | 'high' - 对应绿色、黄色、红色
     */
    getUrgencyLevel(createdAt) {
        const now = Date.now();
        const diff = now - createdAt;
        const MS_24H = 24 * 60 * 60 * 1000;
        const MS_72H = 72 * 60 * 60 * 1000;
        if (diff < MS_24H) {
            return 'low'; // green: within 24h
        }
        else if (diff < MS_72H) {
            return 'medium'; // yellow: 24h–72h
        }
        else {
            return 'high'; // red: after 72h
        }
    }
    /**
     * 转义HTML特殊字符
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp().init();
});
export {};
