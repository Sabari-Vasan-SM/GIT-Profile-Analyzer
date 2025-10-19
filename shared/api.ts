/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Response type for GitHub user commit data
 */
export interface GitHubCommitResponse {
  username: string;
  totalCommits: number;
  publicRepos: number;
  publicGists?: number;
  contributionsData?: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        contributionCount: number;
        date: string;
      }>;
    }>;
  };
  avatar_url?: string;
  name?: string;
  bio?: string;
  created_at?: string;
  followers?: number;
  following?: number;
  location?: string | null;
  blog?: string | null;
  company?: string | null;
  twitter_username?: string | null;
  totalStars?: number; // sum of stargazers_count across repos
  totalForks?: number; // sum of forks_count across repos
  topLanguages?: Array<{ language: string; count: number; bytes?: number }>;
  topRepos?: RepoInfo[]; // top by stars
  recentRepos?: RepoInfo[]; // recent by updated_at
  organizations?: OrgInfo[];
}

/**
 * Error response type
 */
export interface ErrorResponse {
  error: string;
  message: string;
}

// Lightweight repository info for UI lists
export interface RepoInfo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string; // ISO
}

// Minimal org info for chips/avatars
export interface OrgInfo {
  login: string;
  avatar_url: string;
  url: string; // html_url if available
}
