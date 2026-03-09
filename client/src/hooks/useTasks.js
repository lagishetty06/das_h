import { useContext } from 'react';
import TaskContext from '../context/TaskProvider';

// This simple hook is a shortcut to get our global task state.
const useTasks = () => {
  return useContext(TaskContext);
};

export default useTasks;