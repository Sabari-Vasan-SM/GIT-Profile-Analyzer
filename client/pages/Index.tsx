import { GitHubCommitResponse, ErrorResponse } from "@shared/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Github,
  GitCommit,
  Users,
  Calendar,
  ExternalLink,
  Star,
  GitFork,
  MapPin,
  Building2,
  Link as LinkIcon,
  Twitter,
  TrendingUp,
  GitPullRequest,
  AlertCircle,
} from "lucide-react";
import { LanguageChart } from "@/components/LanguageChart";
import { ContributionHeatmap } from "@/components/ContributionHeatmap";
import { ActivityFeed } from "@/components/ActivityFeed";
import { AnimatedStatCard } from "@/components/AnimatedStatCard";
import { StreakDisplay } from "@/components/StreakDisplay";

export default function Index() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GitHubCommitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Modal state
  const [showModal, setShowModal] = useState(() => {
    return localStorage.getItem("github_api_agreement") !== "true";
  });
  const [agreementChecked, setAgreementChecked] = useState(false);

  // No need for useEffect to check agreement, handled in initial state

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/github/${username.trim()}`);

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.message);
      }

      const userData = (await response.json()) as GitHubCommitResponse;
      setData(userData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100">
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center relative">
            <h2 className="text-xl font-bold mb-3 text-gray-900">Notice</h2>
            <p className="mb-4 text-gray-700">
              This site uses the GitHub API. Due to API rate limits, some features may not function properly at times.
            </p>
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="agreement"
                checked={agreementChecked}
                onChange={e => setAgreementChecked(e.target.checked)}
                className="accent-primary h-5 w-5"
              />
              <label htmlFor="agreement" className="text-gray-800 text-base select-none">
                I understand and agree.
              </label>
            </div>
            <button
              className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${agreementChecked ? "bg-primary hover:bg-primary/90" : "bg-gray-400 cursor-not-allowed"}`}
              disabled={!agreementChecked}
              onClick={() => {
                localStorage.setItem("github_api_agreement", "true");
                setShowModal(false);
              }}
            >
              Continue
            </button>
            <div className="mt-6 text-xs text-gray-500 w-full border-t pt-3 text-center">
              Designed and developed by Sabarivasan.
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center mb-4 lg:mb-6">
            <div className="bg-gradient-to-br from-primary to-primary/70 rounded-full p-4 shadow-lg">
              <Github className="h-10 w-10 lg:h-14 lg:w-14 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-4 px-4 drop-shadow-lg">
            GitHub Profile Analyzer
          </h1>
          <p className="text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto px-4">
            Explore detailed GitHub statistics, contributions, and profile insights. Enter a username to get started.
          </p>
        </div>

        {/* Search Form */}
  <Card className="max-w-2xl mx-4 lg:mx-auto mb-6 lg:mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl lg:text-2xl">
              Search GitHub User
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Enter any GitHub username to view their total commits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 text-base lg:text-lg h-11 lg:h-12"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !username.trim()}
                className="h-11 lg:h-12 px-6 lg:px-8 text-base lg:text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 lg:h-5 lg:w-5 animate-spin" />
                    <span className="sm:inline">Searching...</span>
                  </>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="sm:inline">Search</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Error State */}
        {error && (
          <Card className="max-w-2xl mx-4 lg:mx-auto mb-6 lg:mb-8 border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-destructive rounded-full flex-shrink-0" />
                <p className="text-destructive font-medium text-sm lg:text-base">
                  {error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {data && (
          <div className="max-w-6xl mx-4 lg:mx-auto space-y-6">
            {/* User Profile Card - Expanded Info */}
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="pt-8 pb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-28 w-28 border-4 border-primary/30 shadow-lg">
                    <AvatarImage src={data.avatar_url} alt={data.username} />
                    <AvatarFallback className="text-3xl font-bold">
                      {data.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {data.name || data.username}
                      </h2>
                      <Badge className="w-fit mx-auto md:mx-0">
                        @{data.username}
                      </Badge>
                      {data.hireable && (
                        <Badge className="w-fit mx-auto md:mx-0 bg-green-100 text-green-700 hover:bg-green-200">
                          Available for hire
                        </Badge>
                      )}
                    </div>
                    {data.bio && (
                      <p className="text-gray-700 mb-4 text-base">
                        {data.bio}
                      </p>
                    )}
                    
                    {/* Extended profile info */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-gray-600 mb-3">
                      {data.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {data.location}
                        </div>
                      )}
                      {data.company && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {data.company}
                        </div>
                      )}
                      {data.blog && (
                        <a href={data.blog.startsWith('http') ? data.blog : `https://${data.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                          <LinkIcon className="h-4 w-4" />
                          {data.blog}
                        </a>
                      )}
                      {data.twitter_username && (
                        <a href={`https://twitter.com/${data.twitter_username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                          <Twitter className="h-4 w-4" />
                          @{data.twitter_username}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                      {data.followers !== undefined && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {data.followers.toLocaleString()}
                          </span> followers
                        </div>
                      )}
                      {data.following !== undefined && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {data.following.toLocaleString()}
                          </span> following
                        </div>
                      )}
                      {data.publicRepos !== undefined && (
                        <div className="flex items-center gap-1">
                          <Github className="h-4 w-4" />
                          <span className="font-medium">
                            {data.publicRepos.toLocaleString()}
                          </span> repos
                        </div>
                      )}
                      {data.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {formatDate(data.created_at)}
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <a
                        href={`https://github.com/${data.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-primary border-primary hover:bg-primary/10 transition"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Streak Display */}
            {data.currentStreak !== undefined && data.longestStreak !== undefined && (
              <StreakDisplay 
                currentStreak={data.currentStreak} 
                longestStreak={data.longestStreak} 
              />
            )}

            {/* Animated Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <AnimatedStatCard
                icon={GitCommit}
                label="Total Commits"
                value={data.totalCommits}
                color="green"
                delay={0}
              />
              {data.totalPushes !== undefined && (
                <AnimatedStatCard
                  icon={TrendingUp}
                  label="Total Pushes"
                  value={data.totalPushes}
                  color="blue"
                  delay={100}
                />
              )}
              {data.totalStars !== undefined && (
                <AnimatedStatCard
                  icon={Star}
                  label="Total Stars"
                  value={data.totalStars}
                  color="yellow"
                  delay={200}
                />
              )}
              {data.totalForks !== undefined && (
                <AnimatedStatCard
                  icon={GitFork}
                  label="Total Forks"
                  value={data.totalForks}
                  color="purple"
                  delay={300}
                />
              )}
              {data.totalIssues !== undefined && (
                <AnimatedStatCard
                  icon={AlertCircle}
                  label="Total Issues"
                  value={data.totalIssues}
                  color="red"
                  delay={400}
                />
              )}
              {data.totalPullRequests !== undefined && (
                <AnimatedStatCard
                  icon={GitPullRequest}
                  label="Pull Requests"
                  value={data.totalPullRequests}
                  color="indigo"
                  delay={500}
                />
              )}
            </div>

            {/* Contribution Heatmap */}
            {data.contributionHeatmap && data.contributionHeatmap.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Contribution Activity</CardTitle>
                  <CardDescription>Last 365 days of contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContributionHeatmap contributions={data.contributionHeatmap} />
                </CardContent>
              </Card>
            )}

            {/* Two Column Layout - Languages & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Programming Languages */}
              {data.languages && Object.keys(data.languages).length > 0 && (
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Programming Languages</CardTitle>
                    <CardDescription>Most used languages by bytes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LanguageChart languages={data.languages} />
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
              {data.recentActivity && data.recentActivity.length > 0 && (
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Activity</CardTitle>
                    <CardDescription>Latest public events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ActivityFeed activities={data.recentActivity} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Top Repositories */}
            {data.topRepositories && data.topRepositories.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Top Repositories</CardTitle>
                  <CardDescription>Most starred repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.topRepositories.map((repo, index) => (
                      <a
                        key={index}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 border rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {repo.name}
                          </h3>
                          <Badge className="ml-2 flex-shrink-0">{repo.language}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {repo.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {repo.stars.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-4 w-4" />
                            {repo.forks.toLocaleString()}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer Info */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Data fetched from the GitHub API • Showing detailed statistics and contributions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
  )}
      </div>
    </div>
  );
}
