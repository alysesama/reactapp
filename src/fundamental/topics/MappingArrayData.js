import { useState } from 'react';

function MappingArrayData() {
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
  ]);

  return (
    <div className="topic-section">
      <h2>Mapping Array Data to Components</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Mapping array data</strong> là kỹ thuật chuyển đổi mảng dữ liệu thành 
          danh sách các React components. Đây là pattern phổ biến khi hiển thị danh sách 
          items từ API hoặc state. Sử dụng phương thức <span className="highlight">map()</span> 
          để tạo ra một mảng các JSX elements.
        </p>
      </div>

      <h3>Cú pháp cơ bản</h3>
      <div className="code-example">
        <pre>{`const items = ['Apple', 'Banana', 'Orange'];

function FruitList() {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}`}</pre>
      </div>

      <h3>Mapping với Objects</h3>
      <p>
        Khi map array of objects, truy cập properties và sử dụng unique keys:
      </p>

      <div className="code-example">
        <pre>{`const users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
  { id: 3, name: 'Bob', email: 'bob@example.com' }
];

function UserList() {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}`}</pre>
      </div>

      <h3>Mapping với API Data</h3>
      <p>
        Kết hợp với async data từ API:
      </p>

      <div className="code-example">
        <pre>{`function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}`}</pre>
      </div>

      <h3>Conditional Rendering trong Map</h3>
      <p>
        Có thể kết hợp với conditional rendering:
      </p>

      <div className="code-example">
        <pre>{`function TodoList({ todos }) {
  return (
    <div>
      {todos.length === 0 ? (
        <p>No todos yet</p>
      ) : (
        todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))
      )}
    </div>
  );
}

// Hoặc filter trước khi map
function ActiveTodos({ todos }) {
  const activeTodos = todos.filter(todo => !todo.completed);
  
  return (
    <div>
      {activeTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}`}</pre>
      </div>

      <h3>Nested Mapping</h3>
      <p>
        Có thể map nested arrays:
      </p>

      <div className="code-example">
        <pre>{`const categories = [
  {
    id: 1,
    name: 'Frontend',
    items: ['React', 'Vue', 'Angular']
  },
  {
    id: 2,
    name: 'Backend',
    items: ['Node.js', 'Python', 'Java']
  }
];

function CategoryList() {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác: Mapping Users</h4>
        <div style={{ display: 'grid', gap: '12px', marginTop: '15px' }}>
          {users.map(user => (
            <div
              key={user.id}
              style={{
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#667eea' }}>{user.name}</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>Email: {user.email}</p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  background: user.role === 'admin' ? '#4caf50' : '#2196f3',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      <h3>Performance Considerations</h3>
      <div className="warning-box">
        <strong>Lưu ý về Performance:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn sử dụng unique, stable keys (không dùng index nếu có thể)</li>
          <li>Với danh sách lớn, cân nhắc virtualization (react-window)</li>
          <li>Tránh tạo functions trong map (sử dụng useCallback nếu cần)</li>
          <li>Memoize expensive computations với useMemo</li>
        </ul>
      </div>

      <div className="code-example">
        <pre>{`// ❌ Tạo function mới mỗi lần render
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onClick={() => handleClick(user.id)} // ❌ Function mới mỗi lần
        />
      ))}
    </div>
  );
}

// ✅ Sử dụng useCallback
function UserList({ users }) {
  const handleClick = useCallback((userId) => {
    // Handle click
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onClick={handleClick} // ✅ Same function reference
        />
      ))}
    </div>
  );
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn sử dụng key prop với unique values</li>
          <li>Tránh dùng index làm key nếu list có thể thay đổi</li>
          <li>Extract mapping logic thành separate components</li>
          <li>Xử lý empty states</li>
          <li>Tối ưu performance cho large lists</li>
        </ul>
      </div>
    </div>
  );
}

export default MappingArrayData;

