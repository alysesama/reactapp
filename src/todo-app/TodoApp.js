import { useEffect, useMemo, useState } from 'react';
import { LoremIpsum } from 'lorem-ipsum';
import TodoHeader from './TodoHeader';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import './TodoApp.css';

const STORAGE_KEY = 'todo_tasks';

const fallbackTasks = () => {
  const now = Math.floor(Date.now() / 1000);
  return [
    {
      task_complete: false,
      task_name: 'Thiết kế UI màn Dashboard',
      task_describle: 'Hoàn thiện các wireframe chính và thống nhất dữ liệu biểu đồ với team backend.',
      task_prior: 2,
      task_create_time: now - 7200,
      task_deadline_time: now + 7200,
    },
    {
      task_complete: true,
      task_name: 'Chuẩn bị workshop React',
      task_describle: 'Tổng hợp slides về hooks, state management và demo code cho buổi chia sẻ nội bộ.',
      task_prior: 1,
      task_create_time: now - 17200,
      task_deadline_time: now + 12000,
    },
    {
      task_complete: false,
      task_name: 'Review code pull request #108',
      task_describle: 'Tập trung kiểm tra phần auth guard, performance và các edge cases liên quan.',
      task_prior: 0,
      task_create_time: now - 36000,
      task_deadline_time: now + 14400,
    },
  ];
};

const loadStoredTasks = () => {
  if (typeof window === 'undefined') return fallbackTasks();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Không thể đọc dữ liệu todo_tasks từ localStorage:', error);
  }
  return fallbackTasks();
};

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const capitalize = text => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);
const clampPriority = value => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 1;
  return Math.min(2, Math.max(0, numeric));
};

function TodoApp() {
  const lorem = useMemo(
    () =>
      new LoremIpsum({
        sentencesPerParagraph: {
          max: 4,
          min: 2,
        },
        wordsPerSentence: {
          max: 8,
          min: 4,
        },
      }),
    []
  );

  const [tasks, setTasks] = useState(loadStoredTasks);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === 'active') return !task.task_complete;
        if (filter === 'completed') return task.task_complete;
        if (filter === 'high') return task.task_prior === 2;
        return true;
      })
      .filter(task => {
        const keyword = searchTerm.toLowerCase();
        const name = task.task_name?.toLowerCase() ?? '';
        const description = task.task_describle?.toLowerCase() ?? '';
        return name.includes(keyword) || description.includes(keyword);
      });
  }, [tasks, filter, searchTerm]);

  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.task_complete).length;
    return {
      total: tasks.length,
      completed,
      upcoming: tasks.length - completed,
    };
  }, [tasks]);

  const handleAddTask = data => {
    setTasks(prev => {
      const existingTimes = new Set(prev.map(task => task.task_create_time));
      let timestamp = data.task_create_time ?? Math.floor(Date.now() / 1000);
      while (existingTimes.has(timestamp)) {
        timestamp += 1;
      }

      const deadline =
        typeof data.task_deadline_time === 'number'
          ? data.task_deadline_time
          : timestamp + 86400;

      const normalizedTask = {
        task_complete: data.task_complete ?? false,
        task_name: data.task_name?.trim() || 'Công việc mới',
        task_describle: data.task_describle?.trim() || '',
        task_prior: clampPriority(data.task_prior),
        task_create_time: timestamp,
        task_deadline_time: deadline,
      };

      return [normalizedTask, ...prev];
    });
  };

  const handleGenerateRandomTask = () => {
    const now = Math.floor(Date.now() / 1000);
    const deadlineOffset = randomBetween(7200, 14400);
    const randomDescription = `${capitalize(
      lorem.generateWords(randomBetween(12, 16))
    )}.`;

    handleAddTask({
      task_name: capitalize(lorem.generateWords(randomBetween(3, 5))),
      task_describle: randomDescription,
      task_prior: randomBetween(0, 2),
      task_deadline_time: now + deadlineOffset,
    });
  };

  const handleToggleComplete = timestamp => {
    setTasks(prev =>
      prev.map(task =>
        task.task_create_time === timestamp
          ? { ...task, task_complete: !task.task_complete }
          : task
      )
    );
  };

  const handleDeleteTask = timestamp => {
    setTasks(prev => prev.filter(task => task.task_create_time !== timestamp));
  };

  const handleUpdatePriority = (timestamp, priority) => {
    setTasks(prev =>
      prev.map(task =>
        task.task_create_time === timestamp
          ? { ...task, task_prior: clampPriority(priority) }
          : task
      )
    );
  };

  const handleClearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.task_complete));
  };

  return (
    <div className="todo-shell">
      <div className="todo-card">
        <TodoHeader
          stats={stats}
          filter={filter}
          onFilterChange={setFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="todo-body">
          <TodoInput onAddTask={handleAddTask} onAddRandomTask={handleGenerateRandomTask} />
          <TodoList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onUpdatePriority={handleUpdatePriority}
          />
        </div>

        <div className="todo-footer">
          <span>
            {stats.completed}/{stats.total} công việc đã hoàn thành
          </span>
          <button onClick={handleClearCompleted}>Xoá công việc đã xong</button>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;

