// ===== background.js =====

let timerInterval = null;
let activeTodoId = null;
let startTimestamp = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_TODO') {
    activeTodoId = message.todoId;
    startTimestamp = Date.now();

    chrome.storage.local.set({ activeTodoId, startTimestamp });

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  if (message.type === 'END_TODO') {
    endActiveTodo();
  }

  if (message.type === 'GET_ACTIVE_TODO') {
    sendResponse({ activeTodoId, startTimestamp });
  }
});

function updateTimer() {
  // Nothing to do here except keeping the interval alive
  // Real calculation done on END_TODO
}

async function endActiveTodo() {
  if (!activeTodoId || !startTimestamp) return;

  const elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
  const { todos = [] } = await chrome.storage.local.get(['todos']);

  const updatedTodos = todos.map(todo => {
    if (todo.id === activeTodoId) {
      return {
        ...todo,
        timeTaken: (todo.timeTaken || 0) + elapsedSeconds,
        isDone: true // Auto-mark as done
      };
    }
    return todo;
  });

  chrome.storage.local.set({ todos: updatedTodos });

  activeTodoId = null;
  startTimestamp = null;
  chrome.storage.local.remove(['activeTodoId', 'startTimestamp']);

  if (timerInterval) clearInterval(timerInterval);
}

