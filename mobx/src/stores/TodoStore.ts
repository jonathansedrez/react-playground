import { makeAutoObservable } from "mobx";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type OutboundMessage =
  | { type: "ADD_TODO"; text: string }
  | { type: "TOGGLE_TODO"; id: number }
  | { type: "REMOVE_TODO"; id: number };

type InboundMessage =
  | { type: "SYNC"; todos: Todo[]; nextId: number }
  | { type: "TODO_ADDED"; todo: Todo }
  | { type: "TODO_TOGGLED"; id: number }
  | { type: "TODO_REMOVED"; id: number };

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
        const message: InboundMessage = JSON.parse(event.data);
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

  private send(message: OutboundMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(message: InboundMessage) {
    console.log("[TodoStore] Received message:", message);
    switch (message.type) {
      case "SYNC":
        this.todos = message.todos;
        this.nextId = message.nextId;
        break;
      case "TODO_ADDED":
        this.todos.push(message.todo);
        this.nextId = Math.max(this.nextId, message.todo.id + 1);
        break;
      case "TODO_TOGGLED":
        this.toggleTodoLocal(message.id);
        break;
      case "TODO_REMOVED":
        this.removeTodoLocal(message.id);
        break;
    }
  }

  private toggleTodoLocal(id: number) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  private removeTodoLocal(id: number) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  addTodo(text: string) {
    if (text.trim()) {
      if (this.wsConnected) {
        this.send({ type: "ADD_TODO", text: text.trim() });
      } else {
        this.todos.push({
          id: this.nextId++,
          text: text.trim(),
          completed: false,
        });
      }
    }
  }

  toggleTodo(id: number) {
    this.toggleTodoLocal(id);
    this.send({ type: "TOGGLE_TODO", id });
  }

  removeTodo(id: number) {
    this.removeTodoLocal(id);
    this.send({ type: "REMOVE_TODO", id });
  }

  get completedCount() {
    return this.todos.filter((t) => t.completed).length;
  }

  get remainingCount() {
    return this.todos.filter((t) => !t.completed).length;
  }
}

export const todoStore = new TodoStore();
