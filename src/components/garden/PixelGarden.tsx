import { useEffect, useRef, useCallback } from 'react';
import type { GitHubData } from '@/services/github';

// Language → plant color mapping
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f0d000',
  TypeScript: '#ffb7c5',
  Python: '#4b8b3b',
  Rust: '#c17d11',
  Go: '#00add8',
  Ruby: '#cc342d',
  Java: '#b07219',
  'C++': '#6866fb',
  C: '#a8b9cc',
  PHP: '#8892be',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

const PIXEL = 4;

interface PixelGardenProps {
  data: GitHubData;
  width?: number;
  height?: number;
  animated?: boolean;
  className?: string;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function drawPixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PIXEL, y * PIXEL, w * PIXEL, h * PIXEL);
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, height: number, leafColor: string, rand: () => number) {
  const trunkH = Math.max(3, Math.floor(height * 0.4));
  const canopyH = height - trunkH;
  const trunkW = Math.max(1, Math.floor(height / 8));
  
  // Trunk
  for (let ty = 0; ty < trunkH; ty++) {
    drawPixelRect(ctx, x, groundY - trunkH + ty, trunkW, 1, '#6b4226');
  }
  
  // Canopy (circular-ish)
  const canopyW = Math.max(3, Math.floor(height / 2));
  for (let cy = 0; cy < canopyH; cy++) {
    const rowW = Math.max(1, Math.floor(canopyW * Math.sin((cy / canopyH) * Math.PI)));
    const ox = x - Math.floor(rowW / 2) + Math.floor(trunkW / 2);
    for (let cx = 0; cx < rowW; cx++) {
      if (rand() > 0.15) {
        const shade = rand() > 0.5 ? leafColor : darkenColor(leafColor, 20);
        drawPixelRect(ctx, ox + cx, groundY - trunkH - canopyH + cy, 1, 1, shade);
      }
    }
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, groundY: number, height: number, color: string, rand: () => number) {
  const stemH = Math.max(2, height - 2);
  
  // Stem
  for (let sy = 0; sy < stemH; sy++) {
    drawPixelRect(ctx, x, groundY - stemH + sy, 1, 1, '#4a7c3f');
  }
  
  // Leaves
  if (stemH > 3 && rand() > 0.3) {
    drawPixelRect(ctx, x - 1, groundY - Math.floor(stemH / 2), 1, 1, '#5a9c4f');
    drawPixelRect(ctx, x + 1, groundY - Math.floor(stemH / 2) - 1, 1, 1, '#5a9c4f');
  }
  
  // Petals
  const petalY = groundY - stemH - 1;
  drawPixelRect(ctx, x, petalY, 1, 1, color);
  drawPixelRect(ctx, x - 1, petalY, 1, 1, color);
  drawPixelRect(ctx, x + 1, petalY, 1, 1, color);
  drawPixelRect(ctx, x, petalY - 1, 1, 1, color);
  drawPixelRect(ctx, x, petalY + 1, 1, 1, color);
  // Center
  drawPixelRect(ctx, x, petalY, 1, 1, '#fff3a0');
}

function drawBush(ctx: CanvasRenderingContext2D, x: number, groundY: number, size: number, color: string, rand: () => number) {
  const w = Math.max(3, size);
  const h = Math.max(2, Math.floor(size * 0.6));
  for (let by = 0; by < h; by++) {
    const rowW = Math.max(1, Math.floor(w * Math.sin(((by + 1) / (h + 1)) * Math.PI)));
    const ox = x - Math.floor(rowW / 2);
    for (let bx = 0; bx < rowW; bx++) {
      if (rand() > 0.1) {
        drawPixelRect(ctx, ox + bx, groundY - h + by, 1, 1, rand() > 0.4 ? color : darkenColor(color, 15));
      }
    }
  }
}

function drawMushroom(ctx: CanvasRenderingContext2D, x: number, groundY: number, rand: () => number) {
  // Stem
  drawPixelRect(ctx, x, groundY - 1, 1, 1, '#f5f0e0');
  drawPixelRect(ctx, x, groundY - 2, 1, 1, '#f5f0e0');
  // Cap
  const capColor = rand() > 0.5 ? '#e04040' : '#d06030';
  drawPixelRect(ctx, x - 1, groundY - 3, 3, 1, capColor);
  drawPixelRect(ctx, x, groundY - 4, 1, 1, capColor);
  // Spots
  if (rand() > 0.5) drawPixelRect(ctx, x - 1, groundY - 3, 1, 1, '#ffffff');
  if (rand() > 0.5) drawPixelRect(ctx, x + 1, groundY - 3, 1, 1, '#ffffff');
}

function drawWater(ctx: CanvasRenderingContext2D, x: number, groundY: number, width: number, frame: number) {
  for (let wx = 0; wx < width; wx++) {
    const waveOffset = Math.sin((wx + frame * 0.05) * 0.5) > 0 ? 0 : 1;
    drawPixelRect(ctx, x + wx, groundY - waveOffset, 1, 1, '#4a90d9');
    drawPixelRect(ctx, x + wx, groundY + 1 - waveOffset, 1, 1, '#3a70b9');
    // Light reflection
    if ((wx + Math.floor(frame * 0.02)) % 5 === 0) {
      drawPixelRect(ctx, x + wx, groundY - waveOffset, 1, 1, '#7ab8f5');
    }
  }
}

function drawButterfly(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, color: string) {
  const wingOpen = Math.sin(frame * 0.1) > 0;
  drawPixelRect(ctx, x, y, 1, 1, '#333');
  if (wingOpen) {
    drawPixelRect(ctx, x - 1, y - 1, 1, 1, color);
    drawPixelRect(ctx, x + 1, y - 1, 1, 1, color);
    drawPixelRect(ctx, x - 1, y, 1, 1, color);
    drawPixelRect(ctx, x + 1, y, 1, 1, color);
  } else {
    drawPixelRect(ctx, x - 1, y, 1, 1, color);
    drawPixelRect(ctx, x + 1, y, 1, 1, color);
  }
}

function drawSunflower(ctx: CanvasRenderingContext2D, x: number, groundY: number, rand: () => number) {
  const stemH = 4 + Math.floor(rand() * 3);
  for (let sy = 0; sy < stemH; sy++) {
    drawPixelRect(ctx, x, groundY - stemH + sy, 1, 1, '#4a7c3f');
  }
  const headY = groundY - stemH - 1;
  // Petals (yellow)
  drawPixelRect(ctx, x, headY - 1, 1, 1, '#ffd700');
  drawPixelRect(ctx, x, headY + 1, 1, 1, '#ffd700');
  drawPixelRect(ctx, x - 1, headY, 1, 1, '#ffd700');
  drawPixelRect(ctx, x + 1, headY, 1, 1, '#ffd700');
  // Center (brown)
  drawPixelRect(ctx, x, headY, 1, 1, '#7b3f00');
}

function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Simple V-shape in dark grey
  drawPixelRect(ctx, x - 2, y, 1, 1, '#444444');
  drawPixelRect(ctx, x - 1, y - 1, 1, 1, '#444444');
  drawPixelRect(ctx, x, y, 1, 1, '#444444');
  drawPixelRect(ctx, x + 1, y - 1, 1, 1, '#444444');
  drawPixelRect(ctx, x + 2, y, 1, 1, '#444444');
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const color = '#ffffff';
  drawPixelRect(ctx, x + 1, y, 3, 1, color);
  drawPixelRect(ctx, x, y + 1, 5, 1, color);
  drawPixelRect(ctx, x + 1, y + 2, 3, 1, color);
}

