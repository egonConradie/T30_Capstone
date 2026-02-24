const express = require("express");
const axios = require("axios");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Security and Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// 1. Search Users
app.get("/api/search/:username", async (req, res) => {
  try {
    const result = await axios.get(
      `https://api.github.com/search/users?q=${req.params.username}`,
    );
    res.json(result.data);
  } catch (error) {
    res.status(500).send("Error searching GitHub");
  }
});

// 2. User Profile and Repos
app.get("/api/user/:username", async (req, res) => {
  try {
    const user = await axios.get(
      `https://api.github.com/users/${req.params.username}`,
    );
    const repos = await axios.get(
      `https://api.github.com/users/${req.params.username}/repos`,
    );
    res.json({ profile: user.data, repos: repos.data });
  } catch (error) {
    res.status(500).send("Error fetching user");
  }
});

// 3. Repo Details and 5 Commits
app.get("/api/repo/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const repoData = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
    );
    const commits = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
    );
    res.json({
      details: repoData.data,
      commits: commits.data.map((c) => c.commit.message),
    });
  } catch (error) {
    res.status(500).send("Error fetching repo");
  }
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
