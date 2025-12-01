import { useState } from 'react';

function JSXSyntax() {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="topic-section">
      <h2>JSX Syntax</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>JSX (JavaScript XML)</strong> là một cú pháp mở rộng của JavaScript 
          cho phép bạn viết HTML-like code trong JavaScript. JSX không phải là HTML 
          thuần túy mà là một cách viết code mà React sẽ biên dịch thành các lời gọi 
          hàm React.createElement().
        </p>
      </div>

      <h3>Cú pháp cơ bản</h3>
      <p>
        JSX cho phép bạn viết code trông giống HTML nhưng thực chất là JavaScript. 
        Mỗi thẻ JSX sẽ được React chuyển đổi thành một React element.
      </p>

      <div className="code-example">
        <pre>{`// JSX code
const element = <h1>Hello, World!</h1>;

// Được biên dịch thành:
const element = React.createElement('h1', null, 'Hello, World!');`}</pre>
      </div>

      <h3>Quy tắc quan trọng</h3>
      
      <div className="info-box">
        <strong>1. Return một element duy nhất:</strong>
        <p>Một component phải return một element duy nhất. Nếu muốn return nhiều element, 
        bạn phải bọc chúng trong một thẻ cha hoặc sử dụng Fragment.</p>
      </div>

      <div className="code-example">
        <pre>{`// ❌ SAI - return nhiều element
function Component() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  );
}

// ✅ ĐÚNG - bọc trong một element
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

// ✅ ĐÚNG - sử dụng Fragment
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}`}</pre>
      </div>

      <div className="info-box">
        <strong>2. Đóng tất cả các thẻ:</strong>
        <p>Tất cả các thẻ JSX phải được đóng, kể cả các thẻ tự đóng như &lt;img&gt;.</p>
      </div>

      <div className="code-example">
        <pre>{`// ❌ SAI
<img src="image.jpg">
<input type="text">

// ✅ ĐÚNG
<img src="image.jpg" />
<input type="text" />`}</pre>
      </div>

      <div className="info-box">
        <strong>3. className thay vì class:</strong>
        <p>Vì <span className="highlight">class</span> là từ khóa dành riêng trong JavaScript, 
        JSX sử dụng <span className="highlight">className</span> thay thế.</p>
      </div>

      <div className="code-example">
        <pre>{`// ❌ SAI
<div class="container">Content</div>

// ✅ ĐÚNG
<div className="container">Content</div>`}</pre>
      </div>

      <h3>Nhúng JavaScript trong JSX</h3>
      <p>
        Bạn có thể nhúng bất kỳ biểu thức JavaScript nào vào JSX bằng cách đặt chúng 
        trong dấu ngoặc nhọn <span className="highlight">{`{}`}</span>.
      </p>

      <div className="code-example">
        <pre>{`const name = "React";
const number = 42;

function Component() {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Number: {number}</p>
      <p>Calculation: {2 + 2}</p>
      <p>Expression: {name.toUpperCase()}</p>
    </div>
  );
}`}</pre>
      </div>

      <h3>Thuộc tính (Attributes)</h3>
      <p>
        Các thuộc tính trong JSX sử dụng camelCase cho các tên thuộc tính. 
        Một số thuộc tính có tên khác với HTML thông thường.
      </p>

      <div className="code-example">
        <pre>{`// HTML attributes → JSX attributes
class → className
for → htmlFor
onclick → onClick
onchange → onChange
tabindex → tabIndex

// Ví dụ:
<button className="btn" onClick={handleClick}>
  Click me
</button>`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác</h4>
        <button 
          onClick={() => setShowExample(!showExample)}
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
          {showExample ? 'Ẩn' : 'Hiện'} ví dụ
        </button>
        {showExample && (
          <div style={{ padding: '15px', background: 'white', borderRadius: '5px' }}>
            <h3 style={{ color: '#667eea' }}>Xin chào từ JSX!</h3>
            <p>Đây là một ví dụ về JSX với JavaScript expression:</p>
            <p>Thời gian hiện tại: {new Date().toLocaleTimeString()}</p>
            <p>2 + 2 = {2 + 2}</p>
          </div>
        )}
      </div>

      <div className="warning-box">
        <strong>Lưu ý:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>JSX chỉ có thể chứa biểu thức, không thể chứa câu lệnh (if, for, while)</li>
          <li>Để sử dụng điều kiện, bạn cần dùng toán tử ternary hoặc &&</li>
          <li>JSX được biên dịch trước khi chạy, không phải runtime</li>
        </ul>
      </div>
    </div>
  );
}

export default JSXSyntax;

