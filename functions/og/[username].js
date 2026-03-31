export async function onRequest({ params }) {
  const username = params.username;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <rect width="1200" height="630" fill="#f0fdf4"/>
      <rect x="0" y="480" width="1200" height="150" fill="#56c156"/>
      <rect x="0" y="480" width="1200" height="12" fill="#66bb6a"/>

      <!-- big tree -->
      <rect x="174" y="260" width="52" height="220" fill="#795548" rx="4"/>
      <ellipse cx="200" cy="220" rx="120" ry="100" fill="#2d6a4f"/>
      <ellipse cx="150" cy="250" rx="90" ry="75" fill="#40916c"/>
      <ellipse cx="250" cy="250" rx="90" ry="75" fill="#40916c"/>
      <ellipse cx="200" cy="150" rx="80" ry="70" fill="#52b788"/>

      <!-- flowers -->
      <line x1="500" y1="480" x2="500" y2="420" stroke="#40916c" stroke-width="6"/>
      <circle cx="500" cy="410" r="22" fill="#f9c74f"/>
      <circle cx="500" cy="410" r="12" fill="#fff9c4"/>

      <line x1="600" y1="480" x2="600" y2="430" stroke="#40916c" stroke-width="6"/>
      <circle cx="600" cy="420" r="20" fill="#f72585"/>
      <circle cx="600" cy="420" r="11" fill="#fff9c4"/>

      <line x1="700" y1="480" x2="700" y2="435" stroke="#40916c" stroke-width="6"/>
      <circle cx="700" cy="425" r="18" fill="#4cc9f0"/>
      <circle cx="700" cy="425" r="10" fill="#fff9c4"/>

      <!-- sun -->
      <circle cx="1100" cy="100" r="70" fill="#ffe066" opacity="0.4"/>
      <circle cx="1100" cy="100" r="50" fill="#ffe066"/>
      <circle cx="1100" cy="100" r="36" fill="#fff9c4"/>

      <!-- username -->
      <text x="600" y="570" font-family="monospace" font-size="52" font-weight="bold"
        fill="#1b4332" text-anchor="middle">@${username}</text>

      <!-- tagline -->
      <text x="600" y="80" font-family="monospace" font-size="36"
        fill="#40916c" text-anchor="middle">🌿 git garden</text>
      <text x="600" y="130" font-family="monospace" font-size="22"
        fill="#52b788" text-anchor="middle">your commits, as a living garden</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
