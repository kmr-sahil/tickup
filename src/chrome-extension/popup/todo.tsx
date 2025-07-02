import React, { useState } from "react";
import { SortOption } from "../types";
import { useTodos } from "../hooks/useTodos";
import { useTimer } from "../hooks/useTimer";
import { TodoComponent } from "../components/TodoComponent";
import { TimerComponent } from "../components/TimerComponent";

export const Todo: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { dailyTotal } = useTimer();

  return (
    <div className="p-4 bg-zinc-900 text-zinc-300">
      <h1 className="text-sm font-bold text-gray-200 mb-4">Tickup</h1>

      <TodoComponent
        todos={todos}
        onAddTodo={addTodo}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <TimerComponent dailyTotal={dailyTotal} />
    </div>
  );
};