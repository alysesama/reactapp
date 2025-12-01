import { useState } from 'react';

// Functional Component example
function WelcomeMessage({ name }) {
  return <h2>Chào mừng, {name}!</h2>;
}

// Class Component example (commented out, but shown for reference)
/*
class WelcomeClass extends React.Component {
  render() {
    return <h2>Chào mừng, {this.props.name}!</h2>;
  }
}
*/

function Components() {
  const [name, setName] = useState('Người dùng');

  return (
    <div className="topic-section">
      <h2>Components</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Component</strong> là các khối xây dựng cơ bản của ứng dụng React. 
          Một component là một hàm hoặc class JavaScript trả về JSX để mô tả giao diện 
          người dùng. Components cho phép bạn chia nhỏ UI thành các phần độc lập, 
          có thể tái sử dụng.
        </p>
      </div>

      <h3>Functional Components (Khuyến nghị)</h3>
      <p>
        Functional components là các hàm JavaScript đơn giản nhận props làm tham số 
        và trả về JSX. Đây là cách viết component được khuyến nghị trong React hiện đại.
      </p>

      <div className="code-example">
        <pre>{`// Functional Component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow Function Component
const Welcome = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

// Sử dụng component
<Welcome name="React" />`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ Functional Component</h4>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên của bạn"
          style={{
            padding: '8px',
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #667eea'
          }}
        />
        <WelcomeMessage name={name} />
      </div>

      <h3>Class Components (Legacy)</h3>
      <p>
        Class components là cách viết component cũ sử dụng ES6 classes. 
        Mặc dù vẫn được hỗ trợ, nhưng React khuyến nghị sử dụng functional components 
        với hooks thay vì class components.
      </p>

      <div className="code-example">
        <pre>{`// Class Component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

// Sử dụng component
<Welcome name="React" />`}</pre>
      </div>

      <h3>So sánh Functional vs Class Components</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#2e7d32', marginBottom: '10px' }}>Functional Components</h4>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Đơn giản hơn, dễ đọc</li>
            <li>Ít code hơn</li>
            <li>Sử dụng Hooks cho state và lifecycle</li>
            <li>Hiệu suất tốt hơn (React có thể tối ưu hóa tốt hơn)</li>
            <li>Khuyến nghị sử dụng</li>
          </ul>
        </div>

        <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#e65100', marginBottom: '10px' }}>Class Components</h4>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Phức tạp hơn, nhiều boilerplate</li>
            <li>Sử dụng this và bind</li>
            <li>Có lifecycle methods</li>
            <li>Khó tối ưu hóa hơn</li>
            <li>Legacy, không khuyến nghị</li>
          </ul>
        </div>
      </div>

      <h3>Đặt tên Component</h3>
      <p>
        Tên component phải bắt đầu bằng chữ cái in hoa. Điều này giúp React phân biệt 
        component với các thẻ HTML thông thường.
      </p>

      <div className="code-example">
        <pre>{`// ✅ ĐÚNG - Component với chữ cái in hoa
function MyComponent() {
  return <div>Content</div>;
}

// ❌ SAI - Component với chữ cái thường
function myComponent() {
  return <div>Content</div>;
}

// React sẽ coi myComponent là thẻ HTML thông thường
<myComponent /> // ❌ Không hoạt động`}</pre>
      </div>

      <h3>Composing Components</h3>
      <p>
        Components có thể được sử dụng bên trong các components khác, cho phép bạn 
        xây dựng UI phức tạp từ các phần đơn giản.
      </p>

      <div className="code-example">
        <pre>{`function Header() {
  return <header><h1>My App</h1></header>;
}

function Content() {
  return <main><p>Main content</p></main>;
}

function Footer() {
  return <footer><p>Footer</p></footer>;
}

function App() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn sử dụng functional components với hooks</li>
          <li>Đặt tên component rõ ràng, mô tả chức năng</li>
          <li>Giữ component nhỏ gọn, tập trung vào một nhiệm vụ</li>
          <li>Tách component lớn thành các component nhỏ hơn</li>
          <li>Một component nên có một trách nhiệm duy nhất (Single Responsibility Principle)</li>
        </ul>
      </div>
    </div>
  );
}

export default Components;

