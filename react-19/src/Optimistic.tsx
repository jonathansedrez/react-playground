import { useOptimistic, useState, useTransition } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  sending?: boolean;
}

function Optimistic() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isPending, startTransition] = useTransition();
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo],
  );

  const fetchTodos = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=5",
    );
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async (formData: FormData) => {
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    const optimisticTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      userId: 1,
      sending: true,
    };

    startTransition(async () => {
      addOptimisticTodo(optimisticTodo);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify({
            title,
            completed: false,
            userId: 1,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        },
      );

      const newTodo = await response.json();
      setTodos((prev) => [...prev, { ...newTodo, id: optimisticTodo.id }]);
    });
  };

  return (
    <div style={{ marginTop: "2rem", textAlign: "left" }}>
      <h2>useOptimistic Demo</h2>
      <button onClick={fetchTodos}>Load Todos</button>

      <form action={addTodo} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          name="title"
          placeholder="New todo title..."
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Todo"}
        </button>
      </form>

      <ul style={{ marginTop: "1rem" }}>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} style={{ opacity: todo.sending ? 0.5 : 1 }}>
            {todo.title}
            {todo.sending && " (sending...)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Optimistic;