function drawHedgehog(ctx: CanvasRenderingContext2D, x: number, groundY: number, flip: boolean) {
  const d = flip ? -1 : 1;
  // Body (brown oval)
  drawPixelRect(ctx, x, groundY - 2, 3, 2, '#8b5e3c');
  // Head
  drawPixelRect(ctx, x + 2 * d + (flip ? 0 : 1), groundY - 3, 2, 2, '#c49a6c');
  // Eye
  drawPixelRect(ctx, x + 2 * d + (flip ? 0 : 2), groundY - 3, 1, 1, '#1a1a1a');
  // Spines (dark tips on body)
  drawPixelRect(ctx, x + 1, groundY - 4, 1, 1, '#4a3020');
  drawPixelRect(ctx, x + 2, groundY - 4, 1, 1, '#4a3020');
  drawPixelRect(ctx, x, groundY - 3, 1, 1, '#6a4030');
  // Legs
  drawPixelRect(ctx, x, groundY - 1, 1, 1, '#7a4e2c');
  drawPixelRect(ctx, x + 2, groundY - 1, 1, 1, '#7a4e2c');
}

function drawDeer(ctx: CanvasRenderingContext2D, x: number, groundY: number, flip: boolean) {
  const d = flip ? -1 : 1;
  // Body
  drawPixelRect(ctx, x, groundY - 4, 5, 3, '#c8854a');
  // Neck + head
  drawPixelRect(ctx, x + 4 * d + (flip ? 1 : 0), groundY - 6, 2, 3, '#c8854a');
  drawPixelRect(ctx, x + 4 * d + (flip ? 0 : 1), groundY - 7, 3, 2, '#d4956a');
  // Eye
  drawPixelRect(ctx, x + 4 * d + (flip ? 0 : 3), groundY - 7, 1, 1, '#1a1a1a');
  // Antlers
  drawPixelRect(ctx, x + 4 * d + (flip ? 1 : 2), groundY - 9, 1, 2, '#7a5030');
  drawPixelRect(ctx, x + 4 * d + (flip ? 0 : 3), groundY - 9, 1, 1, '#7a5030');
  drawPixelRect(ctx, x + 4 * d + (flip ? 2 : 1), groundY - 9, 1, 1, '#7a5030');
  // Legs
  drawPixelRect(ctx, x + 1, groundY - 1, 1, 2, '#a06030');
  drawPixelRect(ctx, x + 3, groundY - 1, 1, 2, '#a06030');
  // White tail spot
  drawPixelRect(ctx, flip ? x : x + 4, groundY - 4, 1, 2, '#f5f0e0');
}

