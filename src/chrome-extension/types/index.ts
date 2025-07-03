// ===== types/index.ts =====
export interface TodoItem {
  id: number;
  title: string;
  date: string;
  timeTaken: number;
  isDone?: boolean; // New: for checkbox
}



export interface StorageData {
  todos?: TodoItem[];
  currentTime?: number;
  isRunning?: boolean;
  [key: string]: any;
}

export type SortOption = 'date' | 'title'