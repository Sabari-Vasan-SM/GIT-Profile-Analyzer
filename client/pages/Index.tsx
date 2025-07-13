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
} from "lucide-react";

export default function Index() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GitHubCommitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center mb-4 lg:mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 lg:p-4">
              <Github className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 px-4">
            GitHub Commit Tracker
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Discover the coding journey of any GitHub developer. Enter a
            username to explore their contribution history and commit
            statistics.
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
          <div className="max-w-4xl mx-4 lg:mx-auto">
            {/* User Profile Card */}
            <Card className="mb-6 lg:mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="pt-6 lg:pt-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 lg:gap-6">
                  <Avatar className="h-20 w-20 lg:h-24 lg:w-24 border-4 border-primary/20">
                    <AvatarImage src={data.avatar_url} alt={data.username} />
                    <AvatarFallback className="text-xl lg:text-2xl font-bold">
                      {data.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 lg:gap-3 mb-3">
                      <h2 className="text-2xl lg:text-3xl font-bold">
                        {data.name || data.username}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="w-fit mx-auto md:mx-0 text-sm"
                      >
                        @{data.username}
                      </Badge>
                    </div>

                    {data.bio && (
                      <p className="text-muted-foreground mb-4 text-base lg:text-lg">
                        {data.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 lg:gap-4 text-sm text-muted-foreground">
                      {data.followers !== undefined && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {data.followers.toLocaleString()}
                          </span>{" "}
                          followers
                        </div>
                      )}
                      {data.following !== undefined && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {data.following.toLocaleString()}
                          </span>{" "}
                          following
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
                      <Button variant="outline" asChild>
                        <a
                          href={`https://github.com/${data.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View on GitHub
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {/* Total Commits */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-commit-green to-commit-green/80 text-white">
                <CardContent className="pt-6 lg:pt-8">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 lg:p-3">
                      <GitCommit className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs lg:text-sm font-medium uppercase tracking-wide">
                        Total Commits
                      </p>
                      <p className="text-3xl lg:text-4xl font-bold">
                        {data.totalCommits.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Public Repositories */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-stats-orange to-stats-orange/80 text-white">
                <CardContent className="pt-6 lg:pt-8">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 lg:p-3">
                      <Github className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs lg:text-sm font-medium uppercase tracking-wide">
                        Public Repositories
                      </p>
                      <p className="text-3xl lg:text-4xl font-bold">
                        {data.publicRepos.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <Card className="mt-4 lg:mt-6 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="pt-4 lg:pt-6">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Data fetched from the GitHub API • Showing commits from up
                    to 30 most recent repositories
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
