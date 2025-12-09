import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h3>Count: {count}</h3>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)} style={{ margin: '0 10px' }}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

function FormExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: '5px', padding: '8px' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: '5px', padding: '8px' }}
      />
      <p>Tên: {name}</p>
      <p>Email: {email}</p>
    </div>
  );
}

function State() {
  const [showCounter, setShowCounter] = useState(true);

  return (
    <div className="topic-section">
      <h2>State với useState Hook</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>State</strong> là dữ liệu có thể thay đổi trong component. 
          Khi state thay đổi, React sẽ tự động re-render component để phản ánh 
          sự thay đổi đó. <span className="highlight">useState</span> là một React Hook 
          cho phép bạn thêm state vào functional components.
        </p>
      </div>

      <h3>Cú pháp useState</h3>
      <div className="code-example">
        <pre>{`import { useState } from 'react';

function Component() {
  const [state, setState] = useState(initialValue);
  
  return (
    <div>
      <p>{state}</p>
      <button onClick={() => setState(newValue)}>Update</button>
    </div>
  );
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Giải thích:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li><span className="highlight">useState</span> trả về một mảng gồm 2 phần tử</li>
          <li>Phần tử đầu tiên là giá trị state hiện tại</li>
          <li>Phần tử thứ hai là hàm để cập nhật state</li>
          <li>Tham số của useState là giá trị khởi tạo</li>
        </ul>
      </div>

      <h3>Ví dụ cơ bản</h3>
      <div className="code-example">
        <pre>{`function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác: Counter</h4>
        <button
          onClick={() => setShowCounter((value) => !value)}
          style={{ marginBottom: '10px' }}
        >
          {showCounter ? 'Ẩn Counter' : 'Hiện Counter'}
        </button>
        {showCounter && <Counter />}
      </div>

      <h3>State với nhiều giá trị</h3>
      <p>
        Bạn có thể sử dụng nhiều useState hooks trong một component để quản lý 
        nhiều state độc lập.
      </p>

      <div className="code-example">
        <pre>{`function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="number"
        value={age} 
        onChange={(e) => setAge(Number(e.target.value))} 
      />
    </form>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác: Form với nhiều state</h4>
        <FormExample />
      </div>

      <h3>Cập nhật State dựa trên State trước đó</h3>
      <p>
        Khi cập nhật state dựa trên giá trị state hiện tại, bạn nên sử dụng 
        functional update để đảm bảo tính chính xác.
      </p>

      <div className="code-example">
        <pre>{`// ❌ Có thể không chính xác nếu có nhiều updates
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1); // Dựa vào giá trị hiện tại
    setCount(count + 1); // Vẫn dựa vào giá trị cũ, không phải giá trị mới
  };
}

// ✅ ĐÚNG - Sử dụng functional update
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1); // Dựa vào giá trị mới nhất
  };
}`}</pre>
      </div>

      <h3>State với Objects và Arrays</h3>
      <p>
        Khi state là object hoặc array, bạn phải tạo một object/array mới 
        thay vì mutate (thay đổi trực tiếp) object/array cũ.
      </p>

      <div className="code-example">
        <pre>{`function UserProfile() {
  const [user, setUser] = useState({ name: '', age: 0 });
  
  // ❌ SAI - Mutate trực tiếp
  const updateNameWrong = (newName) => {
    user.name = newName; // ❌ Không hoạt động!
    setUser(user);
  };
  
  // ✅ ĐÚNG - Tạo object mới
  const updateName = (newName) => {
    setUser({ ...user, name: newName });
  };
  
  // ✅ ĐÚNG - Sử dụng functional update
  const updateAge = (newAge) => {
    setUser(prevUser => ({ ...prevUser, age: newAge }));
  };
  
  return (
    <div>
      <p>{user.name} - {user.age}</p>
      <button onClick={() => updateName('John')}>Set Name</button>
      <button onClick={() => updateAge(25)}>Set Age</button>
    </div>
  );
}`}</pre>
      </div>

      <div className="code-example">
        <pre>{`function TodoList() {
  const [todos, setTodos] = useState([]);
  
  // ✅ Thêm item mới
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  // ✅ Xóa item
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // ✅ Cập nhật item
  const updateTodo = (id, newText) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };
  
  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}`}</pre>
      </div>

      <h3>Lazy Initial State</h3>
      <p>
        Nếu giá trị khởi tạo của state cần tính toán phức tạp, bạn có thể truyền 
        một function vào useState. Function này chỉ chạy một lần khi component mount.
      </p>

      <div className="code-example">
        <pre>{`// ❌ Tính toán mỗi lần render
function ExpensiveComponent() {
  const [data, setData] = useState(expensiveCalculation());
  // expensiveCalculation() chạy mỗi lần render
}

// ✅ Chỉ tính toán một lần
function ExpensiveComponent() {
  const [data, setData] = useState(() => expensiveCalculation());
  // expensiveCalculation() chỉ chạy một lần khi mount
}`}</pre>
      </div>

      <h3>State và Re-rendering</h3>
      <div className="warning-box">
        <strong>Quan trọng:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Khi state thay đổi, component sẽ re-render</li>
          <li>Chỉ component có state và các component con sẽ re-render</li>
          <li>React sử dụng Object.is() để so sánh state cũ và mới</li>
          <li>Nếu giá trị state không thay đổi (theo Object.is), component sẽ không re-render</li>
        </ul>
      </div>

      <div className="code-example">
        <pre>{`function Component() {
  const [count, setCount] = useState(0);
  
  // Re-render khi count thay đổi
  const increment = () => setCount(count + 1);
  
  // Không re-render vì giá trị không đổi
  const noChange = () => setCount(0); // count đã là 0
  
  return <div>{count}</div>;
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Đặt state ở component thấp nhất có thể (lift state up khi cần)</li>
          <li>Sử dụng functional update khi cập nhật dựa trên state cũ</li>
          <li>Không mutate state trực tiếp, luôn tạo giá trị mới</li>
          <li>Sử dụng lazy initial state cho tính toán phức tạp</li>
          <li>Tránh quá nhiều state, có thể gộp thành object nếu liên quan</li>
        </ul>
      </div>
    </div>
  );
}

export default State;

