// ===== components/TodoComponent.tsx =====
import React, { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { SortOption, TodoItem } from '../types';


interface TodoProps {
  todos: TodoItem[];
  onAddTodo: (title: string) => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const TodoComponent: React.FC<TodoProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  sortBy,
  //onSortChange
}) => {
  const [newTodo, setNewTodo] = useState<string>('');

  const handleAddTodo = (): void => {
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  // const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
  //   onSortChange(e.target.value as SortOption);
  // };

  // Sort todos
  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="mb-6">
      
      {/* Add Todo Section */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo..."
            className="flex-1 px-2 py-1 border bg-zinc-800 border-zinc-500 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleAddTodo}
            className="px-3 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
            type="button"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Sort Controls 
        <div className="flex gap-2">
          <label className="text-sm text-zinc-400">Sort by:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="text-xs border bg-zinc-800 border-zinc-600 rounded px-2 py-1"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>*/}
      </div>

      {/* Todo List */}
      <div className="max-h-[10rem] bg-zinc-800 overflow-y-auto text-zinc-400">
        {sortedTodos.length === 0 ? (
          <p className="text-zinc-400 text-center py-4">No todos yet</p>
        ) : (
          sortedTodos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center gap-2 p-2 rounded-md mb-2 ${
                todo.isDone ? 'bg-zinc-800 ' : 'bg-zinc-700 '
              }`}
            >
              <button
                onClick={() => onToggleTodo(todo.id)}
                className={`p-1 rounded ${
                  todo.isDone 
                    ? 'bg-green-500 text-white' 
                    : 'bg-zinc-700 border-2 border-zinc-500 text-zinc-600/0 hover:bg-zinc-600'
                }`}
                type="button"
              >
                <Check size={12} />
              </button>
              
              <div className="flex-1">
                <p className={`text-sm ${todo.isDone ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                  {todo.title}
                </p>
                <p className="text-[0.6rem] text-zinc-400">
                  {new Date(todo.date).toLocaleDateString()}
                </p>
              </div>
              
              <button
                onClick={() => onDeleteTodo(todo.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
                type="button"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};