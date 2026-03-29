import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';

const COMMUNITY_GARDENS = [
  { username: 'torvalds', description: 'Linux creator' },
  { username: 'gaearon', description: 'React core team' },
  { username: 'sindresorhus', description: 'Open source machine' },
  { username: 'tj', description: 'Express.js creator' },
  { username: 'yyx990803', description: 'Vue.js creator' },
  { username: 'ThePrimeagen', description: 'Content creator & dev' },
  { username: 'antirez', description: 'Redis creator' },
  { username: 'mitchellh', description: 'HashiCorp co-founder' },
  { username: 'addyosmani', description: 'Chrome engineering' },
  { username: 'kentcdodds', description: 'Testing & React educator' },
  { username: 'getify', description: 'YDKJS author' },
  { username: 'wycats', description: 'Ember.js co-creator' },
];

const Explore = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = COMMUNITY_GARDENS.filter((g) =>
    g.username.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/garden/${search.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="font-pixel-body text-lg">
            <ArrowLeft className="w-4 h-4 mr-1" /> Home
          </Button>
          <span className="font-pixel text-xs text-foreground">🌿 Explore Gardens</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-pixel text-foreground leading-relaxed mb-2">
            Explore Gardens
          </h1>
          <p className="font-pixel-body text-2xl text-muted-foreground">
            Discover beautiful gardens grown by developers around the world
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search or enter username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 font-pixel-body text-xl h-11 pixel-shadow"
            />
          </div>
          <Button type="submit" className="font-pixel-body text-xl h-11 px-5 pixel-shadow">
            Visit
          </Button>
        </form>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((garden) => (
            <button
              key={garden.username}
              onClick={() => navigate(`/garden/${garden.username}`)}
              className="bg-card border border-border rounded p-4 pixel-shadow hover:scale-[1.02] transition-transform text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={`https://github.com/${garden.username}.png?size=48`}
                  alt={garden.username}
                  className="w-10 h-10 rounded"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div>
                  <p className="font-pixel text-[10px] text-foreground leading-relaxed">{garden.username}</p>
                  <p className="text-base font-pixel-body text-muted-foreground">{garden.description}</p>
                </div>
              </div>
              <div className="bg-muted rounded p-2 flex items-center justify-center">
                <span className="font-pixel-body text-lg text-muted-foreground">🌱 View garden →</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explore;
