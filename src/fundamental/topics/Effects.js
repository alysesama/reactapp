import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>{seconds}s</h2>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Dừng' : 'Bắt đầu'}
      </button>
      <button onClick={() => setSeconds(0)} style={{ marginLeft: '10px' }}>
        Reset
      </button>
    </div>
  );
}

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData({ message: 'Dữ liệu đã tải thành công!' });
        setError(null);
      } catch (err) {
        setError('Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return <p style={{ color: 'green' }}>{data?.message}</p>;
}

function Effects() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Effect chạy mỗi lần render
  useEffect(() => {
    console.log('Component đã render');
  });

  // Effect chạy một lần khi mount
  useEffect(() => {
    console.log('Component đã mount');
  }, []);

  // Effect chạy khi count thay đổi
  useEffect(() => {
    console.log('Count đã thay đổi:', count);
  }, [count]);

  return (
    <div className="topic-section">
      <h2>Side Effects với useEffect Hook</h2>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => setCount((c) => c + 1)}>Tăng count ({count})</button>
        <input
          type="text"
          value={name}
          placeholder="Nhập tên để thấy dependencies"
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px' }}
        />
        <span>Tên hiện tại: {name || '---'}</span>
      </div>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Side Effects</strong> là các thao tác không liên quan trực tiếp đến 
          việc render UI, như: fetch data, set up subscriptions, thay đổi DOM thủ công, 
          timers, v.v. <span className="highlight">useEffect</span> là React Hook cho phép 
          bạn thực hiện side effects trong functional components.
        </p>
      </div>

      <h3>Cú pháp useEffect</h3>
      <div className="code-example">
        <pre>{`import { useEffect } from 'react';

function Component() {
  useEffect(() => {
    // Side effect code
    // Chạy sau mỗi lần render
    
    return () => {
      // Cleanup function (optional)
      // Chạy trước khi component unmount hoặc trước effect chạy lại
    };
  }, [dependencies]); // Dependency array
  
  return <div>Content</div>;
}`}</pre>
      </div>

      <h3>useEffect không có dependencies</h3>
      <p>
        Nếu không có dependency array, effect sẽ chạy sau mỗi lần component render.
      </p>

      <div className="code-example">
        <pre>{`function Component() {
  useEffect(() => {
    console.log('Chạy sau mỗi lần render');
  }); // Không có dependency array
  
  return <div>Content</div>;
}`}</pre>
      </div>

      <div className="warning-box">
        <strong>Lưu ý:</strong> Effect này chạy sau mỗi lần render, có thể gây ra 
        vấn đề hiệu suất nếu không cẩn thận. Thường chỉ dùng cho logging hoặc 
        các thao tác không tốn kém.
      </div>

      <h3>useEffect với empty dependency array</h3>
      <p>
        Với dependency array rỗng <span className="highlight">[]</span>, effect chỉ chạy 
        một lần sau khi component mount (tương đương componentDidMount trong class components).
      </p>

      <div className="code-example">
        <pre>{`function Component() {
  useEffect(() => {
    console.log('Chỉ chạy một lần khi component mount');
    // Thường dùng để:
    // - Fetch data từ API
    // - Set up subscriptions
    // - Thêm event listeners
  }, []); // Empty dependency array
  
  return <div>Content</div>;
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Fetch Data khi mount</h4>
        <DataFetcher />
      </div>

      <h3>useEffect với dependencies</h3>
      <p>
        Khi có dependencies trong array, effect sẽ chạy lại mỗi khi một trong các 
        dependencies thay đổi.
      </p>

      <div className="code-example">
        <pre>{`function Component() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Chạy khi count thay đổi
  useEffect(() => {
    console.log('Count đã thay đổi:', count);
  }, [count]);
  
  // Chạy khi count hoặc name thay đổi
  useEffect(() => {
    console.log('Count hoặc name đã thay đổi');
  }, [count, name]);
  
  return <div>Content</div>;
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ: Timer với useEffect</h4>
        <Timer />
      </div>

      <h3>Cleanup Function</h3>
      <p>
        Cleanup function được return từ effect sẽ chạy:
      </p>
      <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
        <li>Trước khi component unmount</li>
        <li>Trước khi effect chạy lại (nếu có dependencies)</li>
      </ul>

      <div className="code-example">
        <pre>{`function Component() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Cleanup function
    return () => {
      clearInterval(interval); // Dọn dẹp khi component unmount
    };
  }, []);
  
  return <div>Content</div>;
}`}</pre>
      </div>

      <h3>Các trường hợp sử dụng phổ biến</h3>

      <h4>1. Fetch Data từ API</h4>
      <div className="code-example">
        <pre>{`function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      setUser(data);
    }
    
    fetchUser();
  }, [userId]); // Chạy lại khi userId thay đổi
  
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}`}</pre>
      </div>

      <h4>2. Set up Event Listeners</h4>
      <div className="code-example">
        <pre>{`function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div>Width: {size.width}, Height: {size.height}</div>;
}`}</pre>
      </div>

      <h4>3. Subscriptions</h4>
      <div className="code-example">
        <pre>{`function ChatRoom({ roomId }) {
  useEffect(() => {
    const subscription = subscribeToRoom(roomId, (message) => {
      console.log('New message:', message);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);
  
  return <div>Chat Room {roomId}</div>;
}`}</pre>
      </div>

      <h3>Lỗi thường gặp</h3>

      <div className="warning-box">
        <strong>1. Missing Dependencies:</strong>
        <p>Nếu bạn sử dụng state hoặc props trong effect nhưng không thêm vào dependency array, 
        bạn có thể gặp lỗi stale closure.</p>
      </div>

      <div className="code-example">
        <pre>{`// ❌ SAI - Thiếu dependency
function Component() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log(count); // Có thể không phản ánh giá trị mới nhất
  }, []); // Thiếu [count]
}

// ✅ ĐÚNG
function Component() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log(count);
  }, [count]); // Có [count]
}`}</pre>
      </div>

      <div className="warning-box">
        <strong>2. Infinite Loops:</strong>
        <p>Nếu effect cập nhật state và state đó nằm trong dependency array, 
        có thể gây ra vòng lặp vô hạn.</p>
      </div>

      <div className="code-example">
        <pre>{`// ❌ SAI - Infinite loop
function Component() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1); // Cập nhật count
  }, [count]); // count trong dependencies → vòng lặp vô hạn
}

// ✅ ĐÚNG - Sử dụng functional update hoặc điều kiện
function Component() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (count < 10) {
      setCount(prev => prev + 1);
    }
  }, [count]);
}`}</pre>
      </div>

      <h3>useEffect vs Lifecycle Methods</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>Class Components</h4>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>componentDidMount</li>
            <li>componentDidUpdate</li>
            <li>componentWillUnmount</li>
          </ul>
        </div>

        <div style={{ background: '#f3e5f5', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#7b1fa2', marginBottom: '10px' }}>Functional Components</h4>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>useEffect với empty deps</li>
            <li>useEffect với dependencies</li>
            <li>useEffect với cleanup function</li>
          </ul>
        </div>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn thêm dependencies vào dependency array</li>
          <li>Cleanup subscriptions, timers, event listeners</li>
          <li>Tách effects khác nhau thành các useEffect riêng biệt</li>
          <li>Sử dụng ESLint plugin để kiểm tra dependencies</li>
          <li>Tránh side effects trong render phase</li>
        </ul>
      </div>
    </div>
  );
}

export default Effects;

