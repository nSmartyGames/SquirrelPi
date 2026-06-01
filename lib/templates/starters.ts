export interface StarterTemplate {
  id: string
  title: string
  description: string
  category: 'basic' | 'professional' | 'digital-products'
  type: '2d' | '3d'
  palette: string
  bundle_html: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MIDNIGHT SAAS — dark #0a0a0f · green #4ade80 · tech startup
// ─────────────────────────────────────────────────────────────────────────────
const MIDNIGHT_SAAS = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Midnight SaaS</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0a0f;
    --bg2: #0f0f18;
    --bg3: #141420;
    --text: #f0f0f0;
    --muted: #9ca3af;
    --accent: #4ade80;
    --accent2: #22d3ee;
    --border: #1a2a1a;
    --radius: 12px;
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; line-height: 1.6; }

  /* NAV */
  nav { position: sticky; top: 0; z-index: 100; background: rgba(10,10,15,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(74,222,128,0.08); height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 5vw; }
  .nav-logo { font-size: 1.125rem; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.02em; }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.2s; }
  .nav-links a:hover { color: var(--text); }
  .nav-cta { background: var(--accent); color: #0a0a0f; font-size: 0.8125rem; font-weight: 700; padding: 0.5rem 1.25rem; border-radius: 9999px; text-decoration: none; transition: opacity 0.2s; }
  .nav-cta:hover { opacity: 0.85; }
  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
  .hamburger span { width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.3s; }
  .mobile-menu { display: none; position: fixed; top: 64px; left: 0; right: 0; background: var(--bg2); border-bottom: 1px solid var(--border); padding: 1.5rem 5vw 2rem; flex-direction: column; gap: 1rem; z-index: 99; }
  .mobile-menu.open { display: flex; }
  .mobile-menu a { color: var(--muted); text-decoration: none; font-size: 1rem; font-weight: 500; padding: 0.5rem 0; border-bottom: 1px solid var(--border); transition: color 0.2s; }
  .mobile-menu a:last-child { border: none; }
  .mobile-menu a:hover { color: var(--accent); }
  @media (max-width: 768px) { .nav-links, .nav-cta { display: none; } .hamburger { display: flex; } }

  /* HERO */
  .hero { min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 5rem 5vw 4rem; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(74,222,128,0.12) 0%, transparent 65%); pointer-events: none; }
  .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); border-radius: 9999px; padding: 0.375rem 1rem; font-size: 0.75rem; font-weight: 600; color: var(--accent); margin-bottom: 2rem; letter-spacing: 0.04em; text-transform: uppercase; }
  .hero-badge-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  .hero h1 { font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.04em; margin-bottom: 1.5rem; max-width: 800px; }
  .hero h1 span { background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero p { font-size: clamp(1rem, 2vw, 1.25rem); color: var(--muted); max-width: 560px; margin-bottom: 2.5rem; line-height: 1.75; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
  .btn-primary { background: var(--accent); color: #0a0a0f; font-size: 0.9375rem; font-weight: 700; padding: 0.875rem 2rem; border-radius: 9999px; text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(74,222,128,0.25); }
  .btn-secondary { background: transparent; color: var(--text); font-size: 0.9375rem; font-weight: 600; padding: 0.875rem 2rem; border-radius: 9999px; text-decoration: none; border: 1px solid rgba(255,255,255,0.12); transition: all 0.2s; }
  .btn-secondary:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); }
  .hero-social-proof { margin-top: 3.5rem; display: flex; align-items: center; gap: 1rem; color: var(--muted); font-size: 0.8125rem; }
  .avatar-stack { display: flex; }
  .avatar-stack img, .avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--bg); margin-left: -8px; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #0a0a0f; }
  .avatar-stack .avatar:first-child { margin-left: 0; }

  /* FEATURES */
  .section { padding: 5rem 5vw; }
  .section-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; }
  .section-title { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem; }
  .section-sub { color: var(--muted); font-size: 1.0625rem; max-width: 480px; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5px; margin-top: 3.5rem; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .feature-card { background: var(--bg); padding: 2rem; transition: background 0.2s; }
  .feature-card:hover { background: var(--bg2); }
  .feature-icon { width: 44px; height: 44px; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 1.25rem; }
  .feature-card h3 { font-size: 1.0625rem; font-weight: 700; margin-bottom: 0.5rem; }
  .feature-card p { font-size: 0.9rem; color: var(--muted); line-height: 1.65; }

  /* PRICING */
  .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 3.5rem; max-width: 900px; margin-left: auto; margin-right: auto; }
  .price-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; transition: border-color 0.2s; }
  .price-card.featured { border-color: var(--accent); background: linear-gradient(135deg, rgba(74,222,128,0.05), transparent); }
  .price-tag { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; }
  .price-tag.accent { color: var(--accent); }
  .price-card h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.25rem; }
  .price-amount { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.04em; margin: 1rem 0; }
  .price-amount span { font-size: 1rem; font-weight: 500; color: var(--muted); }
  .price-features { list-style: none; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.625rem; }
  .price-features li { font-size: 0.875rem; color: var(--muted); display: flex; align-items: center; gap: 0.5rem; }
  .price-features li::before { content: '✓'; color: var(--accent); font-weight: 700; font-size: 0.75rem; }
  .btn-outline { display: block; text-align: center; border: 1px solid var(--border); color: var(--text); padding: 0.75rem; border-radius: 8px; text-decoration: none; font-size: 0.875rem; font-weight: 600; transition: all 0.2s; margin-top: 1.5rem; }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-filled { display: block; text-align: center; background: var(--accent); color: #0a0a0f; padding: 0.75rem; border-radius: 8px; text-decoration: none; font-size: 0.875rem; font-weight: 700; transition: opacity 0.2s; margin-top: 1.5rem; }
  .btn-filled:hover { opacity: 0.85; }

  /* CTA BANNER */
  .cta-banner { margin: 0 5vw 5rem; background: linear-gradient(135deg, rgba(74,222,128,0.08), rgba(34,211,238,0.05)); border: 1px solid rgba(74,222,128,0.15); border-radius: 20px; padding: 4rem 5vw; text-align: center; }
  .cta-banner h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem; }
  .cta-banner p { color: var(--muted); margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto; }

  /* FOOTER */
  footer { border-top: 1px solid var(--border); padding: 3rem 5vw; display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; }
  .footer-brand p { color: var(--muted); font-size: 0.8125rem; margin-top: 0.375rem; }
  .footer-links { display: flex; gap: 1.5rem; list-style: none; }
  .footer-links a { color: var(--muted); text-decoration: none; font-size: 0.8125rem; transition: color 0.2s; }
  .footer-links a:hover { color: var(--text); }
  @media (max-width: 600px) { footer { grid-template-columns: 1fr; } .footer-links { flex-wrap: wrap; } }
</style>
</head>
<body>

<nav>
  <div class="nav-logo">Launchpad</div>
  <ul class="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <a href="#pricing" class="nav-cta">Get Started</a>
  <div class="hamburger" onclick="toggleMenu()">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="#features">Features</a>
  <a href="#pricing">Pricing</a>
  <a href="#about">About</a>
  <a href="#contact" class="btn-primary" style="border-radius:8px;justify-content:center;">Get Started →</a>
</div>

<section class="hero">
  <div class="hero-badge"><span class="hero-badge-dot"></span> Now in public beta</div>
  <h1>Ship faster with<br><span>AI-powered tools</span></h1>
  <p>The all-in-one platform for modern teams. Automate workflows, deploy in seconds, and scale without limits.</p>
  <div class="hero-actions">
    <a href="#pricing" class="btn-primary">Start for free →</a>
    <a href="#features" class="btn-secondary">See how it works</a>
  </div>
  <div class="hero-social-proof">
    <div class="avatar-stack">
      <div class="avatar">JD</div>
      <div class="avatar">KM</div>
      <div class="avatar">AL</div>
      <div class="avatar">RP</div>
    </div>
    <span>Trusted by 2,400+ teams worldwide</span>
  </div>
</section>

<section class="section" id="features">
  <div class="section-label">Features</div>
  <div class="section-title">Everything you need to launch</div>
  <p class="section-sub">Powerful tools designed to get out of your way so you can focus on building.</p>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <h3>Instant Deploy</h3>
      <p>Push to production in under 30 seconds. Zero-config deployments with automatic rollbacks.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🤖</div>
      <h3>AI Automation</h3>
      <p>Intelligent workflows that learn from your patterns and automate repetitive tasks.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">📊</div>
      <h3>Real-time Analytics</h3>
      <p>Live dashboards with deep insights into performance, usage, and revenue metrics.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔐</div>
      <h3>Enterprise Security</h3>
      <p>SOC 2 Type II certified. End-to-end encryption with SSO and fine-grained permissions.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🌐</div>
      <h3>Global CDN</h3>
      <p>Serve your users from 200+ edge locations worldwide with sub-100ms latency.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔌</div>
      <h3>300+ Integrations</h3>
      <p>Connect with your existing stack. Slack, GitHub, Stripe, and hundreds more.</p>
    </div>
  </div>