function drawFox(ctx: CanvasRenderingContext2D, x: number, groundY: number, flip: boolean) {
  const hx = flip ? x : x + 4;
  const tx = flip ? x + 6 : x;
  // Tail
  drawPixelRect(ctx, tx, groundY - 3, 3, 2, '#e05020');
  drawPixelRect(ctx, tx + (flip ? -1 : 2), groundY - 4, 2, 2, '#e05020');
  drawPixelRect(ctx, tx + (flip ? -1 : 2), groundY - 5, 2, 1, '#f5f0e0');
  // Body
  drawPixelRect(ctx, x + 1, groundY - 4, 5, 3, '#e07030');
  // Head
  drawPixelRect(ctx, hx, groundY - 6, 4, 3, '#e07030');
  // Snout
  drawPixelRect(ctx, hx + (flip ? 0 : 3), groundY - 5, 2, 1, '#f5c0a0');
  // Ears
  drawPixelRect(ctx, hx + (flip ? 2 : 1), groundY - 8, 1, 2, '#e07030');
  drawPixelRect(ctx, hx + (flip ? 0 : 3), groundY - 8, 1, 2, '#e07030');
  // Eye
  drawPixelRect(ctx, hx + (flip ? 1 : 2), groundY - 6, 1, 1, '#1a1a1a');
  // Legs
  drawPixelRect(ctx, x + 1, groundY - 1, 1, 1, '#c05020');
  drawPixelRect(ctx, x + 3, groundY - 1, 1, 1, '#c05020');
  drawPixelRect(ctx, x + 5, groundY - 1, 1, 1, '#c05020');
}

