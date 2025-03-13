import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from './components/Calendar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Statistics } from './components/Statistics';
import { Task, DayStats } from './types';
import { addTask, updateTask, deleteTask, getTasksByDate } from './utils/db';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Sun, Moon, Sunset, Menu, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const { theme, setTheme } = useTheme();
  const [stats, setStats] = useState<DayStats>({
    completed: 0,
    inProgress: 0,
    notDone: 0,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  useEffect(() => {
    const completed = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const notDone = tasks.filter((t) => t.status === 'not-done').length;
    setStats({ completed, inProgress, notDone });

    tasks.forEach((task) => {
      if (task.notifications && task.status !== 'done') {
        const [hours, minutes] = task.time.split(':');
        const taskTime = new Date(task.date);
        taskTime.setHours(parseInt(hours), parseInt(minutes));

        if (taskTime > new Date()) {
          const timeUntilTask = taskTime.getTime() - new Date().getTime();
          setTimeout(() => {
            if (Notification.permission === 'granted') {
              new Notification(`Task Reminder: ${task.title}`, {
                body: `Your task "${task.title}" is due now!`,
              });
            } else {
              toast(`Task Reminder: ${task.title}`, {
                duration: 5000,
              });
            }
          }, timeUntilTask);
        }
      }
    });
  }, [tasks]);

  const loadTasks = async () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const loadedTasks = await getTasksByDate(dateStr);
    setTasks(loadedTasks);
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      status: 'not-done',
    };
    await addTask(newTask);
    await loadTasks();
    toast.success('Task added successfully!');
    setIsSidebarOpen(false);
  };

  const handleUpdateTask = async (task: Task) => {
    await updateTask(task);
    await loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    await loadTasks();
    toast.success('Task deleted successfully!');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      }
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="p-2">
            {isSidebarOpen ? (
              <X className="w-6 h-6 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 dark:text-white" />
            )}
          </button>
          <h1 className="text-xl font-bold dark:text-white">Task Manager</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setTheme('light')}
              className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <Sun className="w-5 h-5 dark:text-white" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <Moon className="w-5 h-5 dark:text-white" />
            </button>
            <button
              onClick={() => setTheme('sombre')}
              className={`p-2 rounded ${theme === 'sombre' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <Sunset className="w-5 h-5 dark:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-8 mt-16 md:mt-0">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Task Manager</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setTheme('light')}
              className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <Sun className="w-5 h-5 dark:text-white" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <Moon className="w-5 h-5 dark:text-white" />
            </button>
            <button
              onClick={() => setTheme('sombre')}
              className={`p-2 rounded ${theme === 'sombre' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <Sunset className="w-5 h-5 dark:text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div
            className={`
              fixed md:relative inset-y-0 left-0 z-40
              transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              md:translate-x-0 transition-transform duration-300 ease-in-out
              w-3/4 md:w-auto bg-gray-100 dark:bg-gray-900 md:bg-transparent
              pt-16 md:pt-0 h-full md:h-auto overflow-y-auto
              space-y-8 p-4 md:p-0
            `}
          >
            <Calendar selectedDate={selectedDate} onDateSelect={(date) => {
              setSelectedDate(date);
              setIsSidebarOpen(false);
            }} />
            <Statistics stats={stats} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Add Task for {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <TaskForm onSubmit={handleAddTask} selectedDate={selectedDate} />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold dark:text-white">Tasks</h2>
              <TaskList
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

const AppWrapper = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default AppWrapper;