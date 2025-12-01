import { useState } from 'react';

function ListsAndKeys() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', category: 'A' },
    { id: 2, name: 'Item 2', category: 'B' },
    { id: 3, name: 'Item 3', category: 'A' }
  ]);
  const [newItemName, setNewItemName] = useState('');

  const addItem = () => {
    if (newItemName.trim()) {
      setItems([...items, {
        id: Date.now(),
        name: newItemName,
        category: 'A'
      }]);
      setNewItemName('');
    }
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="topic-section">
      <h2>Lists and Keys</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          Trong React, bạn thường cần render danh sách các phần tử. Để render một mảng 
          các phần tử, bạn sử dụng phương thức <span className="highlight">map()</span>. 
          Mỗi phần tử trong danh sách cần có một <span className="highlight">key</span> 
          duy nhất để React có thể theo dõi và cập nhật hiệu quả.
        </p>
      </div>

      <h3>Rendering Lists với map()</h3>
      <p>
        Sử dụng phương thức <span className="highlight">map()</span> để chuyển đổi 
        mảng dữ liệu thành mảng các React elements.
      </p>

      <div className="code-example">
        <pre>{`const numbers = [1, 2, 3, 4, 5];

function NumberList() {
  const listItems = numbers.map((number) => (
    <li key={number.toString()}>{number}</li>
  ));
  
  return <ul>{listItems}</ul>;
}

// Hoặc inline
function NumberList() {
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number.toString()}>{number}</li>
      ))}
    </ul>
  );
}`}</pre>
      </div>

      <h3>Keys trong React</h3>
      <p>
        <strong>Keys</strong> giúp React xác định phần tử nào đã thay đổi, được thêm, 
        hoặc bị xóa. Keys phải là unique trong cùng một danh sách.
      </p>

      <div className="code-example">
        <pre>{`// ✅ ĐÚNG - Sử dụng unique ID
const todos = [
  { id: 1, text: 'Learn React' },
  { id: 2, text: 'Build app' }
];

function TodoList() {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// ❌ SAI - Không có key
{todos.map((todo) => (
  <li>{todo.text}</li> // ❌ Warning: Each child should have a key
))}

// ⚠️ TRÁNH - Sử dụng index làm key (chỉ khi danh sách không thay đổi)
{todos.map((todo, index) => (
  <li key={index}>{todo.text}</li> // ⚠️ Không khuyến nghị
))}`}</pre>
      </div>

      <div className="warning-box">
        <strong>Quan trọng về Keys:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Keys phải unique trong cùng một danh sách</li>
          <li>Keys chỉ cần unique trong cùng một level, không cần global unique</li>
          <li>Không sử dụng index làm key nếu danh sách có thể thay đổi (thêm/xóa/sắp xếp)</li>
          <li>Keys không được truyền như props, chúng chỉ dùng cho React internal</li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Todo List với Keys</h4>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Thêm item mới..."
            style={{
              padding: '8px',
              marginRight: '10px',
              borderRadius: '5px',
              border: '1px solid #667eea',
              width: '200px'
            }}
          />
          <button
            onClick={addItem}
            style={{
              padding: '8px 15px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Thêm
          </button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                padding: '10px',
                margin: '5px 0',
                background: '#f5f5f5',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{item.name} (ID: {item.id})</span>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  padding: '5px 10px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </div>

      <h3>Extracting Components với Keys</h3>
      <p>
        Khi render danh sách components, key nên được đặt ở component trong danh sách, 
        không phải ở component con.
      </p>

      <div className="code-example">
        <pre>{`// ❌ SAI - Key ở component con
function ListItem({ item }) {
  return <li key={item.id}>{item.text}</li>; // ❌ Key không hoạt động ở đây
}

function TodoList() {
  return (
    <ul>
      {todos.map((todo) => (
        <ListItem item={todo} /> // ❌ Thiếu key
      ))}
    </ul>
  );
}

// ✅ ĐÚNG - Key ở component trong danh sách
function ListItem({ item }) {
  return <li>{item.text}</li>;
}

function TodoList() {
  return (
    <ul>
      {todos.map((todo) => (
        <ListItem key={todo.id} item={todo} /> // ✅ Key ở đây
      ))}
    </ul>
  );
}`}</pre>
      </div>

      <h3>Keys chỉ cần unique trong cùng một level</h3>
      <p>
        Keys chỉ cần unique trong cùng một danh sách, không cần unique globally.
      </p>

      <div className="code-example">
        <pre>{`function Blog() {
  const posts = [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' }
  ];
  
  const comments = [
    { id: 1, text: 'Comment 1' },
    { id: 2, text: 'Comment 2' }
  ];
  
  return (
    <div>
      <section>
        {posts.map(post => (
          <article key={post.id}>{post.title}</article>
        ))}
      </section>
      <section>
        {comments.map(comment => (
          <div key={comment.id}>{comment.text}</div>
        ))}
      </section>
    </div>
  );
}

// Có thể sử dụng cùng ID trong posts và comments
// vì chúng ở các danh sách khác nhau`}</pre>
      </div>

      <h3>Filtering và Transforming Lists</h3>
      <p>
        Bạn có thể kết hợp map() với filter() và các phương thức mảng khác.
      </p>

      <div className="code-example">
        <pre>{`function TodoList({ todos }) {
  // Filter completed todos
  const completedTodos = todos.filter(todo => todo.completed);
  
  // Map và filter kết hợp
  const activeTodos = todos
    .filter(todo => !todo.completed)
    .map(todo => (
      <li key={todo.id}>{todo.text}</li>
    ));
  
  return (
    <div>
      <h3>Active Todos</h3>
      <ul>{activeTodos}</ul>
      
      <h3>Completed: {completedTodos.length}</h3>
    </div>
  );
}`}</pre>
      </div>

      <h3>Nested Lists</h3>
      <p>
        Khi render nested lists, mỗi level cần có keys riêng.
      </p>

      <div className="code-example">
        <pre>{`function CategoryList({ categories }) {
  return (
    <ul>
      {categories.map(category => (
        <li key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}`}</pre>
      </div>

      <h3>Conditional Rendering trong Lists</h3>
      <p>
        Bạn có thể kết hợp conditional rendering với lists.
      </p>

      <div className="code-example">
        <pre>{`function TodoList({ todos }) {
  if (todos.length === 0) {
    return <p>No todos yet!</p>;
  }
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.completed ? (
            <s>{todo.text}</s>
          ) : (
            <span>{todo.text}</span>
          )}
        </li>
      ))}
    </ul>
  );
}`}</pre>
      </div>

      <h3>Performance với Large Lists</h3>
      <p>
        Với danh sách lớn, React có thể chậm. Cân nhắc sử dụng virtualization 
        (react-window, react-virtualized) hoặc pagination.
      </p>

      <div className="code-example">
        <pre>{`// Với danh sách lớn, có thể sử dụng pagination
function LargeList({ items }) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  return (
    <div>
      <ul>
        {currentItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={() => setPage(page - 1)} disabled={page === 0}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)} disabled={endIndex >= items.length}>
        Next
      </button>
    </div>
  );
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn sử dụng keys khi render lists</li>
          <li>Sử dụng stable, unique IDs làm keys (từ database, UUID, etc.)</li>
          <li>Tránh sử dụng index làm key trừ khi danh sách không bao giờ thay đổi</li>
          <li>Đặt key ở element trong map(), không phải component con</li>
          <li>Tách logic phức tạp thành helper functions</li>
          <li>Cân nhắc performance cho danh sách lớn</li>
        </ul>
      </div>
    </div>
  );
}

export default ListsAndKeys;

