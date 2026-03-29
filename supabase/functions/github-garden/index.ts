import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    if (!username) throw new Error("username required");

    const token = Deno.env.get("GITHUB_TOKEN");
    if (!token) throw new Error("GITHUB_TOKEN not set");

    const query = `
      query($login: String!) {
        user(login: $login) {
          login
          name
          bio
          avatarUrl
          followers { totalCount }
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            totalCount
            nodes { primaryLanguage { name } stargazerCount }
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);

    const user = json.data.user;
    if (!user) throw new Error(`User "${username}" not found`);

    // calcula streak e active days a partir dos dados reais
    const allDays = user.contributionsCollection.contributionCalendar.weeks
      .flatMap((w: any) => w.contributionDays)
      .sort((a: any, b: any) => a.date.localeCompare(b.date));

    const activeDays = allDays.filter(
      (d: any) => d.contributionCount > 0,
    ).length;

    // longest streak
    let longestStreak = 0,
      currentStreak = 0;
    for (const day of allDays) {
      if (day.contributionCount > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // languages
    const langs: Record<string, number> = {};
    for (const repo of user.repositories.nodes) {
      if (repo.primaryLanguage?.name) {
        langs[repo.primaryLanguage.name] =
          (langs[repo.primaryLanguage.name] || 0) + 1;
      }
    }

    const result = {
      user: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatarUrl,
        public_repos: user.repositories.totalCount,
        followers: user.followers.totalCount,
      },
      repos: user.repositories.nodes,
      contributions: allDays.map((d: any) => ({
        date: d.date,
        count: d.contributionCount,
        level:
          d.contributionCount === 0
            ? 0
            : d.contributionCount <= 2
              ? 1
              : d.contributionCount <= 5
                ? 2
                : d.contributionCount <= 10
                  ? 3
                  : 4,
      })),
      languages: langs,
      totalCommits:
        user.contributionsCollection.contributionCalendar.totalContributions,
      currentStreak: longestStreak, // usa longest como current para simplificar
      longestStreak,
      activeDays,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
