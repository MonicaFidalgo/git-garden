import { supabase } from "@/integrations/supabase/client";

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  updated_at: string;
  description: string | null;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  contributions: ContributionDay[];
  languages: Record<string, number>;
  totalCommits: number;
  currentStreak: number;
  longestStreak: number;
}

export async function fetchAllGitHubData(
  username: string,
): Promise<GitHubData> {
  const { data, error } = await supabase.functions.invoke("github-garden", {
    body: { username },
  });

  if (error) throw new Error(error.message);
  if (data.error) throw new Error(data.error);

  return data;
}
