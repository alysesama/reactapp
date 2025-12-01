import { useState } from 'react';

function AsyncAwait() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWithAsync = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="topic-section">
      <h2>Async/Await Patterns</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>async/await</strong> là cú pháp JavaScript cho phép viết code bất đồng bộ 
          theo cách đồng bộ, dễ đọc hơn so với Promise chains. Function được đánh dấu 
          <span className="highlight"> async</span> sẽ trả về một Promise, và 
          <span className="highlight"> await</span> sẽ chờ Promise resolve trước khi tiếp tục.
        </p>
      </div>

      <h3>Cú pháp cơ bản</h3>
      <div className="code-example">
        <pre>{`// Function async
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}

// Sử dụng
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));`}</pre>
      </div>

      <h3>So sánh Promise vs Async/Await</h3>
      <p>
        Async/await làm code dễ đọc và dễ maintain hơn:
      </p>

      <div className="code-example">
        <pre>{`// ❌ Promise chain (nested)
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(users => {
    return fetch(\`https://api.example.com/users/\${users[0].id}/posts\`);
  })
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.error(error);
  });

// ✅ Async/await (linear)
async function getUserPosts() {
  try {
    const usersResponse = await fetch('https://api.example.com/users');
    const users = await usersResponse.json();
    
    const postsResponse = await fetch(\`https://api.example.com/users/\${users[0].id}/posts\`);
    const posts = await postsResponse.json();
    
    console.log(posts);
  } catch (error) {
    console.error(error);
  }
}`}</pre>
      </div>

      <h3>Error Handling với try/catch</h3>
      <p>
        Async/await sử dụng try/catch để xử lý errors:
      </p>

      <div className="code-example">
        <pre>{`async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    // Có thể throw lại hoặc return default value
    throw error;
  }
}`}</pre>
      </div>

      <h3>Multiple Async Operations</h3>
      <p>
        Có thể chạy nhiều async operations song song hoặc tuần tự:
      </p>

      <div className="code-example">
        <pre>{`// Chạy tuần tự (chậm hơn)
async function fetchSequential() {
  const user = await fetch('/api/user');
  const posts = await fetch('/api/posts');
  const comments = await fetch('/api/comments');
  return { user, posts, comments };
}

// Chạy song song (nhanh hơn)
async function fetchParallel() {
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);
  return { user, posts, comments };
}

// Hoặc với destructuring
async function fetchParallel2() {
  const userPromise = fetch('/api/user').then(r => r.json());
  const postsPromise = fetch('/api/posts').then(r => r.json());
  const commentsPromise = fetch('/api/comments').then(r => r.json());
  
  const user = await userPromise;
  const posts = await postsPromise;
  const comments = await commentsPromise;
  
  return { user, posts, comments };
}`}</pre>
      </div>

      <h3>Async trong React Components</h3>
      <p>
        Sử dụng async/await trong event handlers và useEffect:
      </p>

      <div className="code-example">
        <pre>{`function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [userId]);
  
  const handleSave = async () => {
    try {
      await fetch(\`/api/users/\${userId}\`, {
        method: 'PUT',
        body: JSON.stringify(user)
      });
      alert('Saved!');
    } catch (error) {
      alert('Failed to save');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  return <div>{/* User profile */}</div>;
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác: Async/Await</h4>
        <button
          onClick={fetchWithAsync}
          disabled={loading}
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
          {loading ? 'Đang tải...' : 'Fetch với Async/Await'}
        </button>
        {data && (
          <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Website:</strong> {data.website}</p>
          </div>
        )}
      </div>

      <div className="warning-box">
        <strong>Lưu ý quan trọng:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Không thể sử dụng await ở top-level code (trừ modules ES2022+)</li>
          <li>Async function luôn trả về Promise</li>
          <li>Không thể await trong non-async function</li>
          <li>Luôn sử dụng try/catch để xử lý errors</li>
          <li>Tránh await trong loops, sử dụng Promise.all() thay thế</li>
        </ul>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Ưu tiên async/await cho code dễ đọc</li>
          <li>Sử dụng Promise.all() cho parallel operations</li>
          <li>Luôn xử lý errors với try/catch</li>
          <li>Sử dụng finally để cleanup</li>
          <li>Tránh nested async/await quá sâu</li>
        </ul>
      </div>
    </div>
  );
}

export default AsyncAwait;

