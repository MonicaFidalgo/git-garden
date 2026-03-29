import type { GitHubData } from '@/services/github';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GardenStatsProps {
  data: GitHubData;
}

export function GardenStats({ data }: GardenStatsProps) {
  const topLanguages = Object.entries(data.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const stats = [
    { label: 'Total Commits', value: data.totalCommits.toLocaleString(), icon: '🌱' },
    { label: 'Repositories', value: data.repos.length.toString(), icon: '🌳' },
    { label: 'Current Streak', value: `${data.currentStreak}d`, icon: '🔥' },
    { label: 'Longest Streak', value: `${data.longestStreak}d`, icon: '⭐' },
    { label: 'Followers', value: data.user.followers.toLocaleString(), icon: '🦋' },
  ];

  return (
    <div className="space-y-4">
      <Card className="pixel-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <img
              src={data.user.avatar_url}
              alt={data.user.login}
              className="w-12 h-12 pixel-border"
              style={{ imageRendering: 'pixelated' }}
            />
            <div>
              <CardTitle className="text-sm leading-relaxed">
                {data.user.name || data.user.login}
              </CardTitle>
              <p className="text-lg font-pixel-body text-muted-foreground">
                @{data.user.login}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data.user.bio && (
            <p className="text-lg font-pixel-body text-muted-foreground mb-3">{data.user.bio}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-muted p-2 rounded pixel-shadow">
                <div className="text-xs font-pixel text-muted-foreground leading-relaxed">{stat.icon} {stat.label}</div>
                <div className="text-xl font-pixel-body font-bold text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="pixel-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs leading-relaxed">🌿 Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {topLanguages.map(([lang, count]) => (
              <Badge key={lang} variant="secondary" className="font-pixel-body text-base px-2 py-0.5">
                {lang} ({count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