function darkenColor(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function PixelGarden({ data, width = 200, height = 120, animated = true, className }: PixelGardenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);

  const draw = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width * PIXEL, height * PIXEL);

    const seed = data.user.login.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = seededRandom(seed + frame * 0);

    const groundY = Math.floor(height * 0.75);

    // Sky gradient (pixel-style bands)
    const skyColors = ['#87ceeb', '#9dd8f0', '#b3e2f5', '#c9ecfa'];
    for (let sy = 0; sy < groundY; sy++) {
      const band = Math.floor((sy / groundY) * skyColors.length);
      drawPixelRect(ctx, 0, sy, width, 1, skyColors[Math.min(band, skyColors.length - 1)]);
    }

    // Sun
    const sunX = width - 15;
    const sunY = 8;
    for (let sr = 3; sr >= 0; sr--) {
      const alpha = sr === 0 ? '#ffdd00' : sr === 1 ? '#ffe44d' : sr === 2 ? '#fff099' : '#fff9cc';
      for (let sx = -sr; sx <= sr; sx++) {
        for (let sy = -sr; sy <= sr; sy++) {
          if (sx * sx + sy * sy <= sr * sr + 1) {
            drawPixelRect(ctx, sunX + sx, sunY + sy, 1, 1, alpha);
          }
        }
      }
    }

    // Clouds
    const cloudRand = seededRandom(seed + 100);
    for (let i = 0; i < 3; i++) {
      const cx = Math.floor(cloudRand() * (width - 10)) + ((frame * 0.02 * (i + 1)) % width);
      drawCloud(ctx, cx % width, 3 + i * 6);
    }

    // Ground
    for (let gy = groundY; gy < height; gy++) {
      for (let gx = 0; gx < width; gx++) {
        const grassRand = seededRandom(seed + gx * 100 + gy);
        if (gy === groundY) {
          drawPixelRect(ctx, gx, gy, 1, 1, grassRand() > 0.3 ? '#5a9c4f' : '#4a8c3f');
        } else if (gy < groundY + 3) {
          drawPixelRect(ctx, gx, gy, 1, 1, grassRand() > 0.5 ? '#6b5c3a' : '#7a6c4a');
        } else {
          drawPixelRect(ctx, gx, gy, 1, 1, '#5a4c2a');
        }
      }
    }

    // Grass tufts
    const grassTuftRand = seededRandom(seed + 200);
    for (let i = 0; i < width / 3; i++) {
      const gx = Math.floor(grassTuftRand() * width);
      if (grassTuftRand() > 0.5) {
        drawPixelRect(ctx, gx, groundY - 1, 1, 1, '#5a9c4f');
      }
    }

    // Water pond (based on repo count)
    if (data.repos.length > 5) {
      const pondX = Math.floor(width * 0.6);
      const pondWidth = Math.min(20, Math.floor(data.repos.length / 3));
      drawWater(ctx, pondX, groundY, pondWidth, frame);
    }

    // Sort languages by frequency
    const sortedLangs = Object.entries(data.languages).sort((a, b) => b[1] - a[1]);
    
    // Place plants based on data
    const plantRand = seededRandom(seed + 300);
    const plantPositions: number[] = [];
    
    // Trees based on public_repos count, colors cycling through languages
    const langColors = sortedLangs.map(([lang]) => LANGUAGE_COLORS[lang] || '#5a9c4f');
    if (langColors.length === 0) langColors.push('#5a9c4f');
    const nTrees = Math.min(Math.min(data.user.public_repos, 20), Math.max(5, Math.floor(Math.log10(Math.max(1, data.user.public_repos)) / Math.log10(100) * 25)));
    const activityFactor = Math.min(1, Math.log10(Math.max(1, data.totalCommits)) / Math.log10(5000));

    for (let t = 0; t < nTrees; t++) {
      // Spread evenly across full width with some random jitter
      const slotWidth = Math.floor((width - 6) / nTrees);
      const slotStart = 3 + t * slotWidth;
      const tx = slotStart + Math.floor(plantRand() * Math.max(1, slotWidth - 2));
      if (plantPositions.some(p => Math.abs(p - tx) < 5)) continue;
      plantPositions.push(tx);

      const color = langColors[t % langColors.length];
      const treeHeight = Math.floor(6 + activityFactor * 18 + plantRand() * 14);
      drawTree(ctx, tx, groundY, treeHeight, color, plantRand);
    }

    // Flowers for contribution density
    const recentContribs = data.contributions.slice(-90);
    const avgContrib = recentContribs.reduce((s, d) => s + d.count, 0) / Math.max(recentContribs.length, 1);
    const flowerCount = Math.floor(Math.min(40, Math.log10(Math.max(1, data.totalCommits)) / Math.log10(5000) * 35 + 5));
    const flowerColors = ['#ff6b9d', '#ffd93d', '#c084fc', '#ff8a65', '#69db7c'];
    
    for (let f = 0; f < flowerCount; f++) {
      const fx = Math.floor(plantRand() * (width - 4)) + 2;
      if (plantPositions.some(p => Math.abs(p - fx) < 3)) continue;
      plantPositions.push(fx);
      const fh = Math.floor(3 + plantRand() * 5);
      drawFlower(ctx, fx, groundY, fh, flowerColors[f % flowerColors.length], plantRand);
    }

    // Sunflowers for long streaks
    if (data.longestStreak > 30) {
      const sfCount = Math.min(5, Math.floor(data.longestStreak / 15));
      for (let sf = 0; sf < sfCount; sf++) {
        const sfx = Math.floor(plantRand() * (width - 4)) + 2;
        if (plantPositions.some(p => Math.abs(p - sfx) < 3)) continue;
        plantPositions.push(sfx);
        drawSunflower(ctx, sfx, groundY, plantRand);
      }
    }

    // Bushes
    const bushCount = Math.min(8, Math.floor(data.repos.length / 5));
    for (let b = 0; b < bushCount; b++) {
      const bx = Math.floor(plantRand() * (width - 8)) + 4;
      if (plantPositions.some(p => Math.abs(p - bx) < 4)) continue;
      plantPositions.push(bx);
      const bSize = Math.floor(3 + plantRand() * 4);
      drawBush(ctx, bx, groundY, bSize, plantRand() > 0.5 ? '#3d8c3a' : '#5aac4f', plantRand);
    }

    // Mushrooms for inactive periods
    if (data.currentStreak < 3) {
      for (let m = 0; m < 3; m++) {
        const mx = Math.floor(plantRand() * (width - 4)) + 2;
        if (!plantPositions.some(p => Math.abs(p - mx) < 2)) {
          drawMushroom(ctx, mx, groundY, plantRand);
        }
      }
    }

    // Butterflies
    if (data.totalCommits > 100) {
      const bfCount = Math.min(4, Math.floor(data.totalCommits / 200));
      for (let bf = 0; bf < bfCount; bf++) {
        const bfSeed = seededRandom(seed + 500 + bf);
        const bfX = Math.floor(bfSeed() * width * 0.8 + width * 0.1) + Math.floor(Math.sin(frame * 0.03 + bf) * 5);
        const bfY = Math.floor(groundY * 0.3 + bfSeed() * groundY * 0.4) + Math.floor(Math.cos(frame * 0.02 + bf * 2) * 3);
        drawButterfly(ctx, bfX, bfY, frame + bf * 20, flowerColors[bf % flowerColors.length]);
      }
    }

    // Birds for high commit counts
    if (data.totalCommits > 500) {
      const birdCount = Math.min(3, Math.floor((data.totalCommits - 500) / 500) + 1);
      for (let b = 0; b < birdCount; b++) {
        const birdSeed = seededRandom(seed + 700 + b);
        const bx = Math.floor(birdSeed() * (width - 8) + 4) + Math.floor(Math.sin(frame * 0.01 + b * 2) * 8);
        const by = Math.floor(groundY * 0.1 + birdSeed() * groundY * 0.3);
        drawBird(ctx, bx, by);
      }
    }

    // Falling leaves for short streaks (autumn effect)
    if (data.currentStreak < 7 && data.longestStreak > 14) {
      for (let l = 0; l < 5; l++) {
        const lx = (Math.floor(seededRandom(seed + 600 + l)() * width) + Math.floor(frame * 0.3 * (l + 1))) % width;
        const ly = (Math.floor(frame * 0.5 + l * 30) % (groundY - 5)) + 5;
        drawPixelRect(ctx, lx, ly, 1, 1, '#d4a030');
      }
    }

    // Animals based on follower count
    const followers = data.user.followers;
    const animalRand = seededRandom(seed + 800);
    if (followers >= 10) {
      const hedgehogCount = Math.min(3, Math.floor(followers / 10));
      for (let i = 0; i < hedgehogCount; i++) {
        const ax = Math.floor(animalRand() * (width - 12)) + 4
          + Math.floor(Math.sin(frame * 0.005 + i * 2.1) * 6);
        const flip = Math.sin(frame * 0.005 + i * 2.1) < 0;
        drawHedgehog(ctx, ax, groundY, flip);
      }
    }
    if (followers >= 100) {
      const deerCount = Math.min(2, Math.floor(followers / 100));
      for (let i = 0; i < deerCount; i++) {
        const ax = Math.floor(animalRand() * (width - 16)) + 6
          + Math.floor(Math.sin(frame * 0.004 + i * 3.7) * 8);
        const flip = Math.sin(frame * 0.004 + i * 3.7) < 0;
        drawDeer(ctx, ax, groundY, flip);
      }
    }
    if (followers >= 1000) {
      const ax = Math.floor(animalRand() * (width - 18)) + 6
        + Math.floor(Math.sin(frame * 0.003) * 10);
      const flip = Math.sin(frame * 0.003) < 0;
      drawFox(ctx, ax, groundY, flip);
    }

    // Fence at bottom
    for (let fx = 0; fx < width; fx += 6) {
      drawPixelRect(ctx, fx, groundY + 3, 1, 3, '#8b7355');
      drawPixelRect(ctx, fx + 1, groundY + 3, 1, 3, '#8b7355');
      if (fx + 6 < width) {
        drawPixelRect(ctx, fx, groundY + 4, 6, 1, '#a08060');
      }
    }

    // Sign with username
    const signX = 3;
    const signY = groundY - 11;
    drawPixelRect(ctx, signX, signY, 20, 8, '#c4a060');
    drawPixelRect(ctx, signX + 8,  signY + 8, 2, 4, '#8b7355');
    drawPixelRect(ctx, signX + 10, signY + 8, 2, 4, '#8b7355');

    // Username text on sign
    ctx.fillStyle = '#3a2a10';
    ctx.font = `${PIXEL * 2}px 'Press Start 2P', monospace`;
    ctx.fillText(data.user.login.slice(0, 8), (signX + 1) * PIXEL, (signY + 5.5) * PIXEL);
  }, [data, width, height]);

  useEffect(() => {
    if (!animated) {
      draw(0);
      return;
    }

    const animate = () => {
      frameRef.current++;
      draw(frameRef.current);
      animRef.current = requestAnimationFrame(animate);
    };
    
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, animated]);

  return (
    <canvas
      ref={canvasRef}
      width={width * PIXEL}
      height={height * PIXEL}
      className={className}
      style={{
        width: width * PIXEL,
        imageRendering: 'pixelated',
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
}
