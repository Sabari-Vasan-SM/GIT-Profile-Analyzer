import { RequestHandler } from "express";
import {
  GitHubCommitResponse,
  ErrorResponse,
  RepoInfo,
  OrgInfo,
} from "@shared/api";

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
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch user basic info
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      { headers },
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
      { headers },
    );

    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
    }

  const repos: any[] = await reposResponse.json();

    // Count total commits across all repositories
    let totalCommits = 0;
  // Aggregate stars, forks, languages
  let totalStars = 0;
  let totalForks = 0;
  const languageCounts = new Map<string, { count: number; bytes: number }>();

    // We'll use a simplified approach - for production apps, you'd want to implement pagination
    // and handle rate limiting more carefully
    const commitPromises = repos.slice(0, 30).map(async (repo: any) => {
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=100`,
          { headers },
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

    // Aggregate stars/forks and language counts from the repos list
    for (const r of repos) {
      if (typeof r.stargazers_count === "number") totalStars += r.stargazers_count;
      if (typeof r.forks_count === "number") totalForks += r.forks_count;
      const lang = r.language as string | null;
      if (lang) {
        const prev = languageCounts.get(lang) || { count: 0, bytes: 0 };
        languageCounts.set(lang, { count: prev.count + 1, bytes: prev.bytes });
      }
    }

    // Optionally refine bytes via languages API for a few top repos to avoid heavy rate use
    const langDetailPromises = repos.slice(0, 10).map(async (r) => {
      try {
  const lr = await fetch(`https://api.github.com/repos/${r.owner.login}/${r.name}/languages`, { headers });
        if (!lr.ok) return;
        const obj = (await lr.json()) as Record<string, number>;
        Object.entries(obj).forEach(([lang, bytes]) => {
          const prev = languageCounts.get(lang) || { count: 0, bytes: 0 };
          languageCounts.set(lang, { count: prev.count, bytes: prev.bytes + (bytes || 0) });
        });
      } catch (e) {
        // ignore per-repo errors
      }
    });
    await Promise.all(langDetailPromises);

    const topLanguages = Array.from(languageCounts.entries())
      .map(([language, v]) => ({ language, count: v.count, bytes: v.bytes }))
      .sort((a, b) => (b.bytes || 0) - (a.bytes || 0) || b.count - a.count)
      .slice(0, 8);

    // Build RepoInfo lists
    const toRepoInfo = (r: any): RepoInfo => ({
      name: r.name,
      html_url: r.html_url,
      description: r.description,
      stargazers_count: r.stargazers_count ?? 0,
      forks_count: r.forks_count ?? 0,
      language: r.language,
      updated_at: r.updated_at,
    });
    const topRepos: RepoInfo[] = [...repos]
      .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
      .slice(0, 5)
      .map(toRepoInfo);
    const recentRepos: RepoInfo[] = [...repos]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
      .map(toRepoInfo);

    // Organizations
    let organizations: OrgInfo[] = [];
    try {
  const orgsResp = await fetch(`https://api.github.com/users/${username}/orgs`, { headers });
      if (orgsResp.ok) {
        const orgs = await orgsResp.json();
        organizations = (orgs as any[]).map((o) => ({
          login: o.login,
          avatar_url: o.avatar_url,
          url: o.url || `https://github.com/${o.login}`,
        }));
      }
    } catch (e) {
      // ignore orgs fetch error
    }

    const response: GitHubCommitResponse = {
      username: userData.login,
      totalCommits,
      publicRepos: userData.public_repos,
      publicGists: userData.public_gists,
      avatar_url: userData.avatar_url,
      name: userData.name,
      bio: userData.bio,
      created_at: userData.created_at,
      followers: userData.followers,
      following: userData.following,
      location: userData.location,
      blog: userData.blog,
      company: userData.company,
      twitter_username: userData.twitter_username,
      totalStars,
      totalForks,
      topLanguages,
      topRepos,
      recentRepos,
      organizations,
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
