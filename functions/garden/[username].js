export async function onRequest({ params, request, env }) {
  const username = params.username;
  const url = new URL(request.url);
  const origin = url.origin;

  // Fetch GitHub user to get display name
  let displayName = username;
  try {
    const ghRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { "User-Agent": "GitGarden" },
    });
    if (ghRes.ok) {
      const ghUser = await ghRes.json();
      displayName = ghUser.name || username;
    }
  } catch (_) {}

  const ogImage = `https://github.com/${username}.png`;
  const title = `${displayName}'s git garden 🌿`;
  const description = `See ${displayName}'s (@${username}) GitHub contributions as a living garden. Every commit grows a flower, every repo plants a tree.`;
  const pageUrl = `${origin}/garden/${username}`;

  const dynamicTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />`;

  const response = await env.ASSETS.fetch(request);
  let html = await response.text();

  // Remove existing static og/twitter/title/description tags so ours take precedence
  html = html
    .replace(/<title>.*?<\/title>/s, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:card"[^>]*>/gi, "")
    .replace(/<meta\s+name="author"[^>]*>/gi, "")
    .replace("</head>", `${dynamicTags}\n  </head>`);

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
