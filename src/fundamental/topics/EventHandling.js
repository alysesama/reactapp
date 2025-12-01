import { useState } from 'react';

function EventHandling() {
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleClick = () => {
    setMessage('Button đã được click!');
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted: ${formData.name} - ${formData.email}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      alert('Enter key pressed!');
    }
  };

  return (
    <div className="topic-section">
      <h2>Event Handling</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Event Handling</strong> trong React cho phép bạn xử lý các sự kiện 
          tương tác của người dùng như click, input, submit, v.v. React sử dụng 
          SyntheticEvent - một wrapper xung quanh native browser events để đảm bảo 
          tính nhất quán giữa các trình duyệt.
        </p>
      </div>

      <h3>Cú pháp cơ bản</h3>
      <p>
        Trong React, event handlers được viết với camelCase và nhận một SyntheticEvent 
        làm tham số.
      </p>

      <div className="code-example">
        <pre>{`function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click me</button>;
}

// Hoặc inline
function Button() {
  return (
    <button onClick={() => console.log('Clicked!')}>
      Click me
    </button>
  );
}`}</pre>
      </div>

      <h3>Các loại Events phổ biến</h3>
      <div className="code-example">
        <pre>{`function Component() {
  const handleClick = (e) => console.log('Click', e);
  const handleChange = (e) => console.log('Change', e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit');
  };
  const handleMouseOver = (e) => console.log('Mouse over');
  const handleFocus = (e) => console.log('Focus');
  const handleBlur = (e) => console.log('Blur');
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseOver={handleMouseOver}
      />
      <button onClick={handleClick}>Click</button>
    </form>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác: Click Event</h4>
        <button 
          onClick={handleClick}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          Click me
        </button>
        {message && <p style={{ color: '#667eea' }}>{message}</p>}
      </div>

      <h3>Event Object (SyntheticEvent)</h3>
      <p>
        React cung cấp SyntheticEvent - một wrapper xung quanh native event. 
        Nó có interface giống native event nhưng hoạt động nhất quán trên mọi trình duyệt.
      </p>

      <div className="code-example">
        <pre>{`function Component() {
  const handleClick = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định
    e.stopPropagation(); // Ngăn event bubbling
    
    console.log(e.target); // Element gây ra event
    console.log(e.currentTarget); // Element có event handler
    console.log(e.type); // Loại event ('click', 'change', etc.)
  };
  
  return <button onClick={handleClick}>Click</button>;
}`}</pre>
      </div>

      <h3>Passing Arguments to Event Handlers</h3>
      <p>
        Bạn có thể truyền thêm tham số cho event handler bằng cách sử dụng arrow function 
        hoặc bind.
      </p>

      <div className="code-example">
        <pre>{`function TodoList() {
  const todos = ['Task 1', 'Task 2', 'Task 3'];
  
  // Cách 1: Arrow function
  const handleDelete = (id) => {
    console.log('Delete', id);
  };
  
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          {todo}
          <button onClick={() => handleDelete(index)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

// Cách 2: Bind
function Component() {
  const handleClick = function(id, e) {
    console.log('ID:', id, 'Event:', e);
  };
  
  return <button onClick={handleClick.bind(null, 123)}>Click</button>;
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Input Event</h4>
        <input
          type="text"
          placeholder="Nhập text..."
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          style={{
            padding: '8px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #667eea',
            marginBottom: '10px'
          }}
        />
        <p>Bạn đã nhập: <strong>{message}</strong></p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          (Thử nhấn Enter để xem keyPress event)
        </p>
      </div>

      <h3>Form Events</h3>
      <p>
        Xử lý form events đòi hỏi ngăn hành vi mặc định của browser và quản lý state 
        của form inputs.
      </p>

      <div className="code-example">
        <pre>{`function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn form submit mặc định
    console.log('Form data:', formData);
    // Xử lý submit logic
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Form với Submit Event</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            name="name"
            placeholder="Tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #667eea' }}
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #667eea' }}
          />
          <button 
            type="submit"
            style={{
              padding: '10px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </form>
      </div>

      <h3>Event Bubbling và stopPropagation</h3>
      <p>
        Events trong React bubble lên theo DOM tree. Bạn có thể ngăn bubbling bằng 
        <span className="highlight"> stopPropagation()</span>.
      </p>

      <div className="code-example">
        <pre>{`function Parent() {
  const handleParentClick = () => {
    console.log('Parent clicked');
  };
  
  return (
    <div onClick={handleParentClick} style={{ padding: '20px', background: '#f0f0f0' }}>
      <Child />
    </div>
  );
}

function Child() {
  const handleChildClick = (e) => {
    e.stopPropagation(); // Ngăn event bubble lên parent
    console.log('Child clicked');
  };
  
  return (
    <button onClick={handleChildClick}>
      Click me
    </button>
  );
}`}</pre>
      </div>

      <h3>Conditional Event Handlers</h3>
      <p>
        Bạn có thể điều kiện hóa event handlers dựa trên state hoặc props.
      </p>

      <div className="code-example">
        <pre>{`function Button({ disabled }) {
  const handleClick = () => {
    if (disabled) return; // Không làm gì nếu disabled
    console.log('Clicked');
  };
  
  return (
    <button 
      onClick={handleClick}
      disabled={disabled}
    >
      Click
    </button>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Counter với nhiều events</h4>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#667eea' }}>{count}</h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => setCount(count + 1)}
              style={{
                padding: '10px 20px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Tăng
            </button>
            <button
              onClick={() => setCount(count - 1)}
              style={{
                padding: '10px 20px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Giảm
            </button>
            <button
              onClick={() => setCount(0)}
              style={{
                padding: '10px 20px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <h3>Custom Events</h3>
      <p>
        Bạn có thể tạo custom event handlers để truyền data từ component con lên component cha.
      </p>

      <div className="code-example">
        <pre>{`function Parent() {
  const handleCustomEvent = (data) => {
    console.log('Received:', data);
  };
  
  return <Child onCustomEvent={handleCustomEvent} />;
}

function Child({ onCustomEvent }) {
  const handleClick = () => {
    onCustomEvent({ message: 'Hello from child!' });
  };
  
  return <button onClick={handleClick}>Send Data</button>;
}`}</pre>
      </div>

      <div className="warning-box">
        <strong>Lưu ý quan trọng:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Event handlers phải là functions, không phải function calls</li>
          <li>Sử dụng arrow functions hoặc bind để truyền tham số</li>
          <li>Luôn preventDefault() cho form submit nếu xử lý thủ công</li>
          <li>SyntheticEvent được pool, nên không thể truy cập sau khi event handler kết thúc</li>
          <li>Nếu cần truy cập event sau đó, gọi e.persist()</li>
        </ul>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Đặt tên event handlers rõ ràng (handleClick, handleSubmit, etc.)</li>
          <li>Tránh inline functions phức tạp, tách ra thành functions riêng</li>
          <li>Sử dụng preventDefault() cho form submissions</li>
          <li>Xử lý errors trong event handlers</li>
          <li>Tránh mutate state trực tiếp trong event handlers</li>
        </ul>
      </div>
    </div>
  );
}

export default EventHandling;

