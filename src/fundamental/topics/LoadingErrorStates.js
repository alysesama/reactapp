import { useState } from 'react';

function LoadingErrorStates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const simulateLoading = () => {
    setLoading(true);
    setError('');
    setData(null);
    setTimeout(() => {
      setLoading(false);
      setData({ message: 'Data loaded successfully!' });
    }, 2000);
  };

  const simulateError = () => {
    setLoading(true);
    setError('');
    setData(null);
    setTimeout(() => {
      setLoading(false);
      setError('Failed to load data. Please try again.');
    }, 2000);
  };

  return (
    <div className="topic-section">
      <h2>Handling Loading and Error States</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          Khi làm việc với async operations (API calls, data fetching), bạn cần xử lý 
          3 trạng thái chính: <span className="highlight">loading</span> (đang tải), 
          <span className="highlight">success</span> (thành công), và 
          <span className="highlight">error</span> (lỗi). Việc hiển thị đúng trạng thái 
          giúp cải thiện UX và giúp người dùng hiểu được điều gì đang xảy ra.
        </p>
      </div>

      <h3>Pattern cơ bản</h3>
      <div className="code-example">
        <pre>{`function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;
  
  return <div>{/* Render data */}</div>;
}`}</pre>
      </div>

      <h3>Loading States</h3>
      <p>
        Hiển thị loading indicator khi đang fetch data:
      </p>

      <div className="code-example">
        <pre>{`function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading users...</p>
      </div>
    );
  }
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}`}</pre>
      </div>

      <h3>Error States</h3>
      <p>
        Xử lý và hiển thị errors một cách user-friendly:
      </p>

      <div className="code-example">
        <pre>{`function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to load user');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);
  
  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="error-container">
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  return <UserCard user={user} />;
}`}</pre>
      </div>

      <h3>Combined State với useReducer</h3>
      <p>
        Sử dụng useReducer cho complex state management:
      </p>

      <div className="code-example">
        <pre>{`const initialState = {
  data: null,
  loading: false,
  error: null
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function DataComponent() {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  
  useEffect(() => {
    async function fetchData() {
      dispatch({ type: 'FETCH_START' });
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    }
    fetchData();
  }, []);
  
  if (state.loading) return <LoadingSpinner />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <DataDisplay data={state.data} />;
}`}</pre>
      </div>

      <h3>Error Boundaries</h3>
      <p>
        Sử dụng Error Boundaries để catch errors trong component tree:
      </p>

      <div className="code-example">
        <pre>{`class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Sử dụng
function App() {
  return (
    <ErrorBoundary>
      <UserList />
    </ErrorBoundary>
  );
}`}</pre>
      </div>

      <div className="interactive-demo">
        <h4>Ví dụ tương tác: Loading & Error States</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button
            onClick={simulateLoading}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Simulate Loading
          </button>
          <button
            onClick={simulateError}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Simulate Error
          </button>
        </div>
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>⏳</div>
            <p>Loading...</p>
          </div>
        )}
        {error && (
          <div
            style={{
              padding: '15px',
              background: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '5px',
              color: '#c62828'
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}
        {data && !loading && (
          <div
            style={{
              padding: '15px',
              background: '#e8f5e9',
              border: '1px solid #4caf50',
              borderRadius: '5px',
              color: '#2e7d32'
            }}
          >
            <strong>Success:</strong> {data.message}
          </div>
        )}
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn hiển thị loading state khi fetch data</li>
          <li>Hiển thị error messages rõ ràng, dễ hiểu</li>
          <li>Cung cấp retry mechanism cho errors</li>
          <li>Sử dụng Error Boundaries cho unexpected errors</li>
          <li>Log errors để debug (nhưng không hiển thị technical details cho users)</li>
        </ul>
      </div>
    </div>
  );
}

export default LoadingErrorStates;

