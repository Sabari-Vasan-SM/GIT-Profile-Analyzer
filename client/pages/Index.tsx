import { GitHubCommitResponse, ErrorResponse } from "@shared/api";
import { useMemo, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Loader2,
  Github,
  GitCommit,
  Users,
  Calendar,
  ExternalLink,
  Star,
  GitFork,
  Globe,
  MapPin,
  Link as LinkIcon,
  Building2,
  Twitter,
  Library,
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

  const langTotals = useMemo(() => {
    if (!data?.topLanguages || data.topLanguages.length === 0) return { totalBytes: 0 };
    const totalBytes = data.topLanguages.reduce((s, l) => s + (l.bytes || 0), 0);
    return { totalBytes };
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-10">
          <div className="flex items-center justify-center mb-3 lg:mb-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 lg:p-4">
              <Github className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 lg:mb-3 px-4">
            GitHub Profile Analyzer
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto px-4">
            Search any GitHub user to view profile insights: commits, stars, languages, repos, and more.
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-3xl mx-4 lg:mx-auto mb-6 lg:mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl lg:text-2xl">
              Search GitHub User
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Enter any GitHub username to view their profile analytics
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
          <div className="max-w-6xl mx-4 lg:mx-auto">
            {/* Profile Overview */}
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
                    <div className="flex flex-col md:flex-row md:items-center gap-2 lg:gap-3 mb-2">
                      <h2 className="text-2xl lg:text-3xl font-bold">
                        {data.name || data.username}
                      </h2>
                      <Badge className="w-fit mx-auto md:mx-0 text-sm border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        @{data.username}
                      </Badge>
                    </div>

                    {data.bio && (
                      <p className="text-muted-foreground mb-3 text-base lg:text-lg">
                        {data.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 lg:gap-4 text-sm text-muted-foreground">
                      {data.location && (
                        <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {data.location}</div>
                      )}
                      {data.company && (
                        <div className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {data.company}</div>
                      )}
                      {data.blog && (
                        <a href={data.blog.startsWith("http") ? data.blog : `https://${data.blog}`}
                           target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-1 hover:underline">
                          <Globe className="h-4 w-4" /> Website
                        </a>
                      )}
                      {data.twitter_username && (
                        <a href={`https://twitter.com/${data.twitter_username}`}
                           target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-1 hover:underline">
                          <Twitter className="h-4 w-4" /> @{data.twitter_username}
                        </a>
                      )}
                      {data.created_at && (
                        <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {formatDate(data.created_at)}</div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                      <Button asChild className="border border-input bg-background hover:bg-accent hover:text-accent-foreground">
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
                      {data.organizations && data.organizations.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button className="gap-2 hover:bg-accent hover:text-accent-foreground">
                                <Users className="h-4 w-4" />
                                Orgs: {data.organizations.length}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex items-center gap-2">
                                {data.organizations.slice(0, 6).map((o) => (
                                  <a key={o.login} href={`https://github.com/${o.login}`} target="_blank" rel="noopener noreferrer">
                                    <img src={o.avatar_url} alt={o.login} className="h-6 w-6 rounded-full" />
                                  </a>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-commit-green to-commit-green/80 text-white">
                <CardContent className="pt-6 lg:pt-8">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 lg:p-3">
                      <GitCommit className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs lg:text-sm font-medium uppercase tracking-wide">Total Commits</p>
                      <p className="text-3xl lg:text-4xl font-bold">{data.totalCommits.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-stats-orange to-stats-orange/80 text-white">
                <CardContent className="pt-6 lg:pt-8">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 lg:p-3">
                      <Github className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs lg:text-sm font-medium uppercase tracking-wide">Public Repositories</p>
                      <p className="text-3xl lg:text-4xl font-bold">{data.publicRepos.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 to-indigo-400 text-white">
                <CardContent className="pt-6 lg:pt-8">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 lg:p-3">
                      <Star className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs lg:text-sm font-medium uppercase tracking-wide">Total Stars</p>
                      <p className="text-3xl lg:text-4xl font-bold">{(data.totalStars ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-400 text-white">
                <CardContent className="pt-6 lg:pt-8">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 lg:p-3">
                      <GitFork className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs lg:text-sm font-medium uppercase tracking-wide">Total Forks</p>
                      <p className="text-3xl lg:text-4xl font-bold">{(data.totalForks ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Followers and Gists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
              <Card className="border-0 shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wide">Followers • Following</p>
                      <p className="text-2xl font-bold">{(data.followers ?? 0).toLocaleString()} <span className="text-muted-foreground text-base">/ {(data.following ?? 0).toLocaleString()}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Library className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wide">Public Gists</p>
                      <p className="text-2xl font-bold">{(data.publicGists ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wide">Profile</p>
                      <div className="flex gap-2 flex-wrap">
                        <a className="text-primary hover:underline" href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer">GitHub</a>
                        {data.blog && (
                          <a className="text-primary hover:underline" href={data.blog.startsWith("http") ? data.blog : `https://${data.blog}`} target="_blank" rel="noopener noreferrer">Website</a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Languages and Orgs */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
              {/* Languages */}
              <Card className="border-0 shadow-xl xl:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Top Languages</CardTitle>
                  <CardDescription>Based on repo languages (approximate)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!data.topLanguages || data.topLanguages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No language data available.</p>
                  ) : (
                    data.topLanguages.map((l) => {
                      const pct = langTotals.totalBytes > 0 ? Math.round(((l.bytes || 0) / langTotals.totalBytes) * 100) : 0;
                      return (
                        <div key={l.language} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className="border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">{l.language}</Badge>
                              <span className="text-xs text-muted-foreground">{l.count} repos</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{pct}%</span>
                          </div>
                          <Progress value={pct} />
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              {/* Organizations */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle>Organizations</CardTitle>
                  <CardDescription>Memberships visible on GitHub</CardDescription>
                </CardHeader>
                <CardContent>
                  {!data.organizations || data.organizations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No organizations found.</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {data.organizations.map((o) => (
                        <a key={o.login} href={`https://github.com/${o.login}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                          <img src={o.avatar_url} alt={o.login} className="h-8 w-8 rounded-full" />
                          <span className="text-sm">{o.login}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Repositories */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mt-4 lg:mt-6">
              {/* Top repos */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle>Top Repositories</CardTitle>
                  <CardDescription>Most starred repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  {!data.topRepos || data.topRepos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No repositories to display.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Repository</TableHead>
                          <TableHead className="w-[90px]">Stars</TableHead>
                          <TableHead className="w-[90px]">Forks</TableHead>
                          <TableHead className="w-[140px]">Language</TableHead>
                          <TableHead className="w-[160px]">Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.topRepos.map((r) => (
                          <TableRow key={r.html_url}>
                            <TableCell>
                              <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                                {r.name}
                              </a>
                              {r.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{r.description}</p>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /> {r.stargazers_count}</span>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1"><GitFork className="h-4 w-4" /> {r.forks_count}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className="text-foreground">{r.language || "—"}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(r.updated_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Recent repos */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle>Recently Updated</CardTitle>
                  <CardDescription>Latest activity across repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  {!data.recentRepos || data.recentRepos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent updates found.</p>
                  ) : (
                    <div className="space-y-4">
                      {data.recentRepos.map((r) => (
                        <div key={`${r.html_url}-recent`} className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                              {r.name}
                            </a>
                            {r.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                            )}
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> {r.stargazers_count}</span>
                              <span className="inline-flex items-center gap-1"><GitFork className="h-3 w-3" /> {r.forks_count}</span>
                              <span>{r.language || "—"}</span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.updated_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Footer Note */}
            <Card className="mt-4 lg:mt-6 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="pt-4 lg:pt-6">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Data from GitHub REST API • Commits counted from up to 30 repos • Language bytes approximated • Org list is public memberships only
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
