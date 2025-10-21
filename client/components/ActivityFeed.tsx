import { RecentActivity } from "@shared/api";
import { GitCommit, GitPullRequest, GitBranch, Star, GitFork, FileText } from "lucide-react";

interface ActivityFeedProps {
  activities: RecentActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="h-4 w-4" />;
      case "PullRequestEvent":
        return <GitPullRequest className="h-4 w-4" />;
      case "CreateEvent":
        return <GitBranch className="h-4 w-4" />;
      case "WatchEvent":
        return <Star className="h-4 w-4" />;
      case "ForkEvent":
        return <GitFork className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityDescription = (activity: RecentActivity) => {
    switch (activity.type) {
      case "PushEvent":
        return `Pushed ${activity.payload?.commits || 0} commit(s) to ${activity.repo}`;
      case "PullRequestEvent":
        return `${activity.action} a pull request in ${activity.repo}`;
      case "CreateEvent":
        return `${activity.action} in ${activity.repo}`;
      case "WatchEvent":
        return `Starred ${activity.repo}`;
      case "ForkEvent":
        return `Forked ${activity.repo}`;
      case "IssuesEvent":
        return `${activity.action} an issue in ${activity.repo}`;
      default:
        return `${activity.type.replace("Event", "")} in ${activity.repo}`;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex-shrink-0 mt-1 text-gray-600">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 break-words">
              {getActivityDescription(activity)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getTimeAgo(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
