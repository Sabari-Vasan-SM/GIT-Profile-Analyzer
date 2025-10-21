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
 * Language statistics
 */
export interface LanguageStats {
  [language: string]: number;
}

/**
 * Recent activity/event
 */
export interface RecentActivity {
  type: string;
  repo: string;
  action?: string;
  createdAt: string;
  payload?: {
    ref?: string;
    size?: number;
    commits?: number;
  };
}

/**
 * Contribution day data for heatmap
 */
export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
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
  location?: string;
  company?: string;
  blog?: string;
  twitter_username?: string;
  hireable?: boolean;
  
  // Extended data
  languages?: LanguageStats;
  recentActivity?: RecentActivity[];
  totalStars?: number;
  totalForks?: number;
  totalPushes?: number;
  totalIssues?: number;
  totalPullRequests?: number;
  contributionHeatmap?: ContributionDay[];
  currentStreak?: number;
  longestStreak?: number;
  topRepositories?: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
  }>;
}

/**
 * Error response type
 */
export interface ErrorResponse {
  error: string;
  message: string;
}
