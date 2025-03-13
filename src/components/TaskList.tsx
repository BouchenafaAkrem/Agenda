import React from 'react';
import { Task } from '../types';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card p-8 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400">No tasks for this day</p>
          </motion.div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={clsx(
                'card p-4 space-y-2 overflow-hidden',
                'border-l-4',
                {
                  'border-l-green-500': task.status === 'done',
                  'border-l-yellow-500': task.status === 'in-progress',
                  'border-l-red-500': task.status === 'not-done',
                }
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium break-words flex-1 mr-4">{task.title}</h3>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`text-sm ${getPriorityColor(task.priority)} hidden md:inline`}>
                    {task.priority}
                  </span>
                  <motion.button 
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 touch-manipulation hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </motion.button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 break-words">{task.description}</p>
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">{task.time}</span>
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => onUpdateTask({ ...task, status: 'not-done' })}
                    className={clsx(
                      'p-2 rounded touch-manipulation',
                      task.status === 'not-done' && 'bg-gray-100 dark:bg-gray-700'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle className="w-6 h-6 md:w-5 md:h-5 text-red-500" />
                  </motion.button>
                  <motion.button
                    onClick={() => onUpdateTask({ ...task, status: 'in-progress' })}
                    className={clsx(
                      'p-2 rounded touch-manipulation',
                      task.status === 'in-progress' && 'bg-gray-100 dark:bg-gray-700'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Clock className="w-6 h-6 md:w-5 md:h-5 text-yellow-500" />
                  </motion.button>
                  <motion.button
                    onClick={() => onUpdateTask({ ...task, status: 'done' })}
                    className={clsx(
                      'p-2 rounded touch-manipulation',
                      task.status === 'done' && 'bg-gray-100 dark:bg-gray-700'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CheckCircle className="w-6 h-6 md:w-5 md:h-5 text-green-500" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};