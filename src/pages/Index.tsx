import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DemoGarden } from "@/components/garden/DemoGarden";
import { Search, Compass, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

const FEATURED_USERS = [
  "torvalds",
  "gaearon",
  "sindresorhus",
  "tj",
  "yyx990803",
  "ThePrimeagen",
];

const Index = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/garden/${username.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="font-pixel text-xs text-foreground">GitGarden</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="font-pixel-body text-lg"
            onClick={() => navigate("/explore")}
          >
            <Compass className="w-4 h-4 mr-1" /> Explore
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            className="font-pixel-body text-lg pixel-shadow"
          >
            <Github className="w-4 h-4 mr-1" /> Sign in
          </Button> */}
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-4 pt-12 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-pixel text-foreground leading-relaxed mb-4">
            Your GitHub,
            <br />
            <span className="text-primary">as a garden</span>
          </h1>
          <p className="text-2xl md:text-3xl font-pixel-body text-muted-foreground max-w-lg mx-auto">
            Watch your code contributions bloom into a living pixel art garden.
            Every commit grows a flower, every repo plants a tree.
          </p>
        </div>

        {/* Demo Garden */}
        <div className="flex justify-center mb-10">
          <div className="pixel-border rounded bg-card p-2">
            <DemoGarden />
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 max-w-md mx-auto mb-16"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 font-pixel-body text-xl h-12 pixel-shadow"
            />
          </div>
          <Button
            type="submit"
            className="font-pixel-body text-xl h-12 px-6 pixel-shadow"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Grow
          </Button>
        </form>

        {/* Featured Gardens */}
        <div className="text-center mb-6">
          <h2 className="text-xs font-pixel text-muted-foreground leading-relaxed">
            🌿 Featured Gardens
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURED_USERS.map((user) => (
            <button
              key={user}
              onClick={() => navigate(`/garden/${user}`)}
              className="bg-card border border-border rounded p-3 pixel-shadow hover:scale-[1.02] transition-transform text-left"
            >
              <div className="flex items-center gap-2">
                <img
                  src={`https://github.com/${user}.png?size=40`}
                  alt={user}
                  className="w-8 h-8 rounded"
                  style={{ imageRendering: "pixelated" }}
                />
                <div>
                  <p className="font-pixel text-[10px] text-foreground leading-relaxed">
                    {user}
                  </p>
                  <p className="text-sm font-pixel-body text-muted-foreground">
                    View garden →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
