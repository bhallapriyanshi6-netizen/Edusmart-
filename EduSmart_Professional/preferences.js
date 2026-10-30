/* EduSmart shared appearance and personalization settings */
(() => {
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const prefs = read('edusmartPreferences', { theme: 'light', fontSize: 'normal' });
  const applyPrefs = () => {
    document.body.classList.toggle('dark-mode', prefs.theme === 'dark');
    document.body.dataset.fontSize = prefs.fontSize;
    document.documentElement.style.fontSize = prefs.fontSize === 'small' ? '14px' : prefs.fontSize === 'large' ? '18px' : '16px';
    const toggle = document.getElementById('themeToggle');
    if (toggle) { toggle.textContent = prefs.theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'; toggle.setAttribute('aria-pressed', String(prefs.theme === 'dark')); }
    const select = document.getElementById('fontSizeSelect'); if (select) select.value = prefs.fontSize;
  };
  const header = document.querySelector('.site-header');
  if (header && !document.getElementById('themeToggle')) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'theme-toggle'; button.id = 'themeToggle'; button.addEventListener('click', () => { prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark'; write('edusmartPreferences', prefs); applyPrefs(); });
    const profile = header.querySelector('.header-profile');
    if (profile) header.insertBefore(button, profile); else header.appendChild(button);
  }
  const footer = document.querySelector('.site-footer');
  if (footer && !document.getElementById('preferencesPanel')) {
    const panel = document.createElement('section'); panel.id = 'preferencesPanel'; panel.className = 'preferences-panel';
    panel.innerHTML = '<div><h3>Appearance & preferences</h3><p>Choose a comfortable display. Your settings are saved in this browser.</p></div><div class="preference-controls"><label for="fontSizeSelect">Text size</label><select id="fontSizeSelect" aria-label="Choose text size"><option value="small">Small</option><option value="normal">Normal</option><option value="large">Large</option></select></div>';
    footer.parentNode.insertBefore(panel, footer);
    panel.querySelector('#fontSizeSelect').addEventListener('change', event => { prefs.fontSize = event.target.value; write('edusmartPreferences', prefs); applyPrefs(); });
  }
  const student = read('edusmartStudent', {});
  const greeting = document.getElementById('personalGreeting');
  if (greeting) greeting.textContent = `Welcome${student.name ? ', ' + student.name.trim().split(/\s+/)[0] : ''}!`;
  applyPrefs();
})();
