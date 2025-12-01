import { useState } from 'react';

// Example components for composition
function Card({ children, title }) {
  return (
    <div style={{
      border: '2px solid #667eea',
      borderRadius: '8px',
      padding: '20px',
      margin: '10px 0',
      background: 'white'
    }}>
      {title && <h3 style={{ color: '#667eea', marginBottom: '15px' }}>{title}</h3>}
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = 'primary' }) {
  const styles = {
    primary: { background: '#667eea', color: 'white' },
    secondary: { background: '#6c757d', color: 'white' }
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
      {children}
    </button>
  );
}

function Dialog({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h3>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ComponentComposition() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="topic-section">
      <h2>Component Composition</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Component Composition</strong> là kỹ thuật xây dựng UI phức tạp bằng cách 
          kết hợp các components nhỏ, đơn giản lại với nhau. Thay vì tạo một component lớn 
          với nhiều logic, bạn chia nhỏ thành các components có thể tái sử dụng và kết hợp 
          chúng lại. Đây là một trong những nguyên tắc cốt lõi của React.
        </p>
      </div>

      <h3>Containment với children prop</h3>
      <p>
        Một trong những patterns phổ biến nhất là sử dụng <span className="highlight">children</span> 
        prop để cho phép component cha truyền nội dung tùy ý vào component con.
      </p>

      <div className="code-example">
        <pre>{`function Container({ children }) {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      {children}
    </div>
  );
}

function App() {
  return (
    <Container>
      <h1>Title</h1>
      <p>Content</p>
    </Container>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Card Component với children</h4>
        <Card title="Card với children prop">
          <p>Đây là nội dung được truyền vào qua children prop.</p>
          <p>Bạn có thể truyền bất kỳ JSX nào vào đây.</p>
          <Button onClick={() => alert('Clicked!')}>Click me</Button>
        </Card>
      </div>

      <h3>Specialization (Đặc biệt hóa)</h3>
      <p>
        Tạo các components đặc biệt từ components tổng quát bằng cách sử dụng composition.
      </p>

      <div className="code-example">
        <pre>{`// Component tổng quát
function Dialog({ title, children, isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// Components đặc biệt
function WelcomeDialog({ isOpen, onClose }) {
  return (
    <Dialog title="Welcome" isOpen={isOpen} onClose={onClose}>
      <p>Welcome to our app!</p>
    </Dialog>
  );
}

function ConfirmDialog({ isOpen, onClose, onConfirm, message }) {
  return (
    <Dialog title="Confirm" isOpen={isOpen} onClose={onClose}>
      <p>{message}</p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </Dialog>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Dialog Component</h4>
        <Button onClick={() => setDialogOpen(true)}>Mở Dialog</Button>
        <Dialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Dialog Example"
        >
          <p>Đây là một dialog được tạo bằng component composition.</p>
          <p>Bạn có thể đóng nó bằng cách click vào nút X hoặc click ra ngoài.</p>
        </Dialog>
      </div>

      <h3>Multiple Children Slots</h3>
      <p>
        Thay vì chỉ có một children, bạn có thể tạo nhiều "slots" bằng cách sử dụng 
        props với tên khác nhau.
      </p>

      <div className="code-example">
        <pre>{`function SplitPane({ left, right }) {
  return (
    <div className="split-pane">
      <div className="left-pane">{left}</div>
      <div className="right-pane">{right}</div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={<Contacts />}
      right={<Chat />}
    />
  );
}

// Hoặc với nhiều slots hơn
function Layout({ header, sidebar, main, footer }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="body">
        <aside>{sidebar}</aside>
        <main>{main}</main>
      </div>
      <footer>{footer}</footer>
    </div>
  );
}`}</pre>
      </div>

      <h3>Composition vs Inheritance</h3>
      <p>
        React khuyến nghị sử dụng composition thay vì inheritance. Thay vì kế thừa, 
        bạn nên compose components lại với nhau.
      </p>

      <div className="code-example">
        <pre>{`// ❌ KHÔNG KHUYẾN NGHỊ - Inheritance
class SpecialButton extends Button {
  render() {
    return <button className="special">{this.props.children}</button>;
  }
}

// ✅ KHUYẾN NGHỊ - Composition
function SpecialButton({ children, ...props }) {
  return (
    <Button className="special" {...props}>
      {children}
    </Button>
  );
}

// Hoặc với wrapper
function SpecialButton({ children }) {
  return (
    <div className="special-wrapper">
      <Button>{children}</Button>
    </div>
  );
}`}</pre>
      </div>

      <h3>Higher-Order Components (HOC) Pattern</h3>
      <p>
        HOC là một function nhận component và trả về component mới với thêm functionality.
      </p>

      <div className="code-example">
        <pre>{`// HOC để thêm loading state
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

// Sử dụng
const UserProfileWithLoading = withLoading(UserProfile);

function App() {
  return <UserProfileWithLoading isLoading={true} />;
}`}</pre>
      </div>

      <h3>Render Props Pattern</h3>
      <p>
        Render props là một pattern nơi component nhận một function như prop và gọi nó 
        để render content.
      </p>

      <div className="code-example">
        <pre>{`function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Sử dụng
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    />
  );
}`}</pre>
      </div>

      <h3>Compound Components</h3>
      <p>
        Compound components là một nhóm components làm việc cùng nhau để tạo một UI phức tạp.
      </p>

      <div className="code-example">
        <pre>{`// Compound components
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div>
      {React.Children.map(children, (child, index) => {
        if (child.type === Tabs.Tab) {
          return React.cloneElement(child, {
            isActive: index === activeTab,
            onClick: () => setActiveTab(index)
          });
        }
        return child;
      })}
    </div>
  );
}

Tabs.Tab = function Tab({ isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </button>
  );
};

// Sử dụng
function App() {
  return (
    <Tabs>
      <Tabs.Tab>Tab 1</Tabs.Tab>
      <Tabs.Tab>Tab 2</Tabs.Tab>
    </Tabs>
  );
}`}</pre>
      </div>

      <h3>Benefits của Composition</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#2e7d32', marginBottom: '10px' }}>Ưu điểm</h4>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Tái sử dụng code tốt hơn</li>
            <li>Components nhỏ, dễ test</li>
            <li>Linh hoạt và dễ mở rộng</li>
            <li>Dễ bảo trì và debug</li>
            <li>Tuân theo Single Responsibility Principle</li>
          </ul>
        </div>

        <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#e65100', marginBottom: '10px' }}>Khi nào dùng</h4>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>UI có nhiều phần lặp lại</li>
            <li>Cần tùy biến nội dung</li>
            <li>Xây dựng design system</li>
            <li>Components cần linh hoạt</li>
            <li>Tránh prop drilling</li>
          </ul>
        </div>
      </div>

      <h3>Ví dụ thực tế: Layout System</h3>
      <div className="code-example">
        <pre>{`function PageLayout({ header, sidebar, content, footer }) {
  return (
    <div className="page-layout">
      <header>{header}</header>
      <div className="body">
        <aside>{sidebar}</aside>
        <main>{content}</main>
      </div>
      <footer>{footer}</footer>
    </div>
  );
}

function App() {
  return (
    <PageLayout
      header={<Header />}
      sidebar={<Sidebar />}
      content={<MainContent />}
      footer={<Footer />}
    />
  );
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Ưu tiên composition over inheritance</li>
          <li>Giữ components nhỏ và tập trung vào một nhiệm vụ</li>
          <li>Sử dụng children prop cho containment</li>
          <li>Tạo components tổng quát, sau đó specialize</li>
          <li>Tránh prop drilling bằng cách sử dụng Context khi cần</li>
          <li>Document props và usage patterns</li>
        </ul>
      </div>
    </div>
  );
}

export default ComponentComposition;

