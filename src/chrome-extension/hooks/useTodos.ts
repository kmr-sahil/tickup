import { useState, useEffect } from 'react';
import { TodoItem } from '../types';
import { storageUtils } from '../utils/storage';

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [liveTimer, setLiveTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Load todos on mount
  useEffect(() => {
    const loadTodos = async () => {
      const result = await storageUtils.getFromStorage(['todos']);
      if (result.todos && Array.isArray(result.todos)) {
        setTodos(result.todos);
      }
    };
    loadTodos();
  }, []);

  // Check background state on popup open
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_ACTIVE_TODO' }, (res) => {
      if (res?.activeTodoId && res?.startTimestamp) {
        const elapsed = Math.floor((Date.now() - res.startTimestamp) / 1000);
        setActiveTodoId(res.activeTodoId);
        setLiveTimer(elapsed);
      }
    });
  }, []);

  // Timer interval when a todo is active
  useEffect(() => {
    if (activeTodoId !== null) {
      const interval = setInterval(() => {
        setLiveTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(interval);
    } else {
      if (intervalId) clearInterval(intervalId);
      setLiveTimer(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTodoId]);

  const toggleTodoDone = (id: number): void => {
  const updatedTodos = todos.map(todo =>
    todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
  );
  setTodos(updatedTodos);
  storageUtils.saveToStorage('todos', updatedTodos);
};

  // Add todo
  const addTodo = (title: string): void => {
    const todo: TodoItem = {
      id: Date.now(),
      title,
      date: new Date().toISOString(),
      timeTaken: 0,
    };
    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    storageUtils.saveToStorage('todos', updatedTodos);
  };

  // Delete todo
  const deleteTodo = (id: number): void => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    storageUtils.saveToStorage('todos', updatedTodos);
  };

  // Start todo
  const startTodo = (id: number): void => {
    setActiveTodoId(id);
    setLiveTimer(0);
    chrome.runtime.sendMessage({ type: 'START_TODO', todoId: id });
  };

  // End todo
  const endTodo = (id: number): void => {
    chrome.runtime.sendMessage({ type: 'END_TODO' });

    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, timeTaken: (todo.timeTaken || 0) + liveTimer }
        : todo
    );
    setTodos(updatedTodos);
    storageUtils.saveToStorage('todos', updatedTodos);

    setActiveTodoId(null);
    setLiveTimer(0);
  };

  return {
  todos,
  addTodo,
  deleteTodo,
  startTodo,
  endTodo,
  toggleTodoDone,
  activeTodoId,
  liveTimer,
};

};
