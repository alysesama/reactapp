import { useState } from 'react';
import './GitHubUserSearch.css';

const GITHUB_API_BASE = 'https://api.github.com';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

function GitHubUserSearch() {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Vui lòng nhập username');
      return;
    }

    setStatus('loading');
    setError('');
    setUserInfo(null);
    setRepos([]);

    try {
      // Fetch user info
      const userResponse = await fetch(`${GITHUB_API_BASE}/users/${username.trim()}`);
      
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error('Không tìm thấy user này');
        }
        throw new Error('Không thể tải thông tin user');
      }

      const userData = await userResponse.json();
      setUserInfo(userData);

      // Fetch repos
      const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${username.trim()}/repos?sort=updated&per_page=100`);
      
      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        setRepos(reposData);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Đã xảy ra lỗi khi tìm kiếm user');
    }
  };

  return (
    <div className="github-search">
      <form className="github-search__form" onSubmit={handleSearch}>
        <input
          type="text"
          className="github-search__input"
          placeholder="Nhập GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="github-search__button" disabled={status === 'loading'}>
          {status === 'loading' ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      {error && <div className="github-search__error">{error}</div>}

      {userInfo && (
        <div className="github-panels">
          {/* Info Panel - 40% */}
          <div className="github-panel github-panel--info">
            <div className="github-info">
              <div className="github-info__avatar">
                <img src={userInfo.avatar_url} alt={userInfo.login} />
              </div>
              <div className="github-info__details">
                <h2 className="github-info__name">
                  <a
                    href={userInfo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-info__link"
                  >
                    {userInfo.name || userInfo.login}
                  </a>
                </h2>
                <p className="github-info__username">@{userInfo.login}</p>
                {userInfo.bio && <p className="github-info__bio">{userInfo.bio}</p>}
                <div className="github-info__stats">
                  <div className="github-stat">
                    <span className="github-stat__label">Repos</span>
                    <span className="github-stat__value">{userInfo.public_repos}</span>
                  </div>
                  <div className="github-stat">
                    <span className="github-stat__label">Followers</span>
                    <span className="github-stat__value">{userInfo.followers}</span>
                  </div>
                  <div className="github-stat">
                    <span className="github-stat__label">Following</span>
                    <span className="github-stat__value">{userInfo.following}</span>
                  </div>
                </div>
                {userInfo.location && (
                  <p className="github-info__location">📍 {userInfo.location}</p>
                )}
                {userInfo.blog && (
                  <p className="github-info__blog">
                    <a href={userInfo.blog} target="_blank" rel="noopener noreferrer">
                      🔗 {userInfo.blog}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Repo List Panel - 60% */}
          <div className="github-panel github-panel--repos">
            <div className="github-repos">
              <h3 className="github-repos__title">
                Repositories ({repos.length})
              </h3>
              {repos.length === 0 ? (
                <div className="github-repos__empty">Không có repository nào</div>
              ) : (
                <div className="github-repos__grid">
                  {repos.map((repo) => (
                    <div key={repo.id} className="github-repo-item">
                      <div className="github-repo-item__header">
                        <img
                          src={repo.owner.avatar_url}
                          alt={repo.owner.login}
                          className="github-repo-item__avatar"
                        />
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="github-repo-item__name"
                        >
                          {repo.name}
                        </a>
                      </div>
                      {repo.description && (
                        <p className="github-repo-item__description">{repo.description}</p>
                      )}
                      <div className="github-repo-item__meta">
                        <span className="github-repo-item__stars">
                          ⭐ {repo.stargazers_count}
                        </span>
                        <span className="github-repo-item__update">
                          Cập nhật: {formatDate(repo.updated_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GitHubUserSearch;

