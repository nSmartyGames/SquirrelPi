export function buildDefaultPage(siteName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${siteName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #0a0a0f; color: #f0f0f0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .hero { text-align: center; padding: 2rem; }
  h1 { font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, #4ade80, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; }
  p { color: #9ca3af; font-size: 1.125rem; max-width: 480px; line-height: 1.75; }
  .badge { margin-top: 2rem; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.2); border-radius: 9999px; font-size: 0.75rem; color: #4ade80; }
  .dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
</style>
</head>
<body>
  <div class="hero">
    <h1>${siteName}</h1>
    <p>This site was published with Squirrel Pi. AI-powered website builder &amp; template marketplace.</p>
    <div class="badge"><span class="dot"></span>Live on Squirrel Pi</div>
  </div>
</body>
</html>`
}
