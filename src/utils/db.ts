import { openDB } from 'idb';
import { Task } from '../types';

const DB_NAME = 'taskManagerDB';
const STORE_NAME = 'tasks';

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('date', 'date');
      }
    },
  });
  return db;
};

export const addTask = async (task: Task) => {
  const db = await initDB();
  return db.add(STORE_NAME, task);
};

export const updateTask = async (task: Task) => {
  const db = await initDB();
  return db.put(STORE_NAME, task);
};

export const deleteTask = async (id: string) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

export const getTasksByDate = async (date: string) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const dateIndex = store.index('date');
  return dateIndex.getAll(date);
};

export const getAllTasks = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};