</section>

<section class="section" id="pricing" style="text-align:center;">
  <div class="section-label">Pricing</div>
  <div class="section-title">Simple, transparent pricing</div>
  <p class="section-sub" style="margin:0 auto;">No hidden fees. Cancel anytime.</p>
  <div class="pricing-grid">
    <div class="price-card">
      <div class="price-tag">Starter</div>
      <h3>Free</h3>
      <div class="price-amount">$0 <span>/mo</span></div>
      <ul class="price-features">
        <li>3 projects</li>
        <li>10k requests/month</li>
        <li>Community support</li>
        <li>Basic analytics</li>
      </ul>
      <a href="#" class="btn-outline">Get started</a>
    </div>
    <div class="price-card featured">
      <div class="price-tag accent">⭐ Most Popular</div>
      <h3>Pro</h3>
      <div class="price-amount">$29 <span>/mo</span></div>
      <ul class="price-features">
        <li>Unlimited projects</li>
        <li>1M requests/month</li>
        <li>Priority support</li>
        <li>Advanced analytics</li>
        <li>Custom domains</li>
      </ul>
      <a href="#" class="btn-filled">Start free trial</a>
    </div>
    <div class="price-card">
      <div class="price-tag">Enterprise</div>
      <h3>Scale</h3>
      <div class="price-amount">$99 <span>/mo</span></div>
      <ul class="price-features">
        <li>Everything in Pro</li>
        <li>Unlimited requests</li>
        <li>SLA guarantee</li>
        <li>Dedicated support</li>
        <li>SSO + SAML</li>
      </ul>
      <a href="#" class="btn-outline">Contact sales</a>
    </div>
  </div>
</section>

<div class="cta-banner" id="contact">
  <h2>Ready to build something great?</h2>
  <p>Join thousands of teams already shipping faster with Launchpad.</p>
  <a href="#" class="btn-primary" style="display:inline-flex;">Create free account →</a>
</div>

<footer>
  <div class="footer-brand">
    <div class="nav-logo">Launchpad</div>
    <p>© 2025 Launchpad Inc. All rights reserved.</p>
  </div>
  <ul class="footer-links">
    <li><a href="#">Privacy</a></li>
    <li><a href="#">Terms</a></li>
    <li><a href="#">Docs</a></li>
    <li><a href="#">Status</a></li>
  </ul>
</footer>

<script>
  function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
  }
  document.addEventListener('click', function(e) {
    const menu = document.getElementById('mobileMenu');
    if (!e.target.closest('nav') && !e.target.closest('#mobileMenu')) menu.classList.remove('open');
  });
</script>
</body>
</html>`

// ─────────────────────────────────────────────────────────────────────────────
// 2. OCEAN AGENCY — navy #0c1a2e · cyan #38bdf8 · services / consulting
// ─────────────────────────────────────────────────────────────────────────────
const OCEAN_AGENCY = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ocean Agency</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root { --bg:#0c1a2e; --bg2:#0f2240; --bg3:#122a50; --text:#e2f0f9; --muted:#7cb3d4; --accent:#38bdf8; --border:#1e3a5f; --radius:14px; }
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;line-height:1.6;}

  nav{position:sticky;top:0;z-index:100;background:rgba(12,26,46,0.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;}
  .logo{font-size:1.1rem;font-weight:800;color:var(--accent);letter-spacing:-0.01em;}
  .nav-links{display:flex;gap:2rem;list-style:none;}
  .nav-links a{color:var(--muted);text-decoration:none;font-size:.875rem;font-weight:500;transition:color .2s;}
  .nav-links a:hover{color:var(--text);}
  .nav-btn{background:var(--accent);color:#0c1a2e;padding:.5rem 1.25rem;border-radius:9999px;font-size:.8125rem;font-weight:700;text-decoration:none;transition:opacity .2s;}
  .nav-btn:hover{opacity:.85;}
  .ham{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;}
  .ham span{width:22px;height:2px;background:var(--text);border-radius:2px;}
  .mob{display:none;position:fixed;top:68px;left:0;right:0;background:var(--bg2);border-bottom:1px solid var(--border);padding:1.5rem 5vw 2rem;flex-direction:column;gap:1rem;z-index:99;}
  .mob.open{display:flex;}
  .mob a{color:var(--muted);text-decoration:none;font-size:1rem;padding:.5rem 0;border-bottom:1px solid var(--border);}
  @media(max-width:768px){.nav-links,.nav-btn{display:none;}.ham{display:flex;}}

  /* HERO */
  .hero{min-height:88vh;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;padding:5rem 5vw;position:relative;overflow:hidden;}
  .hero::after{content:'';position:absolute;right:-10%;top:-20%;width:600px;height:600px;background:radial-gradient(circle,rgba(56,189,248,.15) 0%,transparent 65%);pointer-events:none;}
  .hero-tag{display:inline-flex;align-items:center;gap:.5rem;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.2);border-radius:9999px;padding:.375rem 1rem;font-size:.75rem;font-weight:700;color:var(--accent);margin-bottom:1.5rem;letter-spacing:.04em;text-transform:uppercase;}
  .hero h1{font-size:clamp(2rem,5vw,3.75rem);font-weight:800;line-height:1.1;letter-spacing:-.035em;margin-bottom:1.5rem;}
  .hero h1 em{font-style:normal;color:var(--accent);}
  .hero p{color:var(--muted);font-size:1.0625rem;line-height:1.75;margin-bottom:2rem;}
  .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;}
  .btn-p{background:var(--accent);color:#0c1a2e;font-weight:700;padding:.875rem 1.75rem;border-radius:9999px;text-decoration:none;font-size:.9rem;transition:all .2s;}
  .btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(56,189,248,.3);}
  .btn-s{color:var(--text);font-weight:600;padding:.875rem 1.75rem;border-radius:9999px;text-decoration:none;font-size:.9rem;border:1px solid rgba(255,255,255,.1);transition:all .2s;}
  .btn-s:hover{border-color:rgba(255,255,255,.25);}
  .hero-visual{background:linear-gradient(135deg,var(--bg2),var(--bg3));border:1px solid var(--border);border-radius:20px;padding:2rem;display:flex;flex-direction:column;gap:1rem;}
  .stat-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
  .stat{background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.1);border-radius:12px;padding:1.25rem;}
  .stat-val{font-size:2rem;font-weight:900;color:var(--accent);letter-spacing:-.04em;}
  .stat-label{font-size:.75rem;color:var(--muted);margin-top:.25rem;}
  .mini-chart{height:64px;background:linear-gradient(180deg,rgba(56,189,248,.15),transparent);border-radius:8px;display:flex;align-items:flex-end;gap:3px;padding:8px;}
  .bar{flex:1;background:var(--accent);border-radius:3px 3px 0 0;opacity:.7;}
  @media(max-width:768px){.hero{grid-template-columns:1fr;}.hero-visual{display:none;}}

  /* SERVICES */
  .sec{padding:5rem 5vw;}
  .chip{display:inline-block;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.2);border-radius:9999px;padding:.25rem .875rem;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;}
  .sec-title{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:800;letter-spacing:-.035em;margin-bottom:.75rem;}
  .sec-sub{color:var(--muted);font-size:1.05rem;max-width:500px;}
  .services{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:3rem;}
  .svc{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;transition:all .2s;cursor:default;}
  .svc:hover{border-color:var(--accent);transform:translateY(-4px);}
  .svc-num{font-size:2.5rem;font-weight:900;color:rgba(56,189,248,.15);margin-bottom:1rem;}
  .svc h3{font-size:1.0625rem;font-weight:700;margin-bottom:.5rem;}
  .svc p{font-size:.875rem;color:var(--muted);line-height:1.65;}

  /* PROCESS */
  .process{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0;margin-top:3rem;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
  .step{padding:2rem;border-right:1px solid var(--border);position:relative;}
  .step:last-child{border-right:none;}
  .step-n{width:32px;height:32px;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:800;color:var(--accent);margin-bottom:1rem;}
  .step h4{font-size:.9375rem;font-weight:700;margin-bottom:.5rem;}
  .step p{font-size:.8125rem;color:var(--muted);}
  @media(max-width:768px){.process{grid-template-columns:1fr;}.step{border-right:none;border-bottom:1px solid var(--border);}.step:last-child{border-bottom:none;}}

  /* CTA */
  .cta{margin:0 5vw 5rem;background:linear-gradient(135deg,var(--bg3),var(--bg2));border:1px solid var(--border);border-radius:20px;padding:4rem 5vw;display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:center;}
  .cta h2{font-size:clamp(1.5rem,3.5vw,2.25rem);font-weight:800;letter-spacing:-.03em;}
  .cta p{color:var(--muted);margin-top:.5rem;}
  @media(max-width:640px){.cta{grid-template-columns:1fr;}}

  footer{border-top:1px solid var(--border);padding:2.5rem 5vw;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
  .foot-logo{font-size:1rem;font-weight:800;color:var(--accent);}
  .foot-links{display:flex;gap:1.5rem;list-style:none;}
  .foot-links a{color:var(--muted);text-decoration:none;font-size:.8125rem;transition:color .2s;}
  .foot-links a:hover{color:var(--text);}
</style>
</head>
<body>

<nav>
  <div class="logo">Wavefront</div>
  <ul class="nav-links">
    <li><a href="#services">Services</a></li>
    <li><a href="#process">Process</a></li>
    <li><a href="#work">Work</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <a href="#contact" class="nav-btn">Book a Call</a>
  <div class="ham" onclick="document.getElementById('mob').classList.toggle('open')">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mob" id="mob">
  <a href="#services">Services</a>
  <a href="#process">Process</a>
  <a href="#work">Work</a>
  <a href="#contact">Book a Call →</a>
</div>

<section class="hero">
  <div>
    <div class="hero-tag">Digital Strategy Agency</div>
    <h1>We build brands that <em>actually</em> convert</h1>
    <p>From strategy to execution — we partner with ambitious companies to design, build, and grow digital experiences that drive real results.</p>
    <div class="hero-btns">
      <a href="#contact" class="btn-p">Start a project →</a>
      <a href="#work" class="btn-s">View our work</a>
    </div>
  </div>
  <div class="hero-visual">
    <div class="stat-row">
      <div class="stat"><div class="stat-val">94%</div><div class="stat-label">Client retention rate</div></div>
      <div class="stat"><div class="stat-val">3.2×</div><div class="stat-label">Avg. revenue growth</div></div>
    </div>
    <div class="stat-row">
      <div class="stat"><div class="stat-val">180+</div><div class="stat-label">Projects delivered</div></div>
      <div class="stat"><div class="stat-val">12yr</div><div class="stat-label">In the industry</div></div>
    </div>
    <div class="mini-chart">
      <div class="bar" style="height:30%"></div>
      <div class="bar" style="height:55%"></div>
      <div class="bar" style="height:45%"></div>
      <div class="bar" style="height:80%"></div>
      <div class="bar" style="height:65%"></div>
      <div class="bar" style="height:90%"></div>
      <div class="bar" style="height:100%"></div>
    </div>
  </div>
</section>

<section class="sec" id="services">
  <div class="chip">What we do</div>
  <div class="sec-title">Services built for growth</div>
  <p class="sec-sub">We specialise in the services that move the needle.</p>
  <div class="services">
    <div class="svc"><div class="svc-num">01</div><h3>Brand Strategy</h3><p>Positioning, messaging, and visual identity that makes you impossible to ignore.</p></div>
    <div class="svc"><div class="svc-num">02</div><h3>Web Design & Dev</h3><p>Fast, beautiful, conversion-optimised websites built on modern tech stacks.</p></div>
    <div class="svc"><div class="svc-num">03</div><h3>Growth Marketing</h3><p>Data-driven campaigns across paid, organic, and owned channels.</p></div>
    <div class="svc"><div class="svc-num">04</div><h3>Product Design</h3><p>UX research, interaction design, and design systems that scale.</p></div>
  </div>
</section>

<section class="sec" id="process">
  <div class="chip">How we work</div>
  <div class="sec-title">Our process</div>
  <div class="process">
    <div class="step"><div class="step-n">1</div><h4>Discovery</h4><p>Deep-dive into your goals, audience, and competitive landscape.</p></div>
    <div class="step"><div class="step-n">2</div><h4>Strategy</h4><p>Build a roadmap with clear KPIs and measurable milestones.</p></div>
    <div class="step"><div class="step-n">3</div><h4>Execute</h4><p>Rapid iterations with weekly reviews and transparent reporting.</p></div>
    <div class="step"><div class="step-n">4</div><h4>Scale</h4><p>Double down on what works and systematically grow.</p></div>
  </div>
</section>

<div class="cta" id="contact">
  <div>
    <h2>Ready to grow your business?</h2>
    <p>Free 30-minute strategy call — no commitment.</p>
  </div>
  <a href="#" class="btn-p">Book a call →</a>
</div>

<footer>
  <div class="foot-logo">Wavefront</div>
  <ul class="foot-links">
    <li><a href="#">Privacy</a></li>
    <li><a href="#">Terms</a></li>
    <li><a href="#">hello@wavefront.co</a></li>
  </ul>
</footer>

<script>
  document.addEventListener('click',function(e){
    if(!e.target.closest('nav')&&!e.target.closest('#mob'))
      document.getElementById('mob').classList.remove('open');
  });
</script>
</body>
</html>`

