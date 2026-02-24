import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";

/**
 * Loading Component: A reusable UI element shown 
 * while waiting for API responses.
 */
const Loading = () => <div className="loader">Loading GitHub Data...</div>;

/**
 * SearchPage: The landing page. 
 * Allows users to search for GitHub usernames via the Express backend.
 */
function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetches a list of users matching the search query from the backend API
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/search/${query}`);
      setUsers(res.data.items || []);
    } catch (err) {
      alert("Search failed. Please ensure the backend server is running.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>GitHub Explorer</h1>
      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Username..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {/* Conditional Rendering: Show loader if fetching, otherwise show results */}
      {loading ? (
        <Loading />
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div
              key={user.id}
              className="card"
              onClick={() => navigate(`/user/${user.login}`)}
            >
              <img src={user.avatar_url} alt="profile" />
              <h3>{user.login}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * UserPage: Displays the profile details and a list 
 * of repositories for a specific GitHub user.
 */
function UserPage() {
  const { username } = useParams(); // Retrieves username from URL parameters
  const [data, setData] = useState(null);

  // Trigger API call on component mount or when the username change
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/user/${username}`)
      .then((res) => setData(res.data))
      .catch(err => console.error("Error fetching user data", err));
  }, [username]);

  if (!data) return <Loading />;

  return (
    <div className="container">
      <Link to="/" className="back-link">← Back to Search</Link>
      <div className="profile-header">
        <img src={data.profile.avatar_url} width="120" alt="avatar" />
        <h2>{data.profile.name || data.profile.login}</h2>
        <p>{data.profile.bio}</p>
        <a href={data.profile.html_url} target="_blank" rel="noreferrer" className="external-link">
          View on GitHub
        </a>
      </div>
      
      <h3>Repositories</h3>
      <ul className="repo-links">
        {data.repos.map((repo) => (
          <li key={repo.id}>
            <Link to={`/repo/${username}/${repo.name}`}>{repo.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * RepoPage: Displays detailed information about a single 
 * repository, including the latest 5 commits.
 */
function RepoPage() {
  const { username, repoName } = useParams();
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/repo/${username}/${repoName}`)
      .then((res) => setRepo(res.data))
      .catch(err => console.error("Error fetching repo data", err));
  }, [username, repoName]);

  if (!repo) return <Loading />;

  return (
    <div className="container">
      <Link to={`/user/${username}`} className="back-link">← Back to {username}</Link>
      <h2>{repo.details.name}</h2>
      <p><strong>Description:</strong> {repo.details.description || "No description"}</p>
      <p><strong>Created:</strong> {new Date(repo.details.created_at).toLocaleDateString()}</p>
      <p><strong>Last Commit:</strong> {new Date(repo.details.pushed_at).toLocaleDateString()}</p>
      
      <h3>Last 5 Commits:</h3>
      <ul className="commit-list">
        {repo.commits.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Main App Component: Handles the client-side routing logic.
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route path="/repo/:username/:repoName" element={<RepoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
