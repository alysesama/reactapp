import { useState } from 'react';

function ConditionalRendering() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [items] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="topic-section">
      <h2>Conditional Rendering</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Conditional Rendering</strong> là kỹ thuật hiển thị các phần tử UI 
          khác nhau dựa trên điều kiện. Trong React, bạn có thể sử dụng các cấu trúc 
          JavaScript như if/else, ternary operator, và logical && operator để render 
          điều kiện.
        </p>
      </div>

      <h3>1. If/Else Statement</h3>
      <p>
        Cách đơn giản nhất là sử dụng if/else statement trước return.
      </p>

      <div className="code-example">
        <pre>{`function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please sign in.</h1>;
  }
}

// Sử dụng
<Greeting isLoggedIn={true} />`}</pre>
      </div>

      <h3>2. Ternary Operator</h3>
      <p>
        Ternary operator <span className="highlight">? :</span> cho phép bạn viết 
        conditional rendering ngắn gọn trong JSX.
      </p>

      <div className="code-example">
        <pre>{`function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  );
}

// Inline với một dòng
function Component({ count }) {
  return <div>{count > 0 ? 'Count: ' + count : 'No count'}</div>;
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Login Status với Ternary</h4>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{
            padding: '10px 20px',
            background: isLoggedIn ? '#f44336' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          {isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}
        </button>
        <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
          {isLoggedIn ? (
            <h3 style={{ color: '#4caf50' }}>Chào mừng bạn đã đăng nhập!</h3>
          ) : (
            <h3 style={{ color: '#f44336' }}>Vui lòng đăng nhập</h3>
          )}
        </div>
      </div>

      <h3>3. Logical && Operator</h3>
      <p>
        Sử dụng <span className="highlight">&&</span> để render một phần tử nếu điều kiện đúng, 
        hoặc không render gì nếu điều kiện sai.
      </p>

      <div className="code-example">
        <pre>{`function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

// Lưu ý: Nếu điều kiện là 0, nó sẽ render 0
// Để tránh, sử dụng boolean conversion
{unreadMessages.length > 0 && <h2>Messages</h2>}
{!!unreadMessages.length && <h2>Messages</h2>}
{Boolean(unreadMessages.length) && <h2>Messages</h2>}`}</pre>
      </div>

      <div className="warning-box">
        <strong>Lưu ý:</strong> Nếu điều kiện trả về số 0, React sẽ render số 0. 
        Để tránh, đảm bảo điều kiện luôn trả về boolean hoặc sử dụng ternary operator.
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Hiển thị thông báo với &&</h4>
        <button
          onClick={() => setShowDetails(!showDetails)}
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
          {showDetails ? 'Ẩn' : 'Hiện'} chi tiết
        </button>
        {showDetails && (
          <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '5px' }}>
            <p>Đây là nội dung chi tiết được hiển thị khi showDetails = true</p>
            <p>Bạn có thể ẩn nó bằng cách click vào button phía trên.</p>
          </div>
        )}
      </div>

      <h3>4. Early Return</h3>
      <p>
        Sử dụng early return để tránh nested conditions và làm code dễ đọc hơn.
      </p>

      <div className="code-example">
        <pre>{`function UserProfile({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }
  
  if (user.error) {
    return <div>Error: {user.error}</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`}</pre>
      </div>

      <h3>5. Nested Conditions</h3>
      <p>
        Bạn có thể kết hợp nhiều điều kiện để tạo logic phức tạp hơn.
      </p>

      <div className="code-example">
        <pre>{`function Dashboard({ user, isAdmin }) {
  return (
    <div>
      {user ? (
        isAdmin ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

// Hoặc sử dụng nhiều && operators
function Component({ user, isAdmin, hasPermission }) {
  return (
    <div>
      {user && <UserInfo user={user} />}
      {isAdmin && <AdminPanel />}
      {hasPermission && <SpecialContent />}
    </div>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Role-based Rendering</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '10px' }}>Role:</label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            style={{ padding: '5px', borderRadius: '5px' }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
        <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
          {userRole === 'admin' && (
            <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>
              🔐 Admin Panel - Full Access
            </div>
          )}
          {userRole === 'moderator' && (
            <div style={{ color: '#f57c00', fontWeight: 'bold' }}>
              ⚡ Moderator Panel - Limited Access
            </div>
          )}
          {userRole === 'user' && (
            <div style={{ color: '#1976d2', fontWeight: 'bold' }}>
              👤 User Panel - Basic Access
            </div>
          )}
        </div>
      </div>

      <h3>6. Switch Statement</h3>
      <p>
        Sử dụng switch statement cho nhiều điều kiện rõ ràng.
      </p>

      <div className="code-example">
        <pre>{`function StatusMessage({ status }) {
  switch (status) {
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>Success!</div>;
    case 'error':
      return <div>Error occurred</div>;
    default:
      return <div>Unknown status</div>;
  }
}

// Hoặc trong JSX
function Component({ status }) {
  return (
    <div>
      {(() => {
        switch (status) {
          case 'loading':
            return <div>Loading...</div>;
          case 'success':
            return <div>Success!</div>;
          default:
            return <div>Default</div>;
        }
      })()}
    </div>
  );
}`}</pre>
      </div>

      <h3>7. Conditional Rendering với Variables</h3>
      <p>
        Bạn có thể lưu JSX vào biến và sử dụng điều kiện để quyết định giá trị.
      </p>

      <div className="code-example">
        <pre>{`function Component({ isLoggedIn, user }) {
  let content;
  
  if (isLoggedIn) {
    content = <UserDashboard user={user} />;
  } else {
    content = <LoginForm />;
  }
  
  return <div>{content}</div>;
}

// Hoặc với function
function Component({ condition }) {
  const renderContent = () => {
    if (condition) {
      return <div>Condition is true</div>;
    }
    return <div>Condition is false</div>;
  };
  
  return <div>{renderContent()}</div>;
}`}</pre>
      </div>

      <h3>8. Preventing Component from Rendering</h3>
      <p>
        Component có thể return <span className="highlight">null</span> để không render gì cả.
      </p>

      <div className="code-example">
        <pre>{`function WarningBanner({ warn }) {
  if (!warn) {
    return null; // Không render gì
  }
  
  return <div className="warning">Warning!</div>;
}

function Component() {
  const [showWarning, setShowWarning] = useState(true);
  
  return (
    <div>
      <WarningBanner warn={showWarning} />
      <button onClick={() => setShowWarning(!showWarning)}>
        {showWarning ? 'Hide' : 'Show'} Warning
      </button>
    </div>
  );
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Sử dụng ternary cho 2 trường hợp đơn giản</li>
          <li>Sử dụng && cho điều kiện hiển thị/ẩn</li>
          <li>Sử dụng early return cho nhiều điều kiện</li>
          <li>Tránh nested ternary quá sâu (tối đa 2-3 levels)</li>
          <li>Đặt tên biến rõ ràng cho điều kiện phức tạp</li>
          <li>Cân nhắc tách logic phức tạp thành component riêng</li>
        </ul>
      </div>
    </div>
  );
}

export default ConditionalRendering;

