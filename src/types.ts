/**
 * Todo项数据结构
 */
export interface Todo {
  /** 唯一标识符 */
  id: string;
  /** 任务文本内容 */
  text: string;
  /** 是否已完成 */
  completed: boolean;
  /** 创建时间戳 */
  createdAt: number;
}

/**
 * Chrome存储数据结构
 */
export interface TodoStorage {
  /** Todo列表 */
  todos: Todo[];
}
