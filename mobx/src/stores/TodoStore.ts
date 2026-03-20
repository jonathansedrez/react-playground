import { makeAutoObservable } from "mobx";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type WebSocketMessage =
  | { type: "ADD_TODO"; text: string }
  | { type: "TOGGLE_TODO"; id: number }
  | { type: "REMOVE_TODO"; id: number };

class TodoStore {
  todos: Todo[] = [];
  nextId = 1;
  wsConnected = false;
  private ws: WebSocket | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  connect(url: string) {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.setConnected(true);
      console.log("[TodoStore] WebSocket connected");
    };

    this.ws.onclose = () => {
      this.setConnected(false);
      console.log("[TodoStore] WebSocket disconnected");
    };

    this.ws.onerror = (error) => {
      console.error("[TodoStore] WebSocket error:", error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (e) {
        console.error("[TodoStore] Failed to parse message:", e);
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private setConnected(connected: boolean) {
    this.wsConnected = connected;
  }

  private handleMessage(message: WebSocketMessage) {
    console.log("[TodoStore] Received message:", message);
    switch (message.type) {
      case "ADD_TODO":
        this.addTodo(message.text);
        break;
      case "TOGGLE_TODO":
        this.toggleTodo(message.id);
        break;
      case "REMOVE_TODO":
        this.removeTodo(message.id);
        break;
    }
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
