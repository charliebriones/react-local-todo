import { useState } from "react";
import "./App.css";

const PORTAL_URL = "https://charliebriones.github.io/"; // change if needed

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      name: "Run a marathon",
      done: false,
    },
  ]);
  const [todoText, setTodoText] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const remainingTodo = todos.filter((t) => !t.done).length;
  const completedTodo = todos.filter((t) => t.done).length;

  const filteredTodos =
    filter === "Completed"
      ? todos.filter((t) => t.done)
      : filter === "Remaining"
        ? todos.filter((t) => !t.done)
        : todos;

  function handleUpsert() {
    const todoUpsert = todoText.trim();
    if (!todoUpsert) return;

    if (editingId === null) {
      const newTodo: Todo = {
        id: Date.now(),
        name: todoUpsert,
        done: false,
      };
      setTodos((prev) => [...prev, newTodo]);
    } else {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, name: todoUpsert } : t)),
      );
    }

    setTodoText("");
    setEditingId(null);
  }

  function handleToggle(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function handleEdit(id: number) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setTodoText(todo.name);
      setEditingId(id);
    }
  }

  function handleDelete(id: number) {
    const conf = confirm("Are you sure you want to delete this?");
    if (conf) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
    setTodoText("");
    setEditingId(null);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h1 className="text-3xl font-bold text-cyan-600 sm:text-4xl">
            React
          </h1>
          <h2 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            TODO App
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-600">
            React + Tailwind CSS (Local State CRUD)
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noreferrer"
              className="mx-auto  rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Portal
            </a>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border bg-white">
          {/* Top Section */}
          <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-700">
                Filter
              </label>
              <select
                className="rounded-md border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-1 focus:ring-slate-300"
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
              >
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Remaining">Remaining</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-slate-700">
              <span className="rounded-md bg-slate-50 px-3 py-2">
                Remaining: <b>{remainingTodo}</b>
              </span>
              <span className="rounded-md bg-slate-50 px-3 py-2">
                Completed: <b>{completedTodo}</b>
              </span>
              <span className="rounded-md bg-slate-50 px-3 py-2">
                Total: <b>{todos.length}</b>
              </span>
            </div>
          </div>

          {/* Todo List */}
          <div className="px-4 py-4 sm:px-6">
            {filteredTodos.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-slate-500">
                No todos found.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTodos.map((t) => (
                  <TodoComponent
                    key={t.id}
                    todo={t}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="border-t px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
                placeholder="Type a todo..."
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpsert();
                  if (e.key === "Escape") {
                    setTodoText("");
                    setEditingId(null);
                  }
                }}
              />

              <button
                onClick={handleUpsert}
                disabled={!todoText.trim()}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 sm:w-auto"
              >
                {editingId === null ? "ADD TODO" : "UPDATE TODO"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

function TodoComponent({ todo, onToggle, onEdit, onDelete }: TodoParams) {
  return (
    <div className="flex flex-col gap-3 rounded-md border bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span
          className={
            todo.done
              ? "text-sm text-slate-500 line-through"
              : "text-sm text-slate-900"
          }
        >
          {todo.name}
        </span>
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(todo.id)}
          className="rounded-md border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

type TodoParams = {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

type Todo = {
  id: number;
  name: string;
  done: boolean;
};

type Filter = "All" | "Completed" | "Remaining";
