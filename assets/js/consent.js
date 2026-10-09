// Cookie choice bar + Google Analytics. Google's script is loaded only after the visitor clicks Accept;
// until then (and after Decline) nothing is sent. The choice is remembered in this browser, and every
// page's footer has a "Cookie settings" button that shows the bar again.
(() => {
  const ID = 'G-06791W2ELQ', KEY = 'nsc-analytics';
  const saved = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  let loaded = false;
  const start = () => {
    window['ga-disable-' + ID] = false;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (loaded) return;
    loaded = true;
    gtag('js', new Date());
    gtag('config', ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  };
  const stop = () => {
    window['ga-disable-' + ID] = true;
    gtag('consent', 'update', { analytics_storage: 'denied' });
    // Remove the analytics cookies already set (_ga, _ga_<id>) on this host and the parent domain.
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_ga(_|$)/.test(n)).forEach((n) => {
      [location.hostname, '.' + location.hostname.replace(/^www\./, '')].forEach((d) => {
        document.cookie = `${n}=; Max-Age=0; path=/; domain=${d}`;
      });
      document.cookie = `${n}=; Max-Age=0; path=/`;
    });
  };
  // Pages report events through this; it does nothing unless the visitor accepted.
  window.nscEvent = (name, params) => { if (loaded && saved() === 'granted') gtag('event', name, params || {}); };

  if (saved() === 'granted') start();

  const css = `
  .ck { position: fixed; left: 16px; bottom: 16px; z-index: 40; max-width: 520px; box-sizing: border-box;
    background: #101A14; border: 1px solid rgba(160,220,180,.18); border-radius: 16px; padding: 16px 18px;
    box-shadow: 0 16px 40px rgba(0,0,0,.5); color: #C9C3B8; font: 15px/1.55 'Work Sans', system-ui, sans-serif; }
  .ck p { margin: 0 0 12px; }
  .ck a { color: #F3C27A; text-decoration: underline; }
  .ck-btns { display: flex; gap: 10px; flex-wrap: wrap; }
  .ck button { flex: 1 1 120px; min-height: 44px; border-radius: 999px; font: 600 15px 'Work Sans', system-ui, sans-serif; cursor: pointer; }
  .ck-no { background: transparent; color: #FBF8F2; border: 1px solid rgba(255,255,255,.35); }
  .ck-yes { background: #F3961F; color: #17130A; border: 1px solid #F3961F; }
  .ck button:focus-visible, .ck a:focus-visible, .sf-cookie:focus-visible { outline: 2px solid #FBF8F2; outline-offset: 3px; }
  .sf-cookie { background: none; border: 0; padding: 0; font: inherit; color: inherit; text-decoration: underline; cursor: pointer; }
  .sf-cookie:hover { color: #F3961F; }
  @media (max-width: 560px) { .ck { right: 16px; max-width: none; } .sf-cookie { min-height: 44px; } }`;

  const bar = () => {
    if (document.querySelector('.ck')) return;
    const el = document.createElement('div');
    el.className = 'ck'; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Cookie choice');
    el.innerHTML = '<p>We’d like to use Google Analytics cookies to see how visitors use this site. '
      + '<a href="privacy.html#p5">Privacy Notice</a></p>'
      + '<div class="ck-btns"><button type="button" class="ck-no">Decline</button>'
      + '<button type="button" class="ck-yes">Accept</button></div>';
    el.querySelector('.ck-no').addEventListener('click', () => { save('denied'); stop(); el.remove(); });
    el.querySelector('.ck-yes').addEventListener('click', () => { save('granted'); start(); el.remove(); });
    document.body.appendChild(el);
    return el;
  };

  const init = () => {
    const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    document.querySelectorAll('.sf-cookie').forEach((b) => b.addEventListener('click', () => {
      const el = bar(); if (el) el.querySelector(saved() === 'granted' ? '.ck-yes' : '.ck-no').focus();
    }));
    if (!saved()) bar();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
