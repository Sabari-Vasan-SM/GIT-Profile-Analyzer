import { RequestHandler } from "express";
import { GitHubCommitResponse, ErrorResponse, LanguageStats, RecentActivity, ContributionDay } from "@shared/api";

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
      `https://api.github.com/users/${username}/repos?type=all&per_page=100&sort=updated`,
    );

    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();

    // Count total commits across all repositories
    let totalCommits = 0;
    let totalPushes = 0;
    let totalStars = 0;
    let totalForks = 0;
    const languages: LanguageStats = {};

    // Get top repositories
    const topRepositories = repos
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description || "No description",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "Unknown",
        url: repo.html_url,
      }));

    // Calculate totals
    repos.forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
    });

    // We'll use a simplified approach - for production apps, you'd want to implement pagination
    // and handle rate limiting more carefully
    const commitPromises = repos.slice(0, 30).map(async (repo: any) => {
      try {
        // Fetch commits
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

    // Fetch languages for top repos
    const languagePromises = repos.slice(0, 30).map(async (repo: any) => {
      try {
        const langResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/languages`,
        );
        if (langResponse.ok) {
          return await langResponse.json();
        }
        return {};
      } catch (error) {
        console.error(`Error fetching languages for ${repo.name}:`, error);
        return {};
      }
    });

    // Fetch recent activity
    let recentActivity: RecentActivity[] = [];
    try {
      const eventsResponse = await fetch(
        `https://api.github.com/users/${username}/events/public?per_page=10`,
      );
      if (eventsResponse.ok) {
        const events = await eventsResponse.json();
        recentActivity = events.map((event: any) => {
          const activity: RecentActivity = {
            type: event.type,
            repo: event.repo.name,
            createdAt: event.created_at,
          };

          // Add specific details based on event type
          if (event.type === "PushEvent") {
            totalPushes++;
            activity.payload = {
              commits: event.payload.commits?.length || 0,
              ref: event.payload.ref,
            };
          } else if (event.type === "CreateEvent") {
            activity.action = `Created ${event.payload.ref_type}`;
          } else if (event.type === "PullRequestEvent") {
            activity.action = event.payload.action;
          } else if (event.type === "IssuesEvent") {
            activity.action = event.payload.action;
          }

          return activity;
        }).slice(0, 10);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }

    const [commitCounts, repoLanguages] = await Promise.all([
      Promise.all(commitPromises),
      Promise.all(languagePromises),
    ]);

    totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);

    // Aggregate languages
    repoLanguages.forEach((repoLangs) => {
      Object.entries(repoLangs).forEach(([lang, bytes]) => {
        languages[lang] = (languages[lang] || 0) + (bytes as number);
      });
    });

    // Generate contribution heatmap (last 365 days)
    const contributionHeatmap: ContributionDay[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Generate semi-random contribution count (in production, fetch from GitHub GraphQL API)
      const count = Math.floor(Math.random() * 10);
      const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4;
      
      contributionHeatmap.push({
        date: dateString,
        count,
        level,
      });
    }

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
      location: userData.location,
      company: userData.company,
      blog: userData.blog,
      twitter_username: userData.twitter_username,
      hireable: userData.hireable,
      // Extended data
      languages,
      recentActivity,
      totalStars,
      totalForks,
      totalPushes,
      contributionHeatmap,
      topRepositories,
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
