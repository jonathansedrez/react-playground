import { useState } from "react";
import { observer } from "mobx-react-lite";
import { todoStore } from "./stores/TodoStore";
import "./App.css";

const App = observer(() => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    todoStore.addTodo(inputValue);
    setInputValue("");
  };

  return (
    <div className="todo-app">
      <h1>MobX Todo List</h1>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      <ul className="todo-list">
        {todoStore.todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => todoStore.toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
            <button onClick={() => todoStore.removeTodo(todo.id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todoStore.todos.length > 0 && (
        <div className="todo-stats">
          <span>Completed: {todoStore.completedCount}</span>
          <span>Remaining: {todoStore.remainingCount}</span>
        </div>
      )}
    </div>
  );
});

export default App;
