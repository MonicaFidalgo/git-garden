export async function onRequest({ params, request, env }) {
  const username = params.username;

  const url = new URL(request.url);
  const origin = url.origin;

  // finds static HTML
  const response = await env.ASSETS.fetch(request);
  const html = await response.text();

  const ogImage = `${origin}/og/${username}`;
  const title = `${username}'s git garden 🌿`;
  const description = `See ${username}'s GitHub contributions as a living garden.`;

  const newHtml = html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      "</head>",
      `<meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${ogImage}" />
      <meta property="og:url" content="${origin}/garden/${username}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="${ogImage}" />
      </head>`,
    );

  return new Response(newHtml, {
    headers: { "Content-Type": "text/html" },
  });
}
