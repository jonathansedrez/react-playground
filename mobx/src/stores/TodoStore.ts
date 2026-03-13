import { makeAutoObservable } from "mobx";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

class TodoStore {
  todos: Todo[] = [];
  nextId = 1;

  constructor() {
    makeAutoObservable(this);
  }

  addTodo(text: string) {
    if (text.trim()) {
      this.todos.push({
        id: this.nextId++,
        text: text.trim(),
        completed: false,
      });
    }
  }

  toggleTodo(id: number) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  removeTodo(id: number) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  get completedCount() {
    return this.todos.filter((t) => t.completed).length;
  }

  get remainingCount() {
    return this.todos.filter((t) => !t.completed).length;
  }
}

export const todoStore = new TodoStore();
