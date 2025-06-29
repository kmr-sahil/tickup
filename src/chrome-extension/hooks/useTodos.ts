// ===== hooks/useTodos.ts =====
import { useState, useEffect } from 'react';
import { TodoItem } from '../types';
import { storageUtils } from '../utils/storage';

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      const result = await storageUtils.getFromStorage(['todos']);
      if (result.todos && Array.isArray(result.todos)) {
        setTodos(result.todos);
      }
    };
    loadTodos();
  }, []);

  const addTodo = (title: string): void => {
    const todo: TodoItem = {
      id: Date.now(),
      title,
      date: new Date().toISOString(),
      isDone: false
    };
    
    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    storageUtils.saveToStorage('todos', updatedTodos);
  };

  const toggleTodo = (id: number): void => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    );
    setTodos(updatedTodos);
    storageUtils.saveToStorage('todos', updatedTodos);
  };

  const deleteTodo = (id: number): void => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    storageUtils.saveToStorage('todos', updatedTodos);
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
};