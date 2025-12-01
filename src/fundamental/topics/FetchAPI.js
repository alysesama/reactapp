import { useState } from 'react';

function FetchAPI() {
  const [exampleData, setExampleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setExampleData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="topic-section">
      <h2>Fetch API and Promises</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Fetch API</strong> là một interface hiện đại trong JavaScript để thực hiện 
          HTTP requests. Nó trả về một <span className="highlight">Promise</span> - một object 
          đại diện cho kết quả của một thao tác bất đồng bộ có thể thành công hoặc thất bại.
        </p>
      </div>

      <h3>Cú pháp cơ bản</h3>
      <div className="code-example">
        <pre>{`// Fetch cơ bản
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}</pre>
      </div>

      <h3>Promise Chain</h3>
      <p>
        Fetch trả về một Promise, bạn có thể chain các .then() để xử lý response:
      </p>

      <div className="code-example">
        <pre>{`fetch('https://api.example.com/users')
  .then(response => {
    // Kiểm tra status code
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse JSON
  })
  .then(data => {
    // Xử lý dữ liệu
    console.log('Users:', data);
    return data;
  })
  .then(users => {
    // Có thể chain thêm
    return users.filter(user => user.active);
  })
  .catch(error => {
    // Xử lý lỗi
    console.error('Fetch error:', error);
  });`}</pre>
      </div>

      <h3>Fetch với Options</h3>
      <p>
        Fetch có thể nhận tham số thứ hai là options object để cấu hình request:
      </p>

      <div className="code-example">
        <pre>{`fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`}</pre>
      </div>

      <h3>Response Methods</h3>
      <p>
        Response object có nhiều methods để đọc dữ liệu:
      </p>

      <div className="code-example">
        <pre>{`fetch('https://api.example.com/data')
  .then(response => {
    // response.json() - Parse JSON
    // response.text() - Parse text
    // response.blob() - Parse binary data
    // response.arrayBuffer() - Parse ArrayBuffer
    
    const contentType = response.headers.get('content-type');
    if (contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  })
  .then(data => console.log(data));`}</pre>
      </div>

      <h3>Error Handling</h3>
      <p>
        Quan trọng: Fetch chỉ reject Promise khi có network error, không reject với HTTP error status:
      </p>

      <div className="code-example">
        <pre>{`fetch('https://api.example.com/data')
  .then(response => {
    // Fetch không tự động reject với 404, 500, etc.
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => {
    // Bắt cả network errors và HTTP errors
    console.error('Error:', error);
  });`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác: Fetch API</h4>
        <button
          onClick={handleFetch}
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
          {loading ? 'Đang tải...' : 'Fetch Data'}
        </button>
        {error && (
          <div style={{ color: '#f44336', marginBottom: '10px' }}>Error: {error}</div>
        )}
        {exampleData && (
          <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
            <pre style={{ margin: 0, fontSize: '0.9rem' }}>
              {JSON.stringify(exampleData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <h3>Promise States</h3>
      <p>
        Promise có 3 trạng thái:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', margin: '20px 0' }}>
        <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#e65100', marginBottom: '8px' }}>Pending</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Đang chờ kết quả</p>
        </div>
        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#2e7d32', marginBottom: '8px' }}>Fulfilled</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Thành công, có dữ liệu</p>
        </div>
        <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#c62828', marginBottom: '8px' }}>Rejected</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Thất bại, có lỗi</p>
        </div>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn kiểm tra response.ok trước khi parse</li>
          <li>Sử dụng .catch() để xử lý errors</li>
          <li>Xử lý timeout cho requests dài</li>
          <li>Sử dụng AbortController để cancel requests</li>
          <li>Validate response data trước khi sử dụng</li>
        </ul>
      </div>
    </div>
  );
}

export default FetchAPI;

