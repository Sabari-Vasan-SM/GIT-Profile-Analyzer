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
}

/**
 * Error response type
 */
export interface ErrorResponse {
  error: string;
  message: string;
}
