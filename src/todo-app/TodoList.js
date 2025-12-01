import TodoItem from './TodoItem';

function TodoList({ tasks, onToggleComplete, onDeleteTask, onUpdatePriority }) {
  if (tasks.length === 0) {
    return (
      <div className="todo-list todo-list__empty">
        <h4>Chưa có công việc nào ở đây</h4>
        <p>Thêm task mới hoặc thay đổi bộ lọc để xem danh sách khác.</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {tasks.map(task => (
        <TodoItem
          key={task.task_create_time}
          task={task}
          onToggleComplete={() => onToggleComplete(task.task_create_time)}
          onDeleteTask={() => onDeleteTask(task.task_create_time)}
          onUpdatePriority={priority => onUpdatePriority(task.task_create_time, priority)}
        />
      ))}
    </div>
  );
}

export default TodoList;

