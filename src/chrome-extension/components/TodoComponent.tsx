import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SortOption, TodoItem } from "../types";

interface TodoProps {
  todos: TodoItem[];
  onAddTodo: (title: string) => void;
  onDeleteTodo: (id: number) => void;
  onStartTodo: (id: number) => void;
  onEndTodo: (id: number) => void;
  activeTodoId: number | null;
  liveTimer: number;
  sortBy: SortOption;
  onToggleTodo: (id: number) => void;
  onSortChange: (sort: SortOption) => void; // <- This line was missing
}

export const TodoComponent: React.FC<TodoProps> = ({
  todos,
  onAddTodo,
  onDeleteTodo,
  onStartTodo,
  onEndTodo,
  activeTodoId,
  liveTimer,
  sortBy,
  onToggleTodo
}) => {
  const [newTodo, setNewTodo] = useState<string>("");

  const handleAddTodo = (): void => {
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim());
      setNewTodo("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleAddTodo();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="mb-6">
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo..."
            className="flex-1 px-2 py-1 border bg-zinc-800 border-zinc-500 rounded-md"
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleAddTodo}
            className="px-3 py-2 bg-green-700 text-white rounded-md"
            type="button"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[10rem] bg-zinc-800 overflow-y-auto text-zinc-400">
        {sortedTodos.length === 0 ? (
          <p className="text-zinc-400 text-center py-4">No todos yet</p>
        ) : (
          sortedTodos.map((todo) => {
            const isActive = activeTodoId === todo.id;
            const totalTime = isActive
              ? todo.timeTaken + liveTimer
              : todo.timeTaken;
            return (
              <div
                key={todo.id}
                className="flex items-center gap-2 p-2 rounded-md mb-2 bg-zinc-700"
              >
                <div className="flex-1">
                  {/* Checkmark */}
                  <input
                    type="checkbox"
                    checked={todo.isDone}
                    onChange={() => onToggleTodo(todo.id)}
                    className="w-4 h-4 accent-green-500"
                  />
                  <p className="text-sm text-zinc-200">{todo.title}</p>
                  <p className="text-[0.6rem] text-zinc-400">
                    {new Date(todo.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-green-400">
                    {formatTime(totalTime)} elapsed
                  </p>
                </div>

                {!todo.isDone &&
                  (isActive ? (
                    <button
                      onClick={() => onEndTodo(todo.id)}
                      className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                    >
                      End
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartTodo(todo.id)}
                      className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                    >
                      Start
                    </button>
                  ))}

                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  type="button"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
