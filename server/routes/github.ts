import { RequestHandler } from "express";
import { GitHubCommitResponse, ErrorResponse } from "@shared/api";

export const handleGitHubUser: RequestHandler = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    const errorResponse: ErrorResponse = {
      error: "Missing username",
      message: "Please provide a GitHub username",
    };
    return res.status(400).json(errorResponse);
  }

  try {
    // Fetch user basic info
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
    );

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        const errorResponse: ErrorResponse = {
          error: "User not found",
          message: `GitHub user '${username}' does not exist`,
        };
        return res.status(404).json(errorResponse);
      }
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    // Fetch user repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?type=all&per_page=100`,
    );

    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();

    // Count total commits across all repositories
    let totalCommits = 0;

    // We'll use a simplified approach - for production apps, you'd want to implement pagination
    // and handle rate limiting more carefully
    const commitPromises = repos.slice(0, 30).map(async (repo: any) => {
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=100`,
        );

        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          return commits.length;
        }
        return 0;
      } catch (error) {
        console.error(`Error fetching commits for ${repo.name}:`, error);
        return 0;
      }
    });

    const commitCounts = await Promise.all(commitPromises);
    totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);

    const response: GitHubCommitResponse = {
      username: userData.login,
      totalCommits,
      publicRepos: userData.public_repos,
      avatar_url: userData.avatar_url,
      name: userData.name,
      bio: userData.bio,
      created_at: userData.created_at,
      followers: userData.followers,
      following: userData.following,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal server error",
      message: "Failed to fetch GitHub data. Please try again later.",
    };
    res.status(500).json(errorResponse);
  }
};
