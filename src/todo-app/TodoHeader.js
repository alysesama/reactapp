const FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Đang làm' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'high', label: 'Ưu tiên cao' },
];

function TodoHeader({ stats, filter, onFilterChange, searchTerm, onSearchChange }) {
  return (
    <header className="todo-header">
      <div className="todo-header__top">
        <div>
          <div className="todo-header__title">Flowboard</div>
          <div className="todo-header__subtitle">Quản lý tasks tập trung trong một bảng duy nhất</div>
        </div>

        <div className="todo-header__stats">
          <div className="todo-stat">
            <span>Tổng</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="todo-stat">
            <span>Hoàn thành</span>
            <strong>{stats.completed}</strong>
          </div>
          <div className="todo-stat">
            <span>Đang chờ</span>
            <strong>{stats.upcoming}</strong>
          </div>
        </div>
      </div>

      <div className="todo-controls">
        <div className="filter-group">
          {FILTERS.map(option => (
            <button
              key={option.id}
              className={`filter-button ${filter === option.id ? 'active' : ''}`}
              onClick={() => onFilterChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <input
          className="search-input"
          placeholder="Tìm kiếm công việc..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
}

export default TodoHeader;

