// ===== utils/storage.ts =====

import { StorageData } from "../types";


export const storageUtils = {
  saveToStorage: async (key: string, value: any): Promise<void> => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ [key]: value });
      } else {
        // Fallback for development/testing - using in-memory storage
        (window as any).__storage = (window as any).__storage || {};
        (window as any).__storage[key] = value;
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  getFromStorage: async (keys: string[]): Promise<StorageData> => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        return await chrome.storage.local.get(keys);
      } else {
        // Fallback for development/testing - using in-memory storage
        const storage = (window as any).__storage || {};
        const result: StorageData = {};
        keys.forEach(key => {
          if (storage[key] !== undefined) {
            result[key] = storage[key];
          }
        });
        return result;
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      return {};
    }
  },

  getTodayKey: (): string => {
    return new Date().toISOString().split('T')[0];
  }
};