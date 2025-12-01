const PRIORITY_META = {
  0: { label: 'Thấp', className: 'low' },
  1: { label: 'Trung bình', className: 'medium' },
  2: { label: 'Cao', className: 'high' },
};

const formatUnix = value => {
  if (!value) return 'Chưa đặt';
  const date = new Date(value * 1000);
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

function TodoItem({ task, onToggleComplete, onDeleteTask, onUpdatePriority }) {
  const priorityInfo = PRIORITY_META[task.task_prior] || PRIORITY_META[1];

  return (
    <div className={`todo-item ${task.task_complete ? 'completed' : ''}`}>
      <input type="checkbox" checked={task.task_complete} onChange={onToggleComplete} />

      <div>
        <div className="todo-item__title">{task.task_name}</div>
        {task.task_describle && (
          <p className="todo-item__description">{task.task_describle}</p>
        )}

        <div className="todo-item__meta">
          <span className={`priority-pill ${priorityInfo.className}`}>
            Ưu tiên: {priorityInfo.label}
          </span>
          <span>Deadline: {formatUnix(task.task_deadline_time)}</span>
          <span>Tạo: {formatUnix(task.task_create_time)}</span>
        </div>
      </div>

      <div className="todo-item__actions">
        <select
          className="todo-input"
          value={task.task_prior}
          onChange={event => onUpdatePriority(Number(event.target.value))}
          style={{ width: '140px', padding: '6px 10px' }}
        >
          <option value={0}>Ưu tiên thấp</option>
          <option value={1}>Ưu tiên trung bình</option>
          <option value={2}>Ưu tiên cao</option>
        </select>
        <button className="delete" type="button" onClick={onDeleteTask}>
          Xoá
        </button>
      </div>
    </div>
  );
}

export default TodoItem;

