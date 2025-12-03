import { useEffect, useMemo, useState } from "react";
import "./GitHubUserSearch.css";

const GITHUB_API_BASE = "https://api.github.com";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

function GitHubUserSearch() {
    const [username, setUsername] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [repoCache, setRepoCache] = useState(new Map());
    const [sortField, setSortField] = useState("stars");
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText, setDebouncedSearchText] =
        useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError("Vui lòng nhập username");
            return;
        }

        setStatus("loading");
        setError("");
        setUserInfo(null);
        setRepoCache(new Map());
        setSortField("stars");
        setSortOrder("desc");
        setSearchText("");

        try {
            // Fetch user info
            const userResponse = await fetch(
                `${GITHUB_API_BASE}/users/${username.trim()}`
            );

            if (!userResponse.ok) {
                if (userResponse.status === 404) {
                    throw new Error(
                        "Không tìm thấy user này"
                    );
                }
                throw new Error(
                    "Không thể tải thông tin user"
                );
            }

            const userData = await userResponse.json();
            setUserInfo(userData);

            // Fetch all repos (paginate)
            const allRepos = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const reposResponse = await fetch(
                    `${GITHUB_API_BASE}/users/${username.trim()}/repos?sort=updated&per_page=100&page=${page}`
                );

                if (!reposResponse.ok) {
                    break;
                }

                const reposData =
                    await reposResponse.json();

                allRepos.push(...reposData);

                if (reposData.length < 100) {
                    hasMore = false;
                } else {
                    page += 1;
                }

                // safety break to avoid infinite loop
                if (page > 10) {
                    hasMore = false;
                }
            }

            // build cache map for sorting / searching
            const cache = new Map();
            allRepos.forEach((repo) => {
                cache.set(repo.id, repo);
            });
            setRepoCache(cache);

            setStatus("success");
        } catch (err) {
            setStatus("error");
            setError(
                err.message ||
                    "Đã xảy ra lỗi khi tìm kiếm user"
            );
        }
    };

    const handleToggleSortOrder = () => {
        setSortOrder((prev) =>
            prev === "asc" ? "desc" : "asc"
        );
    };

    const handleSortFieldChange = (e) => {
        setSortField(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 400);

        return () => clearTimeout(id);
    }, [searchText]);

    const processedRepos = useMemo(() => {
        const items = Array.from(repoCache.values());

        // keyword search
        const keywords = debouncedSearchText
            .split(",")
            .map((kw) => kw.trim().toLowerCase())
            .filter(Boolean);

        let filtered = items;
        if (keywords.length > 0) {
            filtered = items.filter((repo) => {
                const licenseText =
                    (repo.license &&
                        (repo.license.spdx_id ||
                            repo.license.key)) ||
                    "";
                const topicsText = Array.isArray(
                    repo.topics
                )
                    ? repo.topics.join(" ")
                    : "";
                const haystack = (
                    (repo.name || "") +
                    " " +
                    (repo.description || "") +
                    " " +
                    (repo.language || "") +
                    " " +
                    licenseText +
                    " " +
                    topicsText
                ).toLowerCase();

                // tất cả keyword phải match
                return keywords.every((kw) =>
                    haystack.includes(kw)
                );
            });
        }

        const getPrimaryValue = (repo) => {
            switch (sortField) {
                case "name":
                    return (repo.name || "").toLowerCase();
                case "stars":
                    return repo.stargazers_count || 0;
                case "forks":
                    return repo.forks_count || 0;
                case "watchers":
                    return repo.watchers_count || 0;
                case "created_at":
                    return new Date(
                        repo.created_at
                    ).getTime();
                case "updated_at":
                    return new Date(
                        repo.updated_at
                    ).getTime();
                case "language":
                    return (
                        repo.language || ""
                    ).toLowerCase();
                case "license":
                    return (
                        (repo.license &&
                            (repo.license.spdx_id ||
                                repo.license.key)) ||
                        ""
                    ).toLowerCase();
                default:
                    return repo.stargazers_count || 0;
            }
        };

        const getSecondaryValue = (repo) =>
            (repo.name || "").toLowerCase();

        const sorted = [...filtered].sort((a, b) => {
            const av = getPrimaryValue(a);
            const bv = getPrimaryValue(b);

            if (av < bv) {
                return sortOrder === "asc" ? -1 : 1;
            }
            if (av > bv) {
                return sortOrder === "asc" ? 1 : -1;
            }

            const an = getSecondaryValue(a);
            const bn = getSecondaryValue(b);
            return an.localeCompare(bn);
        });

        return sorted;
    }, [
        repoCache,
        sortField,
        sortOrder,
        debouncedSearchText,
    ]);

    return (
        <div className="github-search">
            <form
                className="github-search__form"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    className="github-search__input"
                    placeholder="Nhập GitHub username..."
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                />
                <button
                    type="submit"
                    className="github-search__button"
                    disabled={status === "loading"}
                >
                    {status === "loading"
                        ? "Đang tìm..."
                        : "Tìm kiếm"}
                </button>
            </form>

            {error && (
                <div className="github-search__error">
                    {error}
                </div>
            )}

            {userInfo && (
                <div className="github-panels">
                    {/* Info Panel - 40% */}
                    <div className="github-panel github-panel--info">
                        <div className="github-info">
                            <div className="github-info__avatar">
                                <img
                                    src={
                                        userInfo.avatar_url
                                    }
                                    alt={userInfo.login}
                                />
                            </div>
                            <div className="github-info__details">
                                <h2 className="github-info__name">
                                    <a
                                        href={
                                            userInfo.html_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="github-info__link"
                                    >
                                        {userInfo.name ||
                                            userInfo.login}
                                    </a>
                                </h2>
                                <p className="github-info__username">
                                    @{userInfo.login}
                                </p>
                                <p className="github-info__bio">
                                    {userInfo.bio ||
                                        "No bio available."}
                                </p>
                                <div className="github-info__stats">
                                    <div className="github-stat">
                                        <span className="github-stat__label">
                                            Repos
                                        </span>
                                        <span className="github-stat__value">
                                            {
                                                userInfo.public_repos
                                            }
                                        </span>
                                    </div>
                                    <div className="github-stat">
                                        <span className="github-stat__label">
                                            Followers
                                        </span>
                                        <span className="github-stat__value">
                                            {
                                                userInfo.followers
                                            }
                                        </span>
                                    </div>
                                    <div className="github-stat">
                                        <span className="github-stat__label">
                                            Following
                                        </span>
                                        <span className="github-stat__value">
                                            {
                                                userInfo.following
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="github-info__extra">
                                    <div className="github-info__row">
                                        <span className="github-info__row-label">
                                            Company:
                                        </span>
                                        <span className="github-info__row-value">
                                            {userInfo.company ||
                                                "None"}
                                        </span>
                                    </div>
                                    <div className="github-info__row">
                                        <span className="github-info__row-label">
                                            Location:
                                        </span>
                                        <span className="github-info__row-value">
                                            {userInfo.location
                                                ? userInfo.location
                                                      .charAt(
                                                          0
                                                      )
                                                      .toUpperCase() +
                                                  userInfo.location.slice(
                                                      1
                                                  )
                                                : null ||
                                                  "None"}
                                        </span>
                                    </div>
                                    <div className="github-info__row">
                                        <span className="github-info__row-label">
                                            Website:
                                        </span>
                                        <span className="github-info__row-value">
                                            {userInfo.blog ? (
                                                <a
                                                    href={
                                                        userInfo.blog
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {
                                                        userInfo.blog
                                                    }
                                                </a>
                                            ) : (
                                                "None"
                                            )}
                                        </span>
                                    </div>
                                    <div className="github-info__row">
                                        <span className="github-info__row-label">
                                            Twitter:
                                        </span>
                                        <span className="github-info__row-value">
                                            {userInfo.twitter_username ? (
                                                <a
                                                    href={`https://twitter.com/${userInfo.twitter_username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    @
                                                    {
                                                        userInfo.twitter_username
                                                    }
                                                </a>
                                            ) : (
                                                "None"
                                            )}
                                        </span>
                                    </div>
                                    <div className="github-info__row">
                                        <span className="github-info__row-label">
                                            Email:
                                        </span>
                                        <span className="github-info__row-value">
                                            {userInfo.email ||
                                                "None"}
                                        </span>
                                    </div>
                                    <div className="github-info__row">
                                        <span className="github-info__row-label">
                                            Account created:
                                        </span>
                                        <span className="github-info__row-value">
                                            {formatDate(
                                                userInfo.created_at
                                            )}
                                        </span>
                                    </div>
                                    <div className="github-info__row">
                                        <span className="github-info__row-label">
                                            Last activity:
                                        </span>
                                        <span className="github-info__row-value">
                                            {formatDate(
                                                userInfo.updated_at
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Repo List Panel - 60% */}
                    <div className="github-panel github-panel--repos">
                        <div className="github-repos">
                            <div className="github-repos__header">
                                <h3 className="github-repos__title">
                                    Repositories (
                                    {processedRepos.length})
                                </h3>
                                <div className="github-repos__controls">
                                    <button
                                        type="button"
                                        className="github-repos__sort-toggle"
                                        onClick={
                                            handleToggleSortOrder
                                        }
                                    >
                                        {sortOrder === "asc"
                                            ? "↑"
                                            : "↓"}
                                    </button>
                                    <select
                                        className="github-repos__sort-select"
                                        value={sortField}
                                        onChange={
                                            handleSortFieldChange
                                        }
                                    >
                                        <option value="stars">
                                            Stars
                                        </option>
                                        <option value="name">
                                            Repo name
                                        </option>
                                        <option value="forks">
                                            Forks
                                        </option>
                                        <option value="watchers">
                                            Watchers
                                        </option>
                                        <option value="created_at">
                                            Create time
                                        </option>
                                        <option value="updated_at">
                                            Last update
                                        </option>
                                        <option value="language">
                                            Language
                                        </option>
                                        <option value="license">
                                            License
                                        </option>
                                    </select>
                                    <input
                                        type="text"
                                        className="github-repos__search-input"
                                        placeholder="Search by keyword (name, desc, language, license)..."
                                        value={searchText}
                                        onChange={
                                            handleSearchChange
                                        }
                                    />
                                </div>
                            </div>
                            {processedRepos.length === 0 ? (
                                <div className="github-repos__empty">
                                    Không có repository nào
                                </div>
                            ) : (
                                <div className="github-repos__grid">
                                    {processedRepos.map(
                                        (repo) => (
                                            <div
                                                key={
                                                    repo.id
                                                }
                                                className="github-repo-item"
                                            >
                                                <a
                                                    href={
                                                        repo.html_url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="github-repo-item__name"
                                                >
                                                    {
                                                        repo.name
                                                    }
                                                </a>
                                                <p className="github-repo-item__description">
                                                    {repo.description ||
                                                        "Không có mô tả cho repository này."}
                                                </p>
                                                <div className="github-repo-item__topics">
                                                    {Array.isArray(
                                                        repo.topics
                                                    ) &&
                                                    repo
                                                        .topics
                                                        .length >
                                                        0 ? (
                                                        repo.topics.map(
                                                            (
                                                                topic
                                                            ) => (
                                                                <a
                                                                    key={
                                                                        topic
                                                                    }
                                                                    href={`https://github.com/topics/${topic}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="github-repo-item__topic-pill"
                                                                >
                                                                    {
                                                                        topic
                                                                    }
                                                                </a>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="github-repo-item__topic-empty">
                                                            Không
                                                            có
                                                            topic
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="github-repo-item__meta">
                                                    <div className="github-repo-item__meta-top">
                                                        <div className="github-repo-item__meta-left">
                                                            {repo.language ? (
                                                                <a
                                                                    href={`https://github.com/search?q=language:${repo.language}&type=repositories`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="github-repo-item__meta-link"
                                                                >
                                                                    {
                                                                        repo.language
                                                                    }
                                                                </a>
                                                            ) : (
                                                                <span className="github-repo-item__meta-text">
                                                                    N/A
                                                                </span>
                                                            )}
                                                            <a
                                                                href={`${repo.html_url}/stargazers`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="github-repo-item__meta-link"
                                                            >
                                                                ⭐{" "}
                                                                {
                                                                    repo.stargazers_count
                                                                }
                                                            </a>
                                                            <a
                                                                href={`${repo.html_url}/network/members`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="github-repo-item__meta-link"
                                                            >
                                                                🍴{" "}
                                                                {
                                                                    repo.forks_count
                                                                }
                                                            </a>
                                                            <a
                                                                href={`${repo.html_url}/watchers`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="github-repo-item__meta-link"
                                                            >
                                                                👁{" "}
                                                                {
                                                                    repo.watchers_count
                                                                }
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="github-repo-item__meta-bottom">
                                                        <div className="github-repo-item__meta-license">
                                                            {repo.license ? (
                                                                repo
                                                                    .license
                                                                    .url ? (
                                                                    <a
                                                                        href={
                                                                            repo
                                                                                .license
                                                                                .url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="github-repo-item__meta-link"
                                                                    >
                                                                        {repo
                                                                            .license
                                                                            .spdx_id ||
                                                                            repo
                                                                                .license
                                                                                .key ||
                                                                            "License"}
                                                                    </a>
                                                                ) : (
                                                                    <span className="github-repo-item__meta-text">
                                                                        {repo
                                                                            .license
                                                                            .spdx_id ||
                                                                            repo
                                                                                .license
                                                                                .key ||
                                                                            "License"}
                                                                    </span>
                                                                )
                                                            ) : (
                                                                <span className="github-repo-item__meta-text">
                                                                    N/A
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="github-repo-item__update">
                                                            Cập
                                                            nhật:{" "}
                                                            {formatDate(
                                                                repo.updated_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
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
