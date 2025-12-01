function JSONDataStructures() {
  return (
    <div className="topic-section">
      <h2>JSON Data Structures</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>JSON (JavaScript Object Notation)</strong> là một định dạng dữ liệu nhẹ, 
          dễ đọc và dễ parse. JSON được sử dụng rộng rãi để trao đổi dữ liệu giữa client và server. 
          JSON chỉ hỗ trợ các kiểu dữ liệu cơ bản: strings, numbers, booleans, null, objects, và arrays.
        </p>
      </div>

      <h3>Cấu trúc JSON cơ bản</h3>
      <div className="code-example">
        <pre>{`// Object JSON
{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "email": "john@example.com"
}

// Array JSON
[
  { "id": 1, "name": "Item 1" },
  { "id": 2, "name": "Item 2" },
  { "id": 3, "name": "Item 3" }
]

// Nested structures
{
  "user": {
    "id": 123,
    "name": "John",
    "address": {
      "street": "123 Main St",
      "city": "New York"
    }
  },
  "posts": [
    { "id": 1, "title": "Post 1" },
    { "id": 2, "title": "Post 2" }
  ]
}`}</pre>
      </div>

      <h3>JSON.parse() và JSON.stringify()</h3>
      <p>
        JavaScript cung cấp 2 methods chính để làm việc với JSON:
      </p>

      <div className="code-example">
        <pre>{`// JSON.stringify() - Chuyển JavaScript object thành JSON string
const user = {
  name: 'John',
  age: 30,
  isActive: true
};

const jsonString = JSON.stringify(user);
console.log(jsonString);
// Output: {"name":"John","age":30,"isActive":true}

// JSON.parse() - Chuyển JSON string thành JavaScript object
const jsonString = '{"name":"John","age":30,"isActive":true}';
const user = JSON.parse(jsonString);
console.log(user.name); // Output: John`}</pre>
      </div>

      <h3>Làm việc với JSON trong React</h3>
      <div className="code-example">
        <pre>{`// Fetch và parse JSON
async function fetchUsers() {
  const response = await fetch('/api/users');
  const users = await response.json(); // Tự động parse JSON
  return users;
}

// Gửi JSON data
async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData) // Chuyển object thành JSON string
  });
  return await response.json();
}

// Sử dụng trong component
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    async function loadUsers() {
      const data = await fetchUsers();
      setUsers(data);
    }
    loadUsers();
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`}</pre>
      </div>

      <h3>Xử lý nested JSON</h3>
      <p>
        Khi làm việc với nested structures, sử dụng optional chaining và nullish coalescing:
      </p>

      <div className="code-example">
        <pre>{`// JSON response từ API
const response = {
  "data": {
    "user": {
      "profile": {
        "name": "John",
        "email": "john@example.com"
      }
    }
  }
};

// ❌ Có thể gây lỗi nếu structure không đúng
const name = response.data.user.profile.name;

// ✅ Safe với optional chaining
const name = response?.data?.user?.profile?.name ?? 'Unknown';

// ✅ Hoặc với destructuring
const { name = 'Unknown', email = '' } = response?.data?.user?.profile ?? {};`}</pre>
      </div>

      <h3>Validating JSON</h3>
      <p>
        Luôn validate JSON data trước khi sử dụng:
      </p>

      <div className="code-example">
        <pre>{`function parseJSONSafely(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (error) {
    console.error('Invalid JSON:', error);
    return { success: false, error: error.message };
  }
}

// Sử dụng
const result = parseJSONSafely('{"name":"John"}');
if (result.success) {
  console.log(result.data);
} else {
  console.error('Parse failed:', result.error);
}`}</pre>
      </div>

      <h3>JSON Limitations</h3>
      <div className="warning-box">
        <strong>JSON không hỗ trợ:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Functions - Không thể serialize functions</li>
          <li>Undefined - Sẽ bị bỏ qua khi stringify</li>
          <li>Dates - Sẽ được chuyển thành strings</li>
          <li>Circular references - Gây lỗi khi stringify</li>
          <li>Symbols - Sẽ bị bỏ qua</li>
        </ul>
      </div>

      <div className="code-example">
        <pre>{`// ❌ Functions sẽ bị bỏ qua
const obj = {
  name: 'John',
  greet: function() { return 'Hello'; }
};
JSON.stringify(obj); // {"name":"John"}

// ❌ Dates sẽ thành string
const obj = { date: new Date() };
JSON.stringify(obj); // {"date":"2024-01-01T00:00:00.000Z"}

// ✅ Cần convert dates manually
const obj = {
  date: new Date().toISOString()
};
JSON.stringify(obj); // {"date":"2024-01-01T00:00:00.000Z"}

// ✅ Parse lại dates
const parsed = JSON.parse(jsonString);
const date = new Date(parsed.date);`}</pre>
      </div>

      <h3>Common JSON Patterns</h3>
      <div className="code-example">
        <pre>{`// API Response wrapper
{
  "success": true,
  "data": {
    "users": [...]
  },
  "message": "Users fetched successfully"
}

// Error response
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}

// Paginated response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "totalPages": 10
  }
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn validate JSON trước khi parse</li>
          <li>Sử dụng try/catch khi parse JSON</li>
          <li>Kiểm tra structure với optional chaining</li>
          <li>Xử lý dates và special types cẩn thận</li>
          <li>Sử dụng consistent response format</li>
        </ul>
      </div>
    </div>
  );
}

export default JSONDataStructures;

