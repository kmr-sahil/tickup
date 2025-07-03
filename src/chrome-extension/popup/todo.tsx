import React, { useState } from "react";
import { SortOption } from "../types";
import { useTodos } from "../hooks/useTodos";
import { TodoComponent } from "../components/TodoComponent";
import { TimerComponent } from "../components/TimerComponent";

export const Todo: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const {
    todos,
    addTodo,
    deleteTodo,
    startTodo,
    endTodo,
    activeTodoId,
    liveTimer,
    toggleTodoDone
  } = useTodos();

  return (
    <div className="p-4 bg-zinc-900 text-zinc-300 min-h-screen">
      <h1 className="text-sm font-bold text-gray-200 mb-4">Tickup</h1>

      <TodoComponent
  todos={todos}
  onAddTodo={addTodo}
  onDeleteTodo={deleteTodo}
  onStartTodo={startTodo}
  onEndTodo={endTodo}
  activeTodoId={activeTodoId}
  liveTimer={liveTimer}
  sortBy={sortBy}
  onSortChange={setSortBy}
  onToggleTodo={toggleTodoDone} // ✅ FIX: add this
/>

      <TimerComponent/>
    </div>
  );
};
