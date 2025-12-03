const PRIORITY_META = {
    0: { label: "Thấp", className: "low" },
    1: { label: "Trung bình", className: "medium" },
    2: { label: "Cao", className: "high" },
};

const formatUnix = (value) => {
    if (!value) return "Chưa đặt";
    const date = new Date(value * 1000);
    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

function TodoItem({
    task,
    onToggleComplete,
    onDeleteTask,
    onUpdatePriority,
}) {
    const priorityInfo =
        PRIORITY_META[task.task_prior] || PRIORITY_META[1];

    return (
        <div
            className={`todo-item ${
                task.task_complete ? "completed" : ""
            }`}
        >
            <div className="todo-item__title">
                {task.task_name}
            </div>
            <div className="todo-item__actions">
                <button
                    className="delete"
                    type="button"
                    onClick={onDeleteTask}
                >
                    Xoá
                </button>
            </div>

            <input
                type="checkbox"
                checked={task.task_complete}
                onChange={onToggleComplete}
            />
            {task.task_describle && (
                <p className="todo-item__description">
                    {task.task_describle}
                </p>
            )}

            <div className="todo-item__meta">
                <span
                    className={`priority-pill ${priorityInfo.className}`}
                >
                    {priorityInfo.label}
                </span>
                <span>
                    Create:{" "}
                    {formatUnix(task.task_create_time)}
                </span>
                <span>
                    Deadline:{" "}
                    {formatUnix(task.task_deadline_time)}
                </span>
            </div>
        </div>
    );
}

export default TodoItem;
