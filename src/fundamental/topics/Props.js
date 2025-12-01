import { useState } from 'react';

// Example components
function UserCard({ name, age, email, isActive }) {
  return (
    <div style={{
      border: '2px solid #667eea',
      borderRadius: '8px',
      padding: '15px',
      margin: '10px 0',
      background: isActive ? '#e8f5e9' : '#f5f5f5'
    }}>
      <h3>{name}</h3>
      <p>Tuổi: {age}</p>
      <p>Email: {email}</p>
      <p>Trạng thái: {isActive ? 'Hoạt động' : 'Không hoạt động'}</p>
    </div>
  );
}

function Button({ text, onClick, variant = 'primary' }) {
  const styles = {
    primary: { background: '#667eea', color: 'white' },
    secondary: { background: '#6c757d', color: 'white' },
    danger: { background: '#dc3545', color: 'white' }
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        ...styles[variant]
      }}
    >
      {text}
    </button>
  );
}

function Props() {
  const [count, setCount] = useState(0);

  return (
    <div className="topic-section">
      <h2>Props</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Props (Properties)</strong> là cách để truyền dữ liệu từ component cha 
          xuống component con. Props là read-only (chỉ đọc), component con không thể thay đổi 
          props mà nó nhận được. Props giúp components trở nên linh hoạt và có thể tái sử dụng.
        </p>
      </div>

      <h3>Cách truyền Props</h3>
      <p>
        Props được truyền giống như các thuộc tính HTML. Trong component con, 
        props được nhận như một object trong tham số của hàm.
      </p>

      <div className="code-example">
        <pre>{`// Component cha truyền props
function App() {
  return <Greeting name="React" age={5} />;
}

// Component con nhận props
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
    </div>
  );
}

// Hoặc nhận toàn bộ props object
function Greeting(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Age: {props.age}</p>
    </div>
  );
}`}</pre>
      </div>

      <h3>Props là Read-Only</h3>
      <div className="warning-box">
        <strong>Quan trọng:</strong> Props là immutable (không thể thay đổi). 
        Component con không được thay đổi props. Nếu cần thay đổi dữ liệu, 
        bạn phải sử dụng state.
      </div>

      <div className="code-example">
        <pre>{`// ❌ SAI - Không được thay đổi props
function BadComponent({ count }) {
  count = count + 1; // ❌ Lỗi!
  return <div>{count}</div>;
}

// ✅ ĐÚNG - Sử dụng state nếu cần thay đổi
function GoodComponent({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`}</pre>
      </div>

      <h3>Default Props</h3>
      <p>
        Bạn có thể đặt giá trị mặc định cho props bằng cách sử dụng default parameters 
        hoặc destructuring với giá trị mặc định.
      </p>

      <div className="code-example">
        <pre>{`// Sử dụng default parameters
function Button({ text = 'Click me', onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

// Sử dụng destructuring với giá trị mặc định
function UserCard({ name = 'Anonymous', age = 0 }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
    </div>
  );
}

// Sử dụng
<Button /> // text sẽ là "Click me"
<UserCard /> // name sẽ là "Anonymous", age sẽ là 0`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác với Props</h4>
        <div style={{ marginBottom: '20px' }}>
          <UserCard 
            name="Nguyễn Văn A" 
            age={25} 
            email="nguyenvana@example.com"
            isActive={true}
          />
          <UserCard 
            name="Trần Thị B" 
            age={30} 
            email="tranthib@example.com"
            isActive={false}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button 
            text={`Đếm: ${count}`}
            onClick={() => setCount(count + 1)}
            variant="primary"
          />
          <Button 
            text="Reset"
            onClick={() => setCount(0)}
            variant="secondary"
          />
          <Button 
            text="Giảm"
            onClick={() => setCount(count - 1)}
            variant="danger"
          />
        </div>
      </div>

      <h3>Truyền Functions như Props</h3>
      <p>
        Bạn có thể truyền functions như props để component con có thể giao tiếp 
        với component cha (callback pattern).
      </p>

      <div className="code-example">
        <pre>{`function Parent() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <Child onButtonClick={handleClick} />;
}

function Child({ onButtonClick }) {
  return <button onClick={onButtonClick}>Click me</button>;
}`}</pre>
      </div>

      <h3>Children Prop</h3>
      <p>
        <span className="highlight">children</span> là một prop đặc biệt chứa nội dung 
        giữa thẻ mở và thẻ đóng của component.
      </p>

      <div className="code-example">
        <pre>{`function Container({ children }) {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      {children}
    </div>
  );
}

// Sử dụng
<Container>
  <h1>Title</h1>
  <p>Content</p>
</Container>

// children sẽ chứa <h1> và <p>`}</pre>
      </div>

      <h3>PropTypes (Type Checking)</h3>
      <p>
        Để đảm bảo props có đúng kiểu dữ liệu, bạn có thể sử dụng PropTypes 
        (hoặc TypeScript cho type safety tốt hơn).
      </p>

      <div className="code-example">
        <pre>{`import PropTypes from 'prop-types';

function UserCard({ name, age, email }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired
};`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Đặt tên props rõ ràng, mô tả mục đích</li>
          <li>Sử dụng destructuring để nhận props</li>
          <li>Đặt giá trị mặc định cho props optional</li>
          <li>Không thay đổi props trong component con</li>
          <li>Sử dụng PropTypes hoặc TypeScript để kiểm tra kiểu dữ liệu</li>
        </ul>
      </div>
    </div>
  );
}

export default Props;

