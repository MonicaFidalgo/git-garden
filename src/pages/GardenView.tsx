import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllGitHubData, type GitHubData } from '@/services/github';
import { PixelGarden } from '@/components/garden/PixelGarden';
import { GardenStats } from '@/components/garden/GardenStats';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Download, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const GardenView = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gardenContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    fetchAllGitHubData(username)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [username]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Garden link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleDownload = () => {
    const canvas = gardenContainerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${username}-garden.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Garden downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-pixel text-sm text-muted-foreground leading-relaxed">
            Growing {username}'s garden...
          </p>
          <p className="font-pixel-body text-xl text-muted-foreground mt-2">
            🌱 Planting seeds from GitHub...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🥀</p>
          <p className="font-pixel text-sm text-destructive leading-relaxed mb-2">
            Garden Not Found
          </p>
          <p className="font-pixel-body text-xl text-muted-foreground mb-6">
            {error || `Could not find "${username}" on GitHub`}
          </p>
          <Button onClick={() => navigate('/')} variant="outline" className="pixel-shadow font-pixel-body text-lg">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="font-pixel-body text-lg">
            <ArrowLeft className="w-4 h-4 mr-1" /> Home
          </Button>
          <span className="font-pixel text-xs text-foreground">🌱 {username}'s Garden</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="font-pixel-body text-lg pixel-shadow">
            <Share2 className="w-4 h-4 mr-1" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="font-pixel-body text-lg pixel-shadow">
            <Download className="w-4 h-4 mr-1" /> PNG
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Garden Canvas */}
          <div ref={gardenContainerRef} className="pixel-border rounded bg-card p-3 flex justify-center items-start overflow-auto">
            <PixelGarden data={data} width={250} height={140} />
          </div>

          {/* Stats Sidebar */}
          <div className="order-first lg:order-last">
            <GardenStats data={data} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GardenView;
