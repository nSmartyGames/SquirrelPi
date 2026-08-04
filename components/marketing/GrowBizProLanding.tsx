export const GROW_BIZ_PRO_HTML = `
<style>
  .gbp-root { all: initial; }
  .gbp-root, .gbp-root * { box-sizing: border-box; }
  .gbp-root {
    --ink:#1B1B18;
    --paper:#FBF7EF;
    --green:#2F4F3E;
    --gold:#C9962C;
    --brick:#A8412F;
    --sage:#DCE4D6;
    --paper-dim:#F1EBDD;
    --orange:#E8601C;
    display:block;
    background:var(--paper);
    color:var(--ink);
    font-family:'Inter',system-ui,sans-serif;
    line-height:1.5;
    min-height:100vh;
  }
  .gbp-root h1,.gbp-root h2,.gbp-root h3{font-family:'Fraunces',Georgia,serif; font-weight:600; letter-spacing:-0.01em; margin:0;}
  .gbp-root a{color:inherit; text-decoration:none;}
  .gbp-root .section{padding:72px 24px;}
  .gbp-root .section h2{font-size:clamp(1.6rem,3.5vw,2.3rem); text-align:center; margin-bottom:14px;}
  .gbp-root .section-sub{text-align:center; opacity:0.7; max-width:560px; margin:0 auto 48px;}
  .gbp-root .features{display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:28px;}
  .gbp-root .feature{padding:28px; background:var(--paper-dim); border-radius:6px; border-left:3px solid var(--gold);}
  .gbp-root .feature h3{font-size:1.1rem; margin-bottom:8px;}
  .gbp-root .feature p{font-size:0.92rem; opacity:0.75; margin:0;}
  .gbp-root .btn{display:inline-block; padding:15px 30px; border-radius:3px; font-weight:600; font-size:1rem;}
  .gbp-root .btn-primary{background:var(--green); color:var(--paper);}
  .gbp-root .pricing-wrap{background:var(--sage); padding:72px 24px;}
  .gbp-root .pricing-grid{display:grid; grid-template-columns:1fr; gap:24px; max-width:880px; margin:0 auto;}
  @media(min-width:760px){.gbp-root .pricing-grid{grid-template-columns:1fr 1fr;}}
  .gbp-root .plan{background:var(--paper); border-radius:6px; padding:36px 30px; position:relative; border:2px solid transparent;}
  .gbp-root .plan.featured{border-color:var(--green); background:var(--ink);}
  .gbp-root .plan-name{font-family:ui-monospace,monospace; font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--brick); margin-bottom:10px;}
  .gbp-root .plan.featured .plan-name{color:var(--gold);}
  .gbp-root .plan h3{font-size:1.5rem; margin-bottom:14px;}
  .gbp-root .plan.featured h3{color:var(--paper);}
  .gbp-root .plan-price{font-family:ui-monospace,monospace; font-size:2.4rem; font-weight:500; margin-bottom:4px;}
  .gbp-root .plan.featured .plan-price{color:var(--paper);}
  .gbp-root .plan-price span{font-size:1rem; opacity:0.6; font-family:'Inter',sans-serif;}
  .gbp-root .plan ul{list-style:none; margin:22px 0 28px; padding:0;}
  .gbp-root .plan li{padding:7px 0; font-size:0.93rem; padding-left:22px; position:relative;}
  .gbp-root .plan.featured li{color:var(--paper); opacity:0.9;}
  .gbp-root .plan li:before{content:"—"; position:absolute; left:0; color:var(--green);}
  .gbp-root .plan.featured li:before{color:var(--gold);}
  .gbp-root .plan .btn{width:100%; text-align:center; box-sizing:border-box;}
  .gbp-root .badge{position:absolute; top:-12px; right:24px; background:var(--gold); color:var(--ink); font-family:ui-monospace,monospace; font-size:0.7rem; padding:5px 12px; border-radius:20px; font-weight:600;}
  .gbp-root .faq-item{border-bottom:1px solid rgba(27,27,24,0.12); padding:20px 0;}
  .gbp-root .faq-item h3{font-size:1.02rem; margin-bottom:8px; font-family:'Inter',sans-serif; font-weight:600;}
  .gbp-root .faq-item p{font-size:0.92rem; opacity:0.75; margin:0;}
  .gbp-root .final-cta{background:var(--green); color:var(--paper); text-align:center; padding:72px 24px;}
  .gbp-root .final-cta h2{color:var(--paper); margin-bottom:16px;}
  .gbp-root .final-cta p{opacity:0.85; margin-bottom:30px;}
  .gbp-root .final-cta .btn-primary{background:var(--gold); color:var(--ink);}
  .gbp-root footer{padding:36px 24px; text-align:center; font-size:0.85rem; opacity:0.6;}
  .gbp-root footer a{text-decoration:underline;}
</style>
<div class="gbp-root">

<section class="section" style="padding-bottom:0; padding-top:56px;">
  <div style="text-align:center; margin-bottom:48px;">
    <p style="font-family:ui-monospace,monospace; font-size:0.85rem; opacity:0.65; margin-bottom:14px;">Vezi planurile mai jos</p>
    <a href="#tarife" class="btn btn-primary">Vezi planurile</a>
  </div>
  <h2>Ce primești</h2>
  <p class="section-sub">Nu vindem șabloane. Vindem încrederea clientului că afacerea ta e serioasă.</p>
  <div class="features">
    <div class="feature">
      <h3>Site gata în 48–72h</h3>
      <p>Trimiți informațiile afacerii tale, noi construim site-ul din biblioteca noastră de șabloane, optimizat pentru mobil.</p>
    </div>
    <div class="feature">
      <h3>Găsibil pe Google</h3>
      <p>Configurare de bază pentru Google Maps și căutări locale — clienții te găsesc când caută exact ce oferi.</p>
    </div>
    <div class="feature">
      <h3>Contact direct, fără fricțiune</h3>
      <p>Buton de apel și WhatsApp direct pe site — clientul te contactează într-un click, nu completează formulare.</p>
    </div>
    <div class="feature">
      <h3>Conținut AI pentru social media</h3>
      <p>În planul complet: 50 de postări generate automat pentru Instagram și Facebook, lunar — fără să stai tu să te gândești ce postezi.</p>
    </div>
  </div>
</section>

<section class="pricing-wrap">
  <h2 style="text-align:center; margin-bottom:12px;">Alege planul tău</h2>
  <p class="section-sub" style="margin-bottom:44px;">Începi mic, treci la planul complet când ești pregătit să crești constant.</p>
  <div class="pricing-grid">
    <div class="plan" id="tarife">
      <div class="plan-name">Start</div>
      <h3>Grow Biz Pro</h3>
      <div class="plan-price">$9.25<span>/lună</span></div>
      <ul>
        <li>1 site profesional, livrat în 48–72h</li>
        <li>Optimizat pentru mobil</li>
        <li>Configurare Google Maps de bază</li>
        <li>Buton de apel / WhatsApp</li>
        <li>Anulezi oricând</li>
      </ul>
      <a href="https://buy.stripe.com/dRm6oG59R2jqbE99KI7kc00" class="btn btn-primary">Începe cu $9.25/lună</a>
    </div>
    <div class="plan featured">
      <span class="badge">Cel mai popular</span>
      <div class="plan-name">Complet</div>
      <h3>Grow Biz Pro — Full</h3>
      <div class="plan-price">$69<span>/lună</span></div>
      <ul>
        <li>Tot ce e în Grow Biz Pro</li>
        <li>Acces la toată biblioteca de șabloane</li>
        <li>50 postări AI Instagram + Facebook / lună</li>
        <li>Suport prioritar</li>
        <li>Actualizări nelimitate ale site-ului</li>
      </ul>
      <a href="https://buy.stripe.com/3cI6oG7hZ9LS7nT9KI7kc01" class="btn btn-primary" style="background:var(--gold); color:var(--ink);">Începe cu $69/lună</a>
    </div>
  </div>
</section>

<section class="section" style="max-width:720px; margin:0 auto;">
  <h2>Întrebări frecvente</h2>
  <div class="faq-item">
    <h3>Cât durează până îmi văd site-ul live?</h3>
    <p>De obicei 48–72 de ore de la trimiterea informațiilor despre afacerea ta (nume, poze, program, contact).</p>
  </div>
  <div class="faq-item">
    <h3>Pot anula oricând?</h3>
    <p>Da. Nu există contract pe termen lung — anulezi din contul tău oricând, fără penalizări.</p>
  </div>
  <div class="faq-item">
    <h3>Ce diferență e între cele două planuri?</h3>
    <p>Grow Biz Pro îți dă site-ul de bază. Planul complet adaugă acces la toate șabloanele și 50 de postări AI lunar pentru Instagram și Facebook.</p>
  </div>
  <div class="faq-item">
    <h3>Am nevoie de cunoștințe tehnice?</h3>
    <p>Deloc. Ne trimiți informațiile afacerii, noi ne ocupăm de tot restul.</p>
  </div>
</section>

<section class="final-cta">
  <h2>Afacerea ta merită să fie găsită.</h2>
  <p>Începe astăzi de la $9.25/lună, sau scrie-ne direct pe WhatsApp pentru întrebări.</p>
  <div>
    <a href="#tarife" class="btn btn-primary">Vezi planurile</a>
    <a href="https://wa.me/40771047048" class="btn" style="border:1.5px solid var(--paper); color:var(--paper); margin-left:14px;">📞 +40 771 047 048</a>
  </div>
</section>

<footer>
  © 2026 allibuild.com — Grow Biz Pro este un serviciu LocalBiz Pro. <a href="mailto:contact@allibuild.com">contact@allibuild.com</a> · <a href="/privacy">Politica de confidențialitate</a>
</footer>

</div>
`

export default function GrowBizProLanding() {
  return <div dangerouslySetInnerHTML={{ __html: GROW_BIZ_PRO_HTML }} />
}
