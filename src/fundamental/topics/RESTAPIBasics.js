function RESTAPIBasics() {
  return (
    <div className="topic-section">
      <h2>REST API Basics</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>REST (Representational State Transfer)</strong> là một kiến trúc web service 
          sử dụng các phương thức HTTP chuẩn để thao tác với tài nguyên. Các phương thức chính 
          bao gồm <span className="highlight">GET</span>, <span className="highlight">POST</span>, 
          <span className="highlight">PUT</span>, và <span className="highlight">DELETE</span>.
        </p>
      </div>

      <h3>Các phương thức HTTP cơ bản</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#2e7d32', marginBottom: '10px' }}>GET</h4>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            Lấy dữ liệu từ server. Không thay đổi dữ liệu, chỉ đọc.
          </p>
        </div>

        <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#e65100', marginBottom: '10px' }}>POST</h4>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            Tạo tài nguyên mới trên server. Gửi dữ liệu trong request body.
          </p>
        </div>

        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>PUT</h4>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            Cập nhật toàn bộ tài nguyên. Thay thế dữ liệu hiện có.
          </p>
        </div>

        <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ color: '#c62828', marginBottom: '10px' }}>DELETE</h4>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            Xóa tài nguyên khỏi server.
          </p>
        </div>
      </div>

      <h3>Ví dụ sử dụng</h3>

      <div className="code-example">
        <pre>{`// GET - Lấy danh sách users
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data));

// POST - Tạo user mới
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));

// PUT - Cập nhật user
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));

// DELETE - Xóa user
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})
  .then(response => {
    if (response.ok) {
      console.log('User đã được xóa');
    }
  });`}</pre>
      </div>

      <h3>HTTP Status Codes</h3>
      <p>
        Server trả về status code để báo hiệu kết quả của request:
      </p>

      <div className="code-example">
        <pre>{`// 2xx - Success
200 OK - Request thành công
201 Created - Tài nguyên đã được tạo
204 No Content - Thành công nhưng không có content trả về

// 4xx - Client Error
400 Bad Request - Request không hợp lệ
401 Unauthorized - Cần authentication
404 Not Found - Không tìm thấy tài nguyên

// 5xx - Server Error
500 Internal Server Error - Lỗi server
503 Service Unavailable - Service không khả dụng`}</pre>
      </div>

      <h3>RESTful URL Patterns</h3>
      <p>
        REST API thường sử dụng URL patterns nhất quán:
      </p>

      <div className="code-example">
        <pre>{`// Collection resources
GET    /api/users          // Lấy tất cả users
POST   /api/users          // Tạo user mới

// Individual resources
GET    /api/users/123       // Lấy user có id 123
PUT    /api/users/123       // Cập nhật user 123
DELETE /api/users/123       // Xóa user 123

// Nested resources
GET    /api/users/123/posts // Lấy posts của user 123`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Sử dụng danh từ số nhiều cho collection endpoints (/users, /posts)</li>
          <li>Luôn sử dụng HTTPS trong production</li>
          <li>Xử lý errors một cách nhất quán</li>
          <li>Sử dụng proper HTTP status codes</li>
          <li>API responses nên có cấu trúc nhất quán</li>
        </ul>
      </div>

      <div className="warning-box">
        <strong>Lưu ý quan trọng:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>GET requests không nên có side effects (không thay đổi dữ liệu)</li>
          <li>POST và PUT cần gửi Content-Type header</li>
          <li>DELETE requests thường không cần body</li>
          <li>Luôn validate dữ liệu trước khi gửi request</li>
        </ul>
      </div>
    </div>
  );
}

export default RESTAPIBasics;

