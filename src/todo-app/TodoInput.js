import { useState } from 'react';

const defaultForm = {
  task_name: '',
  task_describle: '',
  task_prior: 1,
  task_deadline: '',
};

function TodoInput({ onAddTask, onAddRandomTask }) {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toUnixTime = value => {
    if (!value) return undefined;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? undefined : Math.floor(timestamp / 1000);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!form.task_name.trim()) {
      setError('Tên công việc không được để trống');
      return;
    }

    onAddTask({
      task_name: form.task_name.trim(),
      task_describle: form.task_describle.trim(),
      task_prior: Number(form.task_prior),
      task_deadline_time: toUnixTime(form.task_deadline),
    });

    setForm(defaultForm);
    setError('');
  };

  return (
    <form className="todo-input-card" onSubmit={handleSubmit}>
      <div>
        <h3>Tạo công việc mới</h3>
      </div>

      <div>
        <label htmlFor="task_name">Tên công việc</label>
        <input
          id="task_name"
          name="task_name"
          className="todo-input"
          placeholder="Ví dụ: Viết tài liệu onboarding"
          value={form.task_name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="task_describle">Mô tả</label>
        <textarea
          id="task_describle"
          name="task_describle"
          className="todo-input"
          placeholder="Thêm mô tả cụ thể, checklist hoặc resources cần thiết..."
          value={form.task_describle}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="task_prior">Độ ưu tiên</label>
        <select
          id="task_prior"
          name="task_prior"
          className="todo-input"
          value={form.task_prior}
          onChange={handleChange}
        >
          <option value={0}>Thấp</option>
          <option value={1}>Trung bình</option>
          <option value={2}>Cao</option>
        </select>
      </div>

      <div>
        <label htmlFor="task_deadline">Deadline</label>
        <input
          id="task_deadline"
          name="task_deadline"
          type="datetime-local"
          className="todo-input"
          value={form.task_deadline}
          onChange={handleChange}
        />
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}

      <button type="submit">Thêm công việc</button>
      <button
        type="button"
        className="ghost-button"
        onClick={() => onAddRandomTask?.()}
        style={{ marginTop: '8px' }}
      >
        Tạo ngẫu nhiên task
      </button>
    </form>
  );
}

export default TodoInput;

