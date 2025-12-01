function EnvironmentVariables() {
  return (
    <div className="topic-section">
      <h2>Environment Variables for API Keys</h2>
      
      <div className="definition-box">
        <h4>Định nghĩa</h4>
        <p>
          <strong>Environment Variables</strong> là các biến được định nghĩa bên ngoài code, 
          thường dùng để lưu trữ cấu hình, API keys, và các thông tin nhạy cảm. Trong React, 
          environment variables được truy cập qua <span className="highlight">process.env</span> 
          và phải bắt đầu với <span className="highlight">REACT_APP_</span> để được expose ra client.
        </p>
      </div>

      <h3>Tạo Environment Variables</h3>
      <p>
        Tạo file <span className="highlight">.env</span> trong root directory của project:
      </p>

      <div className="code-example">
        <pre>{`# .env
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_KEY=your_api_key_here
REACT_APP_ENVIRONMENT=development

# Không commit file .env vào git
# Thêm vào .gitignore`}</pre>
      </div>

      <h3>Sử dụng trong Code</h3>
      <div className="code-example">
        <pre>{`// Sử dụng environment variables
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

async function fetchData() {
  const response = await fetch(\`\${API_URL}/users\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`
    }
  });
  return await response.json();
}

// Hoặc sử dụng trực tiếp
fetch(\`\${process.env.REACT_APP_API_URL}/users\`)
  .then(response => response.json())
  .then(data => console.log(data));`}</pre>
      </div>

      <h3>Environment Files</h3>
      <p>
        React hỗ trợ nhiều environment files:
      </p>

      <div className="code-example">
        <pre>{`# .env - Default cho tất cả environments
REACT_APP_API_URL=https://api.example.com

# .env.local - Local overrides (không commit)
REACT_APP_API_KEY=local_key_123

# .env.development - Chỉ cho development
REACT_APP_API_URL=http://localhost:3000/api

# .env.production - Chỉ cho production
REACT_APP_API_URL=https://api.production.com

# .env.test - Chỉ cho testing
REACT_APP_API_URL=http://localhost:3001/api`}</pre>
      </div>

      <h3>Default Values</h3>
      <p>
        Cung cấp default values khi variable không được set:
      </p>

      <div className="code-example">
        <pre>{`// Sử dụng default value
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const API_KEY = process.env.REACT_APP_API_KEY || '';

// Hoặc với destructuring
const {
  REACT_APP_API_URL = 'http://localhost:3000/api',
  REACT_APP_API_KEY = ''
} = process.env;

// Validation
if (!process.env.REACT_APP_API_KEY) {
  console.warn('API_KEY is not set!');
}`}</pre>
      </div>

      <h3>Best Practices cho API Keys</h3>
      <div className="warning-box">
        <strong>Quan trọng về Security:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>KHÔNG commit .env files vào git</li>
          <li>Chỉ expose public API keys (client-side keys)</li>
          <li>Secret keys phải ở server-side, không bao giờ expose</li>
          <li>Sử dụng .env.example để document required variables</li>
          <li>Rotate API keys thường xuyên</li>
        </ul>
      </div>

      <div className="code-example">
        <pre>{`# .env.example (commit vào git)
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_KEY=your_api_key_here
REACT_APP_ENVIRONMENT=development

# .env (KHÔNG commit)
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_KEY=actual_secret_key_here
REACT_APP_ENVIRONMENT=development`}</pre>
      </div>

      <h3>Using trong React Components</h3>
      <div className="code-example">
        <pre>{`function WeatherComponent() {
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const API_URL = process.env.REACT_APP_WEATHER_API_URL;
  
  useEffect(() => {
    async function fetchWeather() {
      const response = await fetch(
        \`\${API_URL}?key=\${API_KEY}&q=London\`
      );
      const data = await response.json();
      console.log(data);
    }
    fetchWeather();
  }, []);
  
  return <div>Weather Component</div>;
}

// Hoặc tạo config object
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  apiKey: process.env.REACT_APP_API_KEY || '',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development'
};

function App() {
  return (
    <div>
      <p>Environment: {config.environment}</p>
      <WeatherComponent />
    </div>
  );
}`}</pre>
      </div>

      <h3>TypeScript với Environment Variables</h3>
      <div className="code-example">
        <pre>{`// src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_API_KEY: string;
    REACT_APP_ENVIRONMENT: 'development' | 'production' | 'test';
  }
}

// Sử dụng với type safety
const API_URL: string = process.env.REACT_APP_API_URL;
const ENV: 'development' | 'production' | 'test' = process.env.REACT_APP_ENVIRONMENT;`}</pre>
      </div>

      <h3>Build-time vs Runtime</h3>
      <div className="info-box">
        <strong>Lưu ý:</strong>
        <p style={{ marginTop: '10px' }}>
          Environment variables trong React được embed vào bundle tại build time, không phải runtime. 
          Điều này có nghĩa là bạn phải rebuild app để thay đổi environment variables có hiệu lực.
        </p>
      </div>

      <div className="code-example">
        <pre>{`// Build command
npm run build

// Environment variables được embed vào bundle
// Không thể thay đổi sau khi build

// Development
npm start
// Sử dụng .env.development

// Production
npm run build
// Sử dụng .env.production`}</pre>
      </div>

      <h3>Gitignore Setup</h3>
      <div className="code-example">
        <pre>{`# .gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Nhưng commit .env.example
# .env.example`}</pre>
      </div>

      <div className="info-box">
        <strong>Best Practices:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Luôn prefix với REACT_APP_ cho client-side variables</li>
          <li>Tạo .env.example để document required variables</li>
          <li>Không commit .env files vào git</li>
          <li>Sử dụng different .env files cho different environments</li>
          <li>Validate required variables khi app start</li>
          <li>Không store sensitive secrets trong client-side code</li>
        </ul>
      </div>
    </div>
  );
}

export default EnvironmentVariables;