// ─────────────────────────────────────────────────────────────────────────────
// 3. EMBER RESTAURANT — dark warm #1a0800 · orange #f97316 · food / dining
// ─────────────────────────────────────────────────────────────────────────────
const EMBER_RESTAURANT = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ember Restaurant</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{--bg:#0f0800;--bg2:#1a0e00;--bg3:#221200;--text:#fff0e6;--muted:#c4956a;--accent:#f97316;--gold:#e8c07a;--border:#3d1800;--radius:12px;}
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}

  nav{position:sticky;top:0;z-index:100;background:rgba(15,8,0,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;}
  .logo{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--gold);letter-spacing:.04em;}
  .nav-links{display:flex;gap:2rem;list-style:none;}
  .nav-links a{color:var(--muted);text-decoration:none;font-size:.875rem;transition:color .2s;}
  .nav-links a:hover{color:var(--text);}
  .res-btn{background:transparent;border:1px solid var(--accent);color:var(--accent);padding:.5rem 1.25rem;border-radius:9999px;font-size:.8125rem;font-weight:600;text-decoration:none;transition:all .2s;}
  .res-btn:hover{background:var(--accent);color:#0f0800;}
  .ham{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;}
  .ham span{width:22px;height:2px;background:var(--text);border-radius:2px;}
  .mob{display:none;position:fixed;top:68px;left:0;right:0;background:var(--bg2);border-bottom:1px solid var(--border);padding:1.5rem 5vw 2rem;flex-direction:column;gap:1rem;z-index:99;}
  .mob.open{display:flex;}
  .mob a{color:var(--muted);text-decoration:none;font-size:1rem;padding:.5rem 0;border-bottom:1px solid var(--border);}
  @media(max-width:768px){.nav-links,.res-btn{display:none;}.ham{display:flex;}}

  /* HERO */
  .hero{min-height:90vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:6rem 5vw;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 40%,rgba(249,115,22,.1) 0%,transparent 65%);}
  .divider{width:60px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:1.5rem auto;}
  .hero-sub{font-size:.75rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;}
  .hero h1{font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,9vw,7rem);font-weight:700;line-height:1;letter-spacing:-.02em;margin-bottom:1.5rem;}
  .hero h1 em{font-style:italic;color:var(--accent);}
  .hero p{color:var(--muted);font-size:1.05rem;max-width:460px;margin:0 auto 2.5rem;line-height:1.75;}
  .hero-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
  .btn-fire{background:linear-gradient(135deg,var(--accent),#ea580c);color:#fff;font-weight:600;padding:.875rem 2rem;border-radius:9999px;text-decoration:none;font-size:.9rem;transition:all .2s;}
  .btn-fire:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.35);}
  .btn-ghost{color:var(--text);font-weight:500;padding:.875rem 2rem;border-radius:9999px;text-decoration:none;font-size:.9rem;border:1px solid var(--border);transition:all .2s;}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold);}
  .hours{margin-top:2.5rem;font-size:.8rem;color:var(--muted);}
  .hours strong{color:var(--gold);}

  /* MENU */
  .sec{padding:5rem 5vw;}
  .sec-head{text-align:center;margin-bottom:3rem;}
  .sec-tag{font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:.75rem;}
  .sec-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:700;letter-spacing:-.02em;}
  .menu-cats{display:flex;gap:.75rem;justify-content:center;margin-bottom:2.5rem;flex-wrap:wrap;}
  .cat{padding:.375rem 1.25rem;border-radius:9999px;font-size:.8125rem;font-weight:600;cursor:pointer;border:1px solid var(--border);color:var(--muted);transition:all .2s;}
  .cat.active,.cat:hover{background:var(--accent);border-color:var(--accent);color:#fff;}
  .menu-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1px;background:var(--border);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
  .menu-item{background:var(--bg);padding:1.75rem;display:flex;justify-content:space-between;gap:1rem;transition:background .2s;}
  .menu-item:hover{background:var(--bg2);}
  .menu-item-info h4{font-family:'Cormorant Garamond',serif;font-size:1.1875rem;font-weight:600;margin-bottom:.25rem;}
  .menu-item-info p{font-size:.8125rem;color:var(--muted);line-height:1.6;}
  .menu-price{font-size:1.125rem;font-weight:700;color:var(--gold);white-space:nowrap;}

  /* AMBIENCE */
  .ambience{background:var(--bg2);padding:5rem 5vw;}
  .amb-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;}
  .amb-visual{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}
  .amb-img{border-radius:12px;aspect-ratio:1;background:linear-gradient(135deg,var(--bg3),var(--bg2));border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:2.5rem;}
  .amb-img.tall{grid-row:span 2;aspect-ratio:auto;}
  @media(max-width:768px){.amb-grid{grid-template-columns:1fr;}}

  /* RESERVATION */
  .reserve{padding:5rem 5vw;text-align:center;}
  .res-form{max-width:500px;margin:2.5rem auto 0;display:grid;gap:1rem;}
  .res-form input,.res-form select{width:100%;padding:.875rem 1rem;background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;transition:border-color .2s;}
  .res-form input:focus,.res-form select:focus{border-color:var(--accent);}
  .res-form input::placeholder{color:var(--muted);}
  .res-form select option{background:var(--bg2);}
  .res-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
  @media(max-width:480px){.res-row{grid-template-columns:1fr;}}

  footer{border-top:1px solid var(--border);padding:2.5rem 5vw;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
  .foot-logo{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:700;color:var(--gold);}
  .foot-info{font-size:.8rem;color:var(--muted);text-align:right;}
</style>
</head>
<body>

<nav>
  <div class="logo">Ember</div>
  <ul class="nav-links">
    <li><a href="#menu">Menu</a></li>
    <li><a href="#ambience">Ambience</a></li>
    <li><a href="#reserve">Reservations</a></li>
  </ul>
  <a href="#reserve" class="res-btn">Reserve a Table</a>
  <div class="ham" onclick="document.getElementById('mob').classList.toggle('open')">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mob" id="mob">
  <a href="#menu">Menu</a>
  <a href="#ambience">Ambience</a>
  <a href="#reserve">Reserve a Table →</a>
</div>

<section class="hero">
  <div>
    <div class="hero-sub">Est. 2019 · Downtown</div>
    <h1>Fire, Flavour,<br><em>& Soul</em></h1>
    <div class="divider"></div>
    <p>A modern grill where every dish tells a story. Open-fire cooking, seasonal ingredients, and an atmosphere that makes every night unforgettable.</p>
    <div class="hero-btns">
      <a href="#reserve" class="btn-fire">Book a Table</a>
      <a href="#menu" class="btn-ghost">View Menu</a>
    </div>
    <div class="hours">Open <strong>Tue – Sun</strong>, 5 PM – 11 PM &nbsp;·&nbsp; <strong>+1 (555) 823-0042</strong></div>
  </div>
</section>

<section class="sec" id="menu">
  <div class="sec-head">
    <div class="sec-tag">Seasonal Menu</div>
    <div class="sec-title">Crafted with fire</div>
  </div>
  <div class="menu-cats">
    <div class="cat active">Starters</div>
    <div class="cat">Mains</div>
    <div class="cat">Sides</div>
    <div class="cat">Desserts</div>
    <div class="cat">Drinks</div>
  </div>
  <div class="menu-grid">
    <div class="menu-item"><div class="menu-item-info"><h4>Charred Bone Marrow</h4><p>Sourdough toast, chimichurri, pickled shallots</p></div><div class="menu-price">$18</div></div>
    <div class="menu-item"><div class="menu-item-info"><h4>Heirloom Tomato Salad</h4><p>Whipped ricotta, basil oil, aged balsamic</p></div><div class="menu-price">$14</div></div>
    <div class="menu-item"><div class="menu-item-info"><h4>Wood-Fired Scallops</h4><p>Cauliflower purée, crispy capers, lemon butter</p></div><div class="menu-price">$22</div></div>
    <div class="menu-item"><div class="menu-item-info"><h4>Smoked Duck Rillettes</h4><p>Cornichons, grain mustard, grilled crostini</p></div><div class="menu-price">$16</div></div>
    <div class="menu-item"><div class="menu-item-info"><h4>Coal-Roasted Beets</h4><p>Goat cheese mousse, candied walnuts, dill</p></div><div class="menu-price">$13</div></div>
    <div class="menu-item"><div class="menu-item-info"><h4>Ember Calamari</h4><p>Harissa aioli, charred lemon, micro herbs</p></div><div class="menu-price">$17</div></div>
  </div>
</section>

<section class="ambience" id="ambience">
  <div class="amb-grid">
    <div>
      <div class="sec-tag">The Experience</div>
      <div class="sec-title">More than a meal</div>
      <div style="width:50px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:1.25rem 0;"></div>
      <p style="color:var(--muted);line-height:1.8;margin-bottom:1.5rem;">Set in a converted warehouse with exposed brick, low lighting, and the mesmerising glow of open flames — Ember is designed for moments that linger long after the last bite.</p>
      <p style="color:var(--muted);line-height:1.8;margin-bottom:2rem;">Private dining available for groups of 8–30. Our sommelier curates wine pairings for every table.</p>
      <a href="#reserve" class="btn-fire">Reserve your evening</a>
    </div>
    <div class="amb-visual">
      <div class="amb-img tall" style="font-size:3rem;">🔥</div>
      <div class="amb-img">🍷</div>
      <div class="amb-img">🥩</div>
    </div>
  </div>
</section>

<section class="reserve" id="reserve">
  <div class="sec-tag">Reservations</div>
  <div class="sec-title">Book your table</div>
  <form class="res-form" onsubmit="return false;">
    <div class="res-row">
      <input type="text" placeholder="First name">
      <input type="text" placeholder="Last name">
    </div>
    <input type="email" placeholder="Email address">
    <input type="tel" placeholder="Phone number">
    <div class="res-row">
      <input type="date">
      <select><option value="">Party size</option><option>1–2 guests</option><option>3–4 guests</option><option>5–6 guests</option><option>7+ guests</option></select>
    </div>
    <input type="time" placeholder="Preferred time">
    <button type="submit" class="btn-fire" style="border:none;cursor:pointer;font-size:.9375rem;font-family:inherit;">Confirm Reservation →</button>
  </form>
</section>

<footer>
  <div class="foot-logo">Ember</div>
  <div class="foot-info">
    <p>123 Flame St, Downtown · +1 (555) 823-0042</p>
    <p>Tue–Sun 5 PM–11 PM</p>
  </div>
</footer>

<script>
  document.querySelectorAll('.cat').forEach(c=>c.addEventListener('click',()=>{
    document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
  }));
  document.addEventListener('click',function(e){
    if(!e.target.closest('nav')&&!e.target.closest('#mob'))
      document.getElementById('mob').classList.remove('open');
  });
</script>
</body>
</html>`

// ─────────────────────────────────────────────────────────────────────────────
// 4. VIOLET PORTFOLIO — dark #0f0a1a · purple #a855f7 · creative portfolio
// ─────────────────────────────────────────────────────────────────────────────
const VIOLET_PORTFOLIO = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Violet Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{--bg:#0b0812;--bg2:#130e1f;--bg3:#1a1230;--text:#f3e8ff;--muted:#9d7fc0;--accent:#a855f7;--accent2:#c084fc;--border:#2a1a4a;--radius:14px;}
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}

  nav{position:sticky;top:0;z-index:100;background:rgba(11,8,18,.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;}
  .logo{font-family:'Syne',sans-serif;font-size:1.125rem;font-weight:800;color:var(--text);letter-spacing:-.01em;}
  .logo span{color:var(--accent);}
  .nav-links{display:flex;gap:2rem;list-style:none;}
  .nav-links a{color:var(--muted);text-decoration:none;font-size:.875rem;transition:color .2s;}
  .nav-links a:hover{color:var(--text);}
  .hire-btn{background:var(--accent);color:#fff;padding:.5rem 1.25rem;border-radius:9999px;font-size:.8125rem;font-weight:600;text-decoration:none;transition:all .2s;}
  .hire-btn:hover{background:var(--accent2);transform:translateY(-1px);}
  .ham{display:none;flex-direction:column;gap:5px;cursor:pointer;}
  .ham span{width:22px;height:2px;background:var(--text);border-radius:2px;}
  .mob{display:none;position:fixed;top:64px;left:0;right:0;background:var(--bg2);border-bottom:1px solid var(--border);padding:1.5rem 5vw 2rem;flex-direction:column;gap:1rem;z-index:99;}
  .mob.open{display:flex;}
  .mob a{color:var(--muted);text-decoration:none;font-size:1rem;padding:.5rem 0;border-bottom:1px solid var(--border);}
  @media(max-width:768px){.nav-links,.hire-btn{display:none;}.ham{display:flex;}}

  /* HERO */
  .hero{min-height:90vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:5rem;padding:5rem 5vw;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;right:-15%;bottom:-10%;width:500px;height:500px;background:radial-gradient(circle,rgba(168,85,247,.2) 0%,transparent 65%);pointer-events:none;}
  .hero-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem;}
  .hero-tag::before{content:'';width:24px;height:1px;background:var(--accent);}
  .hero h1{font-family:'Syne',sans-serif;font-size:clamp(2.5rem,5.5vw,4rem);font-weight:800;line-height:1.05;letter-spacing:-.04em;margin-bottom:1.5rem;}
  .hero h1 .hi{color:var(--muted);font-weight:400;}
  .hero p{color:var(--muted);line-height:1.8;margin-bottom:2rem;font-size:1.0625rem;}
  .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;}
  .btn-p{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-weight:600;padding:.875rem 1.75rem;border-radius:9999px;text-decoration:none;font-size:.9rem;transition:all .2s;}
  .btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(168,85,247,.35);}
  .btn-s{color:var(--text);font-weight:500;padding:.875rem 1.75rem;border-radius:9999px;text-decoration:none;font-size:.9rem;border:1px solid var(--border);transition:all .2s;}
  .btn-s:hover{border-color:var(--accent);}
  .hero-stats{display:flex;gap:2.5rem;margin-top:3rem;}
  .hs{display:flex;flex-direction:column;}
  .hs-num{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--text);letter-spacing:-.04em;}
  .hs-label{font-size:.75rem;color:var(--muted);}
  .hero-avatar{width:100%;max-width:400px;aspect-ratio:1;background:linear-gradient(135deg,var(--bg3),var(--bg2));border:1px solid var(--border);border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:5rem;position:relative;overflow:hidden;}
  .hero-avatar::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(168,85,247,.1),transparent);}
  @media(max-width:768px){.hero{grid-template-columns:1fr;}.hero-avatar{display:none;}}

  /* WORK */
  .sec{padding:5rem 5vw;}
  .sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2.5rem;gap:1rem;flex-wrap:wrap;}
  .sec-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);margin-bottom:.5rem;}
  .sec-title{font-family:'Syne',sans-serif;font-size:clamp(1.75rem,4vw,2.5rem);font-weight:800;letter-spacing:-.035em;}
  .see-all{color:var(--muted);text-decoration:none;font-size:.875rem;font-weight:500;white-space:nowrap;transition:color .2s;}
  .see-all:hover{color:var(--accent);}
  .work-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.25rem;}
  .work-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all .25s;cursor:default;}
  .work-card:hover{border-color:var(--accent);transform:translateY(-4px);}
  .work-thumb{height:200px;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,var(--bg3),var(--bg2));border-bottom:1px solid var(--border);}
  .work-body{padding:1.5rem;}
  .work-tags{display:flex;gap:.5rem;margin-bottom:.75rem;flex-wrap:wrap;}
  .tag{background:rgba(168,85,247,.1);border:1px solid rgba(168,85,247,.2);color:var(--accent);font-size:.7rem;font-weight:600;padding:.2rem .625rem;border-radius:9999px;}
  .work-card h3{font-family:'Syne',sans-serif;font-size:1.0625rem;font-weight:700;margin-bottom:.375rem;}
  .work-card p{font-size:.8125rem;color:var(--muted);}

  /* SKILLS */
  .skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-top:2.5rem;}
  .skill{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:1.5rem;}
  .skill h4{font-size:.9375rem;font-weight:600;margin-bottom:1rem;}
  .skill-bar{height:4px;background:var(--bg3);border-radius:9999px;overflow:hidden;margin-bottom:.5rem;}
  .skill-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:9999px;}
  .skill-label{display:flex;justify-content:space-between;font-size:.75rem;color:var(--muted);}

  /* CONTACT */
  .contact{background:var(--bg2);border-radius:24px;margin:0 0 5rem;padding:5rem 5vw;text-align:center;}
  .contact h2{font-family:'Syne',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:800;letter-spacing:-.04em;margin-bottom:1rem;}
  .contact h2 span{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .contact p{color:var(--muted);margin-bottom:2rem;}
  .contact-form{max-width:480px;margin:0 auto;display:flex;flex-direction:column;gap:1rem;}
  .contact-form input,.contact-form textarea{padding:.875rem 1rem;background:var(--bg3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;transition:border-color .2s;}
  .contact-form input:focus,.contact-form textarea:focus{border-color:var(--accent);}
  .contact-form input::placeholder,.contact-form textarea::placeholder{color:var(--muted);}
  .contact-form textarea{resize:vertical;min-height:100px;}

  footer{border-top:1px solid var(--border);padding:2rem 5vw;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
  .foot-copy{font-size:.8rem;color:var(--muted);}
  .socials{display:flex;gap:1rem;}
  .socials a{color:var(--muted);text-decoration:none;font-size:.8rem;transition:color .2s;}
  .socials a:hover{color:var(--accent);}
</style>
</head>
<body>

<nav>
  <div class="logo">Alex<span>.</span>Studio</div>
  <ul class="nav-links">
    <li><a href="#work">Work</a></li>
    <li><a href="#skills">Skills</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <a href="#contact" class="hire-btn">Hire Me</a>
  <div class="ham" onclick="document.getElementById('mob').classList.toggle('open')">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mob" id="mob">
  <a href="#work">Work</a>
  <a href="#skills">Skills</a>
  <a href="#contact">Hire Me →</a>
</div>

<section class="hero">
  <div>
    <div class="hero-tag">UI/UX Designer & Developer</div>
    <h1><span class="hi">Hi, I'm Alex —</span><br>I craft digital experiences that matter</h1>
    <p>Senior product designer with 8 years crafting interfaces for startups and Fortune 500s. I turn complex problems into elegant, user-centred solutions.</p>
    <div class="hero-btns">
      <a href="#work" class="btn-p">View my work →</a>
      <a href="#contact" class="btn-s">Let's talk</a>
    </div>
    <div class="hero-stats">
      <div class="hs"><span class="hs-num">8+</span><span class="hs-label">Years exp.</span></div>
      <div class="hs"><span class="hs-num">60+</span><span class="hs-label">Projects</span></div>
      <div class="hs"><span class="hs-num">98%</span><span class="hs-label">Happy clients</span></div>
    </div>
  </div>
  <div class="hero-avatar">🧑‍💻</div>
</section>

<section class="sec" id="work">
  <div class="sec-head">
    <div><div class="sec-tag">Portfolio</div><div class="sec-title">Selected work</div></div>
    <a href="#" class="see-all">View all →</a>
  </div>
  <div class="work-grid">
    <div class="work-card"><div class="work-thumb">🏦</div><div class="work-body"><div class="work-tags"><span class="tag">Fintech</span><span class="tag">UX</span></div><h3>NeoBank Dashboard</h3><p>Redesigned the core banking experience for 1.2M users. +34% task completion.</p></div></div>
    <div class="work-card"><div class="work-thumb">🛍️</div><div class="work-body"><div class="work-tags"><span class="tag">E-commerce</span><span class="tag">Mobile</span></div><h3>Shōp Mobile App</h3><p>End-to-end shopping experience. Increased conversion by 28% post-launch.</p></div></div>
    <div class="work-card"><div class="work-thumb">🤖</div><div class="work-body"><div class="work-tags"><span class="tag">SaaS</span><span class="tag">Design System</span></div><h3>Orion AI Platform</h3><p>Design system and dashboard for an AI analytics product used by 300+ teams.</p></div></div>
  </div>
</section>

<section class="sec" id="skills">
  <div class="sec-tag">Expertise</div>
  <div class="sec-title">Skills & tools</div>
  <div class="skills-grid">
    <div class="skill"><h4>UI Design</h4><div class="skill-bar"><div class="skill-fill" style="width:95%"></div></div><div class="skill-label"><span>Figma, Framer</span><span>95%</span></div></div>
    <div class="skill"><h4>Frontend Dev</h4><div class="skill-bar"><div class="skill-fill" style="width:85%"></div></div><div class="skill-label"><span>React, TypeScript</span><span>85%</span></div></div>
    <div class="skill"><h4>UX Research</h4><div class="skill-bar"><div class="skill-fill" style="width:90%"></div></div><div class="skill-label"><span>Interviews, Testing</span><span>90%</span></div></div>
    <div class="skill"><h4>Motion Design</h4><div class="skill-bar"><div class="skill-fill" style="width:75%"></div></div><div class="skill-label"><span>After Effects</span><span>75%</span></div></div>
  </div>
</section>

<div class="contact" id="contact">
  <div class="sec-tag">Contact</div>
  <h2>Let's build something <span>great</span></h2>
  <p>Available for freelance projects and full-time roles. Response within 24h.</p>
  <form class="contact-form" onsubmit="return false;">
    <input type="text" placeholder="Your name">
    <input type="email" placeholder="Email address">
    <textarea placeholder="Tell me about your project…"></textarea>
    <button type="submit" class="btn-p" style="border:none;cursor:pointer;font-size:.9375rem;font-family:inherit;justify-content:center;">Send message →</button>
  </form>
</div>

<footer>
  <p class="foot-copy">© 2025 Alex Studio. Made with ☕ and intention.</p>
  <div class="socials">
    <a href="#">Twitter</a>
    <a href="#">LinkedIn</a>
    <a href="#">Dribbble</a>
    <a href="#">GitHub</a>
  </div>
</footer>

<script>
  document.addEventListener('click',function(e){
    if(!e.target.closest('nav')&&!e.target.closest('#mob'))
      document.getElementById('mob').classList.remove('open');
  });
</script>
</body>
</html>`

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROSE STUDIO — dark rose #1a0a10 · pink #fb7185 · lifestyle / beauty
// ─────────────────────────────────────────────────────────────────────────────
const ROSE_STUDIO = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rose Studio</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root{--bg:#12060a;--bg2:#1e0d14;--bg3:#28111c;--text:#ffe4e6;--muted:#c084a0;--accent:#fb7185;--accent2:#f472b6;--border:#3d1020;--radius:16px;}
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}

  nav{position:sticky;top:0;z-index:100;background:rgba(18,6,10,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;}
  .logo{font-family:'Playfair Display',serif;font-size:1.375rem;color:var(--text);letter-spacing:.02em;}
  .nav-links{display:flex;gap:2rem;list-style:none;}
  .nav-links a{color:var(--muted);text-decoration:none;font-size:.875rem;font-weight:300;letter-spacing:.04em;transition:color .2s;}
  .nav-links a:hover{color:var(--text);}
  .shop-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;padding:.5rem 1.375rem;border-radius:9999px;font-size:.8125rem;font-weight:600;text-decoration:none;transition:all .2s;}
  .shop-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(251,113,133,.3);}
  .ham{display:none;flex-direction:column;gap:5px;cursor:pointer;}
  .ham span{width:22px;height:2px;background:var(--text);border-radius:2px;}
  .mob{display:none;position:fixed;top:68px;left:0;right:0;background:var(--bg2);border-bottom:1px solid var(--border);padding:1.5rem 5vw 2rem;flex-direction:column;gap:1rem;z-index:99;}
  .mob.open{display:flex;}
  .mob a{color:var(--muted);text-decoration:none;font-size:1rem;padding:.5rem 0;border-bottom:1px solid var(--border);}
  @media(max-width:768px){.nav-links,.shop-btn{display:none;}.ham{display:flex;}}

  /* HERO */
  .hero{min-height:88vh;display:grid;grid-template-columns:1fr 1fr;gap:0;overflow:hidden;}
  .hero-left{display:flex;flex-direction:column;justify-content:center;padding:5rem 4rem 5rem 5vw;position:relative;}
  .hero-left::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 0% 50%,rgba(251,113,133,.07) 0%,transparent 65%);pointer-events:none;}
  .hero-eyebrow{font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem;}
  .hero h1{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,5.5vw,4.5rem);font-weight:700;line-height:1.1;letter-spacing:-.01em;margin-bottom:1.5rem;}
  .hero h1 em{font-style:italic;color:var(--accent);}
  .hero p{color:var(--muted);font-weight:300;font-size:1.05rem;line-height:1.8;margin-bottom:2.5rem;max-width:420px;}
  .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;}
  .btn-rose{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-weight:600;padding:.875rem 1.75rem;border-radius:9999px;text-decoration:none;font-size:.9rem;transition:all .2s;}
  .btn-rose:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(251,113,133,.3);}
  .btn-bare{color:var(--text);font-weight:400;padding:.875rem 1.75rem;border-radius:9999px;text-decoration:none;font-size:.9rem;border:1px solid var(--border);transition:all .2s;letter-spacing:.04em;}
  .btn-bare:hover{border-color:var(--accent);color:var(--accent);}
  .hero-right{background:linear-gradient(135deg,var(--bg3),var(--bg2));display:flex;align-items:center;justify-content:center;font-size:6rem;position:relative;overflow:hidden;border-left:1px solid var(--border);}
  .hero-right::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 60% 40%,rgba(251,113,133,.12) 0%,transparent 60%);}
  @media(max-width:768px){.hero{grid-template-columns:1fr;min-height:auto;}.hero-left{padding:4rem 5vw;}.hero-right{height:280px;}}

  /* PRODUCTS */
  .sec{padding:5rem 5vw;}
  .sec-head{text-align:center;margin-bottom:3rem;}
  .sec-eyebrow{font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.75rem;}
  .sec-title{font-family:'Playfair Display',serif;font-size:clamp(1.75rem,4vw,3rem);font-weight:700;letter-spacing:-.01em;}
  .products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem;}
  .product{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all .25s;cursor:pointer;}
  .product:hover{border-color:var(--accent);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.3);}
  .product-img{height:220px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;background:linear-gradient(135deg,var(--bg3),var(--bg2));border-bottom:1px solid var(--border);}
  .product-info{padding:1.25rem;}
  .product-cat{font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.375rem;}
  .product-name{font-family:'Playfair Display',serif;font-size:1.0625rem;margin-bottom:.5rem;}
  .product-row{display:flex;justify-content:space-between;align-items:center;}
  .product-price{font-size:1.0625rem;font-weight:600;color:var(--accent);}
  .add-btn{background:transparent;border:1px solid var(--border);color:var(--text);padding:.375rem .875rem;border-radius:9999px;font-size:.75rem;cursor:pointer;transition:all .2s;font-family:inherit;}
  .add-btn:hover{background:var(--accent);border-color:var(--accent);color:#fff;}

  /* VALUES */
  .values{background:var(--bg2);padding:5rem 5vw;}
  .values-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2rem;margin-top:3rem;}
  .value{text-align:center;}
  .value-icon{width:56px;height:56px;background:rgba(251,113,133,.08);border:1px solid rgba(251,113,133,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 1rem;}
  .value h4{font-family:'Playfair Display',serif;font-size:1.0625rem;margin-bottom:.5rem;}
  .value p{font-size:.8125rem;color:var(--muted);font-weight:300;line-height:1.7;}

  /* NEWSLETTER */
  .newsletter{padding:5rem 5vw;text-align:center;}
  .newsletter h2{font-family:'Playfair Display',serif;font-size:clamp(1.75rem,4vw,2.75rem);margin-bottom:1rem;}
  .newsletter p{color:var(--muted);margin-bottom:2rem;font-weight:300;}
  .email-form{display:flex;gap:.75rem;max-width:420px;margin:0 auto;flex-wrap:wrap;justify-content:center;}
  .email-form input{flex:1;min-width:220px;padding:.875rem 1.25rem;background:var(--bg2);border:1px solid var(--border);border-radius:9999px;color:var(--text);font-size:.9rem;outline:none;font-family:inherit;transition:border-color .2s;}
  .email-form input:focus{border-color:var(--accent);}
  .email-form input::placeholder{color:var(--muted);}

  footer{border-top:1px solid var(--border);padding:2.5rem 5vw;display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;align-items:start;}
  .foot-brand .logo{font-size:1.25rem;margin-bottom:.5rem;display:block;}
  .foot-brand p{font-size:.8rem;color:var(--muted);font-weight:300;max-width:200px;}
  .foot-col h5{font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.75rem;}
  .foot-col a{display:block;color:var(--muted);text-decoration:none;font-size:.8125rem;font-weight:300;margin-bottom:.5rem;transition:color .2s;}
  .foot-col a:hover{color:var(--accent);}
  @media(max-width:640px){footer{grid-template-columns:1fr;}}
</style>
</head>
<body>

<nav>
  <div class="logo">Rosé</div>
  <ul class="nav-links">
    <li><a href="#products">Shop</a></li>
    <li><a href="#values">About</a></li>
    <li><a href="#newsletter">Journal</a></li>
    <li><a href="#">Stockists</a></li>
  </ul>
  <a href="#products" class="shop-btn">Shop Now</a>
  <div class="ham" onclick="document.getElementById('mob').classList.toggle('open')">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mob" id="mob">
  <a href="#products">Shop</a>
  <a href="#values">About</a>
  <a href="#newsletter">Journal</a>
  <a href="#products">Shop Now →</a>
</div>

<section class="hero">
  <div class="hero-left">
    <div class="hero-eyebrow">New Collection · Spring 2025</div>
    <h1>Beauty rooted in <em>nature</em></h1>
    <p>Crafted from sustainably sourced botanicals. Skincare rituals designed to nourish, protect, and renew — for every skin type.</p>
    <div class="hero-btns">
      <a href="#products" class="btn-rose">Shop the Collection</a>
      <a href="#values" class="btn-bare">Our Story</a>
    </div>
  </div>
  <div class="hero-right">🌸</div>
</section>

<section class="sec" id="products">
  <div class="sec-head">
    <div class="sec-eyebrow">Bestsellers</div>
    <div class="sec-title">The essentials</div>
  </div>
  <div class="products-grid">
    <div class="product"><div class="product-img">🧴</div><div class="product-info"><div class="product-cat">Serums</div><div class="product-name">Rose Petal Serum</div><div class="product-row"><span class="product-price">$58</span><button class="add-btn">Add to bag</button></div></div></div>
    <div class="product"><div class="product-img">🌿</div><div class="product-info"><div class="product-cat">Moisturisers</div><div class="product-name">Botanical Créme</div><div class="product-row"><span class="product-price">$72</span><button class="add-btn">Add to bag</button></div></div></div>
    <div class="product"><div class="product-img">✨</div><div class="product-info"><div class="product-cat">Masks</div><div class="product-name">Glow Ritual Mask</div><div class="product-row"><span class="product-price">$44</span><button class="add-btn">Add to bag</button></div></div></div>
    <div class="product"><div class="product-img">🫧</div><div class="product-info"><div class="product-cat">Cleansers</div><div class="product-name">Micellar Bloom</div><div class="product-row"><span class="product-price">$36</span><button class="add-btn">Add to bag</button></div></div></div>
  </div>
</section>

<section class="values" id="values">
  <div class="sec-head">
    <div class="sec-eyebrow">Our Values</div>
    <div class="sec-title">Why Rosé</div>
  </div>
  <div class="values-grid">
    <div class="value"><div class="value-icon">🌱</div><h4>100% Natural</h4><p>No parabens, sulphates, or synthetic fragrances. Ever.</p></div>
    <div class="value"><div class="value-icon">♻️</div><h4>Sustainable</h4><p>Recyclable packaging and carbon-neutral shipping worldwide.</p></div>
    <div class="value"><div class="value-icon">🐇</div><h4>Cruelty-Free</h4><p>Certified by Leaping Bunny. Never tested on animals.</p></div>
    <div class="value"><div class="value-icon">🔬</div><h4>Clinically Tested</h4><p>Dermatologist tested and approved for all skin types.</p></div>
  </div>
</section>

<section class="newsletter" id="newsletter">
  <h2>Join the ritual</h2>
  <p>Beauty tips, new launches, and exclusive offers — delivered monthly.</p>
  <form class="email-form" onsubmit="return false;">
    <input type="email" placeholder="Your email address">
    <button type="submit" class="btn-rose" style="border:none;cursor:pointer;font-family:inherit;font-size:.875rem;white-space:nowrap;">Subscribe →</button>
  </form>
</section>

<footer>
  <div class="foot-brand">
    <span class="logo">Rosé</span>
    <p>Beauty rooted in nature since 2020.</p>
  </div>
  <div class="foot-col">
    <h5>Shop</h5>
    <a href="#">Serums</a>
    <a href="#">Moisturisers</a>
    <a href="#">Cleansers</a>
    <a href="#">Gift Sets</a>
  </div>
  <div class="foot-col">
    <h5>Company</h5>
    <a href="#">About Us</a>
    <a href="#">Sustainability</a>
    <a href="#">Press</a>
    <a href="#">Contact</a>
  </div>
</footer>

<script>
  document.addEventListener('click',function(e){
    if(!e.target.closest('nav')&&!e.target.closest('#mob'))
      document.getElementById('mob').classList.remove('open');
  });
</script>
</body>
</html>`

// ─────────────────────────────────────────────────────────────────────────────
// 6. IVORY PRO — light #f8f9fa · blue #2563eb · corporate / B2B
// ─────────────────────────────────────────────────────────────────────────────
const IVORY_PRO = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ivory Pro</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{--bg:#f8f9fa;--bg2:#ffffff;--bg3:#f1f5f9;--text:#0f172a;--muted:#64748b;--accent:#2563eb;--accent2:#3b82f6;--border:#e2e8f0;--radius:12px;}
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'DM Sans',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}

  nav{position:sticky;top:0;z-index:100;background:rgba(248,249,250,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;}
  .logo{font-size:1.125rem;font-weight:700;color:var(--text);letter-spacing:-.02em;}
  .logo span{color:var(--accent);}
  .nav-links{display:flex;gap:2rem;list-style:none;}
  .nav-links a{color:var(--muted);text-decoration:none;font-size:.875rem;font-weight:500;transition:color .2s;}
  .nav-links a:hover{color:var(--text);}
  .nav-demo{background:var(--accent);color:#fff;padding:.5rem 1.25rem;border-radius:8px;font-size:.8125rem;font-weight:600;text-decoration:none;transition:all .2s;}
  .nav-demo:hover{background:var(--accent2);transform:translateY(-1px);}
  .ham{display:none;flex-direction:column;gap:5px;cursor:pointer;}
  .ham span{width:22px;height:2px;background:var(--text);border-radius:2px;}
  .mob{display:none;position:fixed;top:64px;left:0;right:0;background:var(--bg2);border-bottom:1px solid var(--border);padding:1.5rem 5vw 2rem;flex-direction:column;gap:1rem;z-index:99;box-shadow:0 8px 24px rgba(0,0,0,.08);}
  .mob.open{display:flex;}
  .mob a{color:var(--muted);text-decoration:none;font-size:1rem;padding:.5rem 0;border-bottom:1px solid var(--border);}
  @media(max-width:768px){.nav-links,.nav-demo{display:none;}.ham{display:flex;}}

  /* HERO */
  .hero{padding:5rem 5vw 4rem;text-align:center;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(37,99,235,.06) 0%,transparent 60%);pointer-events:none;}
  .hero-badge{display:inline-flex;align-items:center;gap:.5rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:9999px;padding:.375rem 1rem;font-size:.75rem;font-weight:600;color:var(--accent);margin-bottom:2rem;}
  .hero h1{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:700;line-height:1.05;letter-spacing:-.04em;margin-bottom:1.5rem;max-width:800px;margin-left:auto;margin-right:auto;}
  .hero h1 span{color:var(--accent);}
  .hero p{color:var(--muted);font-size:1.125rem;max-width:560px;margin:0 auto 2.5rem;line-height:1.75;}
  .hero-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
  .btn-p{background:var(--accent);color:#fff;font-weight:600;padding:.875rem 1.75rem;border-radius:8px;text-decoration:none;font-size:.9375rem;transition:all .2s;display:inline-flex;align-items:center;gap:.5rem;}
  .btn-p:hover{background:var(--accent2);transform:translateY(-1px);box-shadow:0 4px 20px rgba(37,99,235,.25);}
  .btn-s{color:var(--text);font-weight:500;padding:.875rem 1.75rem;border-radius:8px;text-decoration:none;font-size:.9375rem;border:1px solid var(--border);transition:all .2s;background:var(--bg2);}
  .btn-s:hover{border-color:var(--accent);color:var(--accent);}
  .trust-logos{margin-top:4rem;display:flex;flex-direction:column;align-items:center;gap:1.5rem;}
  .trust-logos p{font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600;}
  .logos-row{display:flex;gap:2.5rem;align-items:center;flex-wrap:wrap;justify-content:center;}
  .logos-row span{font-size:.875rem;font-weight:700;color:#94a3b8;letter-spacing:-.01em;}

  /* FEATURES */
  .sec{padding:5rem 5vw;}
  .sec-center{text-align:center;}
  .chip{display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:9999px;padding:.25rem .875rem;font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;}
  .sec-title{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:700;letter-spacing:-.04em;margin-bottom:.75rem;}
  .sec-sub{color:var(--muted);font-size:1.0625rem;max-width:500px;margin:0 auto;}
  .features{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:3.5rem;}
  .feat{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;transition:all .2s;}
  .feat:hover{border-color:var(--accent2);box-shadow:0 4px 20px rgba(37,99,235,.08);}
  .feat-icon{width:44px;height:44px;background:#eff6ff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;margin-bottom:1.25rem;}
  .feat h3{font-size:1rem;font-weight:600;margin-bottom:.5rem;}
  .feat p{font-size:.875rem;color:var(--muted);line-height:1.65;}

  /* TESTIMONIALS */
  .testimonials{background:var(--bg3);padding:5rem 5vw;}
  .testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:3rem;}
  .testi{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:1.75rem;}
  .testi-quote{font-size:.9375rem;line-height:1.75;color:var(--text);margin-bottom:1.25rem;}
  .testi-author{display:flex;align-items:center;gap:.75rem;}
  .testi-avatar{width:36px;height:36px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8125rem;font-weight:700;color:#fff;}
  .testi-name{font-size:.875rem;font-weight:600;}
  .testi-role{font-size:.75rem;color:var(--muted);}
  .stars{color:#f59e0b;font-size:.875rem;margin-bottom:.75rem;}

  /* METRICS */
  .metrics{padding:5rem 5vw;text-align:center;}
  .metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.5rem;margin-top:3rem;}
  .metric{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;}
  .metric-val{font-size:2.75rem;font-weight:700;color:var(--accent);letter-spacing:-.05em;}
  .metric-label{font-size:.875rem;color:var(--muted);margin-top:.375rem;}

  /* CTA */
  .cta{background:var(--accent);padding:5rem 5vw;text-align:center;margin:0;}
  .cta h2{font-size:clamp(1.75rem,4vw,3rem);font-weight:700;color:#fff;letter-spacing:-.04em;margin-bottom:1rem;}
  .cta p{color:rgba(255,255,255,.8);margin-bottom:2.5rem;font-size:1.0625rem;}
  .btn-white{background:#fff;color:var(--accent);font-weight:700;padding:.875rem 2rem;border-radius:8px;text-decoration:none;font-size:.9375rem;transition:all .2s;}
  .btn-white:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.15);}

  footer{background:var(--text);padding:4rem 5vw 2.5rem;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;}
  .foot-brand .logo{display:block;margin-bottom:.75rem;color:#fff;}
  .foot-brand p{font-size:.8125rem;color:#94a3b8;line-height:1.7;}
  .foot-col h5{font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:.75rem;}
  .foot-col a{display:block;color:#94a3b8;text-decoration:none;font-size:.8125rem;margin-bottom:.5rem;transition:color .2s;}
  .foot-col a:hover{color:#fff;}
  .foot-bottom{background:var(--text);border-top:1px solid #1e293b;padding:1.5rem 5vw;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.75rem;}
  .foot-bottom p{font-size:.75rem;color:#475569;}
  @media(max-width:768px){footer{grid-template-columns:1fr 1fr;}.foot-brand{grid-column:span 2;}.foot-bottom{flex-direction:column;text-align:center;}}
  @media(max-width:480px){footer{grid-template-columns:1fr;}.foot-brand{grid-column:auto;}}
</style>
</head>
<body>

<nav>
  <div class="logo">Ivory<span>.</span>Pro</div>
  <ul class="nav-links">
    <li><a href="#features">Product</a></li>
    <li><a href="#testimonials">Customers</a></li>
    <li><a href="#metrics">Results</a></li>
    <li><a href="#">Pricing</a></li>
  </ul>
  <a href="#" class="nav-demo">Book a Demo</a>
  <div class="ham" onclick="document.getElementById('mob').classList.toggle('open')">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mob" id="mob">
  <a href="#features">Product</a>
  <a href="#testimonials">Customers</a>
  <a href="#metrics">Results</a>
  <a href="#">Book a Demo →</a>
</div>

<section class="hero">
  <div class="hero-badge">🏆 #1 Rated B2B Platform 2025</div>
  <h1>Run your business on <span>one platform</span></h1>
  <p>Ivory Pro connects your teams, automates your operations, and gives you the visibility to make smarter decisions — faster.</p>
  <div class="hero-btns">
    <a href="#" class="btn-p">Get a free demo →</a>
    <a href="#features" class="btn-s">See features</a>
  </div>
  <div class="trust-logos">
    <p>Trusted by 12,000+ companies</p>
    <div class="logos-row">
      <span>Acme Corp</span>
      <span>Veritas</span>
      <span>Nexus</span>
      <span>Meridian</span>
      <span>Stratosphere</span>
    </div>
  </div>
</section>

<section class="sec sec-center" id="features">
  <div class="chip">Platform</div>
  <div class="sec-title">One platform, endless capability</div>
  <p class="sec-sub">Everything your organisation needs — fully integrated and ready on day one.</p>
  <div class="features">
    <div class="feat"><div class="feat-icon">📊</div><h3>Operations Hub</h3><p>Streamline workflows across departments with automated approvals and real-time tracking.</p></div>
    <div class="feat"><div class="feat-icon">💬</div><h3>Team Collaboration</h3><p>Centralise communication, documents, and decisions in one connected workspace.</p></div>
    <div class="feat"><div class="feat-icon">🔍</div><h3>Deep Analytics</h3><p>Customisable dashboards with AI-powered forecasts and executive reporting.</p></div>
    <div class="feat"><div class="feat-icon">🔒</div><h3>Security & Compliance</h3><p>ISO 27001, SOC 2, GDPR. Enterprise-grade security with granular access controls.</p></div>
    <div class="feat"><div class="feat-icon">🔌</div><h3>500+ Integrations</h3><p>Works with Salesforce, HubSpot, SAP, Jira, and every tool you already use.</p></div>
    <div class="feat"><div class="feat-icon">🌍</div><h3>Global Scale</h3><p>Multi-region deployment with 99.99% SLA. Scale to 100k+ users without friction.</p></div>
  </div>
</section>

<section class="testimonials" id="testimonials">
  <div style="text-align:center">
    <div class="chip">Customer Stories</div>
    <div class="sec-title">Loved by operations teams</div>
  </div>
  <div class="testi-grid">
    <div class="testi"><div class="stars">★★★★★</div><p class="testi-quote">"We replaced 4 different tools with Ivory Pro and saved $180k annually. Onboarding took 3 days."</p><div class="testi-author"><div class="testi-avatar">SR</div><div><div class="testi-name">Sarah R.</div><div class="testi-role">COO, Meridian Group</div></div></div></div>
    <div class="testi"><div class="stars">★★★★★</div><p class="testi-quote">"The analytics alone paid for itself. We identified $2M in process inefficiencies in the first month."</p><div class="testi-author"><div class="testi-avatar">MK</div><div><div class="testi-name">Marcus K.</div><div class="testi-role">VP Operations, Nexus</div></div></div></div>
    <div class="testi"><div class="stars">★★★★★</div><p class="testi-quote">"Best enterprise software decision we've made. Support is exceptional and the product keeps improving."</p><div class="testi-author"><div class="testi-avatar">JL</div><div><div class="testi-name">Jennifer L.</div><div class="testi-role">CTO, Stratosphere</div></div></div></div>
  </div>
</section>

<section class="metrics" id="metrics">
  <div class="chip">By the numbers</div>
  <div class="sec-title">Results that speak</div>
  <div class="metrics-grid">
    <div class="metric"><div class="metric-val">68%</div><div class="metric-label">Reduction in manual work</div></div>
    <div class="metric"><div class="metric-val">4.2×</div><div class="metric-label">ROI within 6 months</div></div>
    <div class="metric"><div class="metric-val">99.99%</div><div class="metric-label">Uptime SLA</div></div>
    <div class="metric"><div class="metric-val">3 days</div><div class="metric-label">Average onboarding</div></div>
  </div>
</section>

<section class="cta">
  <h2>See Ivory Pro in action</h2>
  <p>Book a personalised 30-minute demo with our team.</p>
  <a href="#" class="btn-white">Book a free demo →</a>
</section>

<footer>
  <div class="foot-brand">
    <span class="logo" style="font-size:1.125rem;font-weight:700;">Ivory<span style="color:var(--accent)">.</span>Pro</span>
    <p>The operating system for modern businesses. Trusted by 12,000+ companies globally.</p>
  </div>
  <div class="foot-col"><h5>Product</h5><a href="#">Features</a><a href="#">Integrations</a><a href="#">Pricing</a><a href="#">Changelog</a></div>
  <div class="foot-col"><h5>Company</h5><a href="#">About</a><a href="#">Careers</a><a href="#">Blog</a><a href="#">Press</a></div>
  <div class="foot-col"><h5>Support</h5><a href="#">Documentation</a><a href="#">Status</a><a href="#">Contact</a><a href="#">Security</a></div>
</footer>
<div class="foot-bottom">
  <p>© 2025 Ivory Pro Inc. All rights reserved.</p>
  <p>Privacy · Terms · Cookies</p>
</div>

<script>
  document.addEventListener('click',function(e){
    if(!e.target.closest('nav')&&!e.target.closest('#mob'))
      document.getElementById('mob').classList.remove('open');
  });
</script>
</body>
</html>`

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'midnight-saas',
    title: 'Midnight SaaS',
    description: 'Modern tech startup — dark theme, green accent, hero + features + pricing + CTA',
    category: 'professional',
    type: '2d',
    palette: 'dark',
    bundle_html: MIDNIGHT_SAAS,
  },
  {
    id: 'ocean-agency',
    title: 'Ocean Agency',
    description: 'Digital agency — navy/cyan, services grid, stat cards, process steps',
    category: 'professional',
    type: '2d',
    palette: 'ocean',
    bundle_html: OCEAN_AGENCY,
  },
  {
    id: 'ember-restaurant',
    title: 'Ember Restaurant',
    description: 'Upscale restaurant — warm dark, Cormorant serif, menu grid, reservation form',
    category: 'basic',
    type: '2d',
    palette: 'sunset',
    bundle_html: EMBER_RESTAURANT,
  },
  {
    id: 'violet-portfolio',
    title: 'Violet Portfolio',
    description: 'Creative portfolio — purple, Syne font, work grid, skill bars, contact form',
    category: 'basic',
    type: '2d',
    palette: 'purple',
    bundle_html: VIOLET_PORTFOLIO,
  },
  {
    id: 'rose-studio',
    title: 'Rose Studio',
    description: 'Beauty / lifestyle brand — rose palette, Playfair serif, product grid, newsletter',
    category: 'digital-products',
    type: '2d',
    palette: 'rose',
    bundle_html: ROSE_STUDIO,
  },
  {
    id: 'ivory-pro',
    title: 'Ivory Pro',
    description: 'Corporate B2B SaaS — light theme, blue accent, DM Sans, testimonials, metrics',
    category: 'professional',
    type: '2d',
    palette: 'light',
    bundle_html: IVORY_PRO,
  },
]
