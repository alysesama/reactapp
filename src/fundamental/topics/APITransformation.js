function APITransformation() {
  return (
    <div className="topic-section">
      <h2>API Response Transformation</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>API Response Transformation</strong> là quá trình chuyển đổi dữ liệu từ API 
          response thành format phù hợp với ứng dụng của bạn. API thường trả về dữ liệu theo format 
          của backend, nhưng frontend có thể cần format khác để hiển thị hoặc xử lý dễ dàng hơn.
        </p>
      </div>

      <h3>Tại sao cần Transform?</h3>
      <p>
        API response có thể có structure phức tạp hoặc không phù hợp với component:
      </p>

      <div className="code-example">
        <pre>{`// API Response
{
  "user_id": 123,
  "user_name": "john_doe",
  "user_email": "john@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}

// Frontend cần format khác
{
  id: 123,
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2024-01-01"
}`}</pre>
      </div>

      <h3>Basic Transformation</h3>
      <div className="code-example">
        <pre>{`async function fetchUser(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const apiData = await response.json();
  
  // Transform data
  return {
    id: apiData.user_id,
    name: apiData.user_name,
    email: apiData.user_email,
    createdAt: new Date(apiData.created_at).toLocaleDateString()
  };
}`}</pre>
      </div>

      <h3>Transforming Arrays</h3>
      <p>
        Transform mảng dữ liệu với map():
      </p>

      <div className="code-example">
        <pre>{`async function fetchUsers() {
  const response = await fetch('/api/users');
  const apiData = await response.json();
  
  // Transform array
  return apiData.users.map(user => ({
    id: user.user_id,
    name: user.user_name,
    email: user.user_email,
    isActive: user.status === 'active',
    createdAt: new Date(user.created_at)
  }));
}`}</pre>
      </div>

      <h3>Nested Data Transformation</h3>
      <div className="code-example">
        <pre>{`// API Response với nested structure
{
  "data": {
    "user": {
      "profile": {
        "personal_info": {
          "first_name": "John",
          "last_name": "Doe"
        },
        "contact": {
          "email": "john@example.com",
          "phone": "123-456-7890"
        }
      }
    }
  }
}

// Transform function
function transformUserData(apiResponse) {
  const profile = apiResponse.data.user.profile;
  return {
    firstName: profile.personal_info.first_name,
    lastName: profile.personal_info.last_name,
    fullName: \`\${profile.personal_info.first_name} \${profile.personal_info.last_name}\`,
    email: profile.contact.email,
    phone: profile.contact.phone
  };
}`}</pre>
      </div>

      <h3>Transformation trong React Component</h3>
      <div className="code-example">
        <pre>{`function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    async function loadUsers() {
      const response = await fetch('/api/users');
      const apiData = await response.json();
      
      // Transform ngay khi nhận data
      const transformedUsers = apiData.map(user => ({
        id: user.user_id,
        name: \`\${user.first_name} \${user.last_name}\`,
        email: user.email,
        avatar: user.profile_image_url || '/default-avatar.png',
        role: user.role_name.toUpperCase()
      }));
      
      setUsers(transformedUsers);
    }
    loadUsers();
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}`}</pre>
      </div>

      <h3>Reusable Transform Functions</h3>
      <p>
        Tạo reusable transform functions để tái sử dụng:
      </p>

      <div className="code-example">
        <pre>{`// utils/transformers.js
export function transformUser(apiUser) {
  return {
    id: apiUser.user_id,
    name: \`\${apiUser.first_name} \${apiUser.last_name}\`,
    email: apiUser.email,
    createdAt: new Date(apiUser.created_at),
    isActive: apiUser.status === 'active'
  };
}

export function transformPost(apiPost) {
  return {
    id: apiPost.post_id,
    title: apiPost.post_title,
    content: apiPost.post_content,
    author: transformUser(apiPost.author),
    publishedAt: new Date(apiPost.published_at),
    tags: apiPost.tag_list || []
  };
}

// Sử dụng trong component
import { transformUser, transformPost } from './utils/transformers';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function loadUser() {
      const response = await fetch(\`/api/users/\${userId}\`);
      const apiData = await response.json();
      setUser(transformUser(apiData)); // Sử dụng transform function
    }
    loadUser();
  }, [userId]);
  
  return user ? <UserCard user={user} /> : <Loading />;
}`}</pre>
      </div>

      <h3>Data Normalization</h3>
      <p>
        Normalize nested data thành flat structure:
      </p>

      <div className="code-example">
        <pre>{`// API Response với nested data
{
  "posts": [
    {
      "id": 1,
      "title": "Post 1",
      "author": { "id": 1, "name": "John" }
    },
    {
      "id": 2,
      "title": "Post 2",
      "author": { "id": 1, "name": "John" }
    }
  ]
}

// Normalize thành flat structure
function normalizePosts(apiData) {
  const posts = apiData.posts.map(post => ({
    id: post.id,
    title: post.title,
    authorId: post.author.id
  }));
  
  const authors = apiData.posts.reduce((acc, post) => {
    if (!acc[post.author.id]) {
      acc[post.author.id] = post.author;
    }
    return acc;
  }, {});
  
  return { posts, authors };
}`}</pre>
      </div>

      <h3>Error Handling trong Transformation</h3>
      <div className="code-example">
        <pre>{`function transformUserSafely(apiData) {
  try {
    return {
      id: apiData?.user_id ?? 0,
      name: \`\${apiData?.first_name ?? ''} \${apiData?.last_name ?? ''}\`.trim() || 'Unknown',
      email: apiData?.email ?? '',
      createdAt: apiData?.created_at ? new Date(apiData.created_at) : new Date()
    };
  } catch (error) {
    console.error('Transform error:', error);
    return {
      id: 0,
      name: 'Unknown',
      email: '',
      createdAt: new Date()
    };
  }
}`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Transform data ngay sau khi nhận từ API</li>
          <li>Tạo reusable transform functions</li>
          <li>Xử lý missing/null values một cách an toàn</li>
          <li>Normalize nested data khi cần</li>
          <li>Validate transformed data</li>
          <li>Document transformation logic</li>
        </ul>
      </div>

      <div className="warning-box">
        <strong>Lưu ý:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Không mutate original API data</li>
          <li>Xử lý edge cases (null, undefined, empty arrays)</li>
          <li>Transform có thể tốn performance với large datasets</li>
          <li>Cân nhắc caching transformed data</li>
        </ul>
      </div>
    </div>
  );
}

export default APITransformation;

