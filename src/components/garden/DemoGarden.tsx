import { useEffect, useRef } from 'react';

const PIXEL = 4;

function drawPixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PIXEL, y * PIXEL, w * PIXEL, h * PIXEL);
}

export function DemoGarden({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 160;
    const H = 80;
    const groundY = 58;

    const animate = () => {
      frameRef.current++;
      const frame = frameRef.current;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W * PIXEL, H * PIXEL);

      // Sky
      const skyColors = ['#87ceeb', '#9dd8f0', '#b3e2f5', '#c9ecfa'];
      for (let sy = 0; sy < groundY; sy++) {
        const band = Math.floor((sy / groundY) * skyColors.length);
        drawPixelRect(ctx, 0, sy, W, 1, skyColors[Math.min(band, skyColors.length - 1)]);
      }

      // Sun
      for (let r = 4; r >= 0; r--) {
        const colors = ['#ffdd00', '#ffe44d', '#fff099', '#fff9cc', '#fffde6'];
        for (let sx = -r; sx <= r; sx++) {
          for (let sy = -r; sy <= r; sy++) {
            if (sx * sx + sy * sy <= r * r + 1) {
              drawPixelRect(ctx, W - 15 + sx, 8 + sy, 1, 1, colors[r]);
            }
          }
        }
      }

      // Clouds
      for (let i = 0; i < 3; i++) {
        const cx = (20 + i * 50 + Math.floor(frame * 0.03 * (i + 1))) % (W + 10) - 5;
        drawPixelRect(ctx, cx + 1, 4 + i * 5, 3, 1, '#fff');
        drawPixelRect(ctx, cx, 5 + i * 5, 5, 1, '#fff');
        drawPixelRect(ctx, cx + 1, 6 + i * 5, 3, 1, '#fff');
      }

      // Ground
      for (let gy = groundY; gy < H; gy++) {
        for (let gx = 0; gx < W; gx++) {
          const hash = ((gx * 2654435761 + gy * 340573321) >>> 0) % 100;
          if (gy === groundY) {
            drawPixelRect(ctx, gx, gy, 1, 1, hash > 30 ? '#5a9c4f' : '#4a8c3f');
          } else if (gy < groundY + 3) {
            drawPixelRect(ctx, gx, gy, 1, 1, hash > 50 ? '#6b5c3a' : '#7a6c4a');
          } else {
            drawPixelRect(ctx, gx, gy, 1, 1, '#5a4c2a');
          }
        }
      }

      // Sample trees
      const trees = [
        { x: 15, h: 18, c: '#5a9c4f' },
        { x: 40, h: 22, c: '#ffb7c5' },
        { x: 70, h: 15, c: '#f0d000' },
        { x: 100, h: 25, c: '#4a90d9' },
        { x: 130, h: 20, c: '#c084fc' },
      ];

      trees.forEach(({ x, h, c }) => {
        const trunkH = Math.floor(h * 0.4);
        for (let t = 0; t < trunkH; t++) drawPixelRect(ctx, x, groundY - trunkH + t, 1, 1, '#6b4226');
        const canopyH = h - trunkH;
        const cW = Math.floor(h / 2);
        for (let cy = 0; cy < canopyH; cy++) {
          const rW = Math.max(1, Math.floor(cW * Math.sin((cy / canopyH) * Math.PI)));
          for (let cx = 0; cx < rW; cx++) {
            const hash = ((x + cx + cy * 7) >>> 0) % 10;
            if (hash > 1) drawPixelRect(ctx, x - Math.floor(rW / 2) + cx, groundY - trunkH - canopyH + cy, 1, 1, c);
          }
        }
      });

      // Flowers
      const flowerColors = ['#ff6b9d', '#ffd93d', '#ff8a65', '#69db7c', '#c084fc'];
      for (let f = 0; f < 15; f++) {
        const fx = 5 + f * 10;
        const fc = flowerColors[f % flowerColors.length];
        for (let s = 0; s < 3; s++) drawPixelRect(ctx, fx, groundY - 3 + s, 1, 1, '#4a7c3f');
        drawPixelRect(ctx, fx, groundY - 5, 1, 1, fc);
        drawPixelRect(ctx, fx - 1, groundY - 4, 1, 1, fc);
        drawPixelRect(ctx, fx + 1, groundY - 4, 1, 1, fc);
        drawPixelRect(ctx, fx, groundY - 3, 1, 1, '#fff3a0');
      }

      // Butterflies
      for (let b = 0; b < 3; b++) {
        const bx = 30 + b * 40 + Math.floor(Math.sin(frame * 0.03 + b * 2) * 10);
        const by = 25 + Math.floor(Math.cos(frame * 0.02 + b) * 8);
        const wingOpen = Math.sin(frame * 0.1 + b) > 0;
        drawPixelRect(ctx, bx, by, 1, 1, '#333');
        const bc = flowerColors[b % flowerColors.length];
        if (wingOpen) {
          drawPixelRect(ctx, bx - 1, by - 1, 1, 1, bc);
          drawPixelRect(ctx, bx + 1, by - 1, 1, 1, bc);
          drawPixelRect(ctx, bx - 1, by, 1, 1, bc);
          drawPixelRect(ctx, bx + 1, by, 1, 1, bc);
        } else {
          drawPixelRect(ctx, bx - 1, by, 1, 1, bc);
          drawPixelRect(ctx, bx + 1, by, 1, 1, bc);
        }
      }

      // Water
      for (let wx = 0; wx < 15; wx++) {
        const wo = Math.sin((wx + frame * 0.05) * 0.5) > 0 ? 0 : 1;
        drawPixelRect(ctx, 85 + wx, groundY - wo, 1, 1, '#4a90d9');
        drawPixelRect(ctx, 85 + wx, groundY + 1 - wo, 1, 1, '#3a70b9');
        if ((wx + Math.floor(frame * 0.02)) % 4 === 0) {
          drawPixelRect(ctx, 85 + wx, groundY - wo, 1, 1, '#7ab8f5');
        }
      }

      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={160 * PIXEL}
      height={80 * PIXEL}
      className={className}
      style={{ width: 160 * PIXEL, imageRendering: 'pixelated', maxWidth: '100%', height: 'auto' }}
    />
  );
}
