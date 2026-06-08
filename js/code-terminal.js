/**
 * About terminal — dramatic line typing + run simulation
 */
(function () {
  const terminal = document.getElementById('code-terminal');
  const codeEl = document.getElementById('terminal-code');
  const gutterEl = document.getElementById('terminal-gutter');
  const statusEl = document.getElementById('terminal-status');
  const statusText = statusEl?.querySelector('.status-text');
  const runPanel = document.getElementById('terminal-run');
  const runCmd = document.getElementById('terminal-run-cmd');
  const runLog = document.getElementById('terminal-run-log');
  const progressBar = document.getElementById('terminal-progress-bar');
  const card = document.getElementById('terminal-card');

  if (!terminal || !codeEl || !card) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LINES = [
    { plain: '{', html: '<span class="json-bracket">{</span>' },
    {
      plain: '  "name": "Pradhuman Patel",',
      html: '  <span class="json-key">"name"</span>: <span class="json-str">"Pradhuman Patel"</span>,',
    },
    {
      plain: '  "role": "Frontend + Full-Stack Engineer",',
      html: '  <span class="json-key">"role"</span>: <span class="json-str">"Frontend + Full-Stack Engineer"</span>,',
    },
    {
      plain: '  "education": "UIC CS, May 2027",',
      html: '  <span class="json-key">"education"</span>: <span class="json-str">"UIC CS, May 2027"</span>,',
    },
    {
      plain: '  "gpa": 3.68,',
      html: '  <span class="json-key">"gpa"</span>: <span class="json-num">3.68</span>,',
    },
    {
      plain: '  "apps_shipped": 3,',
      html: '  <span class="json-key">"apps_shipped"</span>: <span class="json-num">3</span>,',
    },
    {
      plain: '  "workflows_automated": "60-80%",',
      html: '  <span class="json-key">"workflows_automated"</span>: <span class="json-str">"60–80%"</span>,',
    },
    {
      plain: '  "seeking": "SWE / AI Engineer Role"',
      html: '  <span class="json-key">"seeking"</span>: <span class="json-str">"SWE / AI Engineer Role"</span>',
    },
    { plain: '}', html: '<span class="json-bracket">}</span>' },
  ];

  const RUN_CMD = 'node validate-profile.js --strict';
  const RUN_LINES = [
    { text: '→ loading pradhuman.json ...', class: 'muted', delay: 0, progress: 12 },
    { text: '✓ parsed 7 fields', class: 'ok', delay: 280, progress: 32 },
    { text: '✓ stack: React · Node · FastAPI · PostgreSQL', class: 'accent', delay: 520, progress: 58 },
    { text: '✓ shipped apps: 3 verified', class: 'ok', delay: 760, progress: 78 },
    { text: '✓ profile ready — deploy allowed', class: 'ok', delay: 1000, progress: 95 },
    { text: 'Done in 0.42s', class: 'warn', delay: 1280, progress: 100 },
  ];

  let played = false;
  let activeLine = null;

  function setStatus(mode, label) {
    if (!statusEl) return;
    statusEl.classList.remove('is-typing', 'is-running');
    if (mode) statusEl.classList.add(mode);
    if (statusText) statusText.textContent = label;
  }

  function updateGutter(count) {
    if (!gutterEl) return;
    gutterEl.innerHTML = Array.from({ length: count }, (_, i) => i + 1).join('<br>');
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function charSpeed(plain, index) {
    const ch = plain[index - 1];
    if (ch === ' ' || ch === '\t') return 8;
    if (ch === '"' || ch === ':' || ch === ',') return 22;
    if (ch === '{' || ch === '}') return 55;
    return 14 + Math.floor(Math.random() * 10);
  }

  function typeLine(plain, html) {
    return new Promise((resolve) => {
      const line = document.createElement('span');
      line.className = 'terminal-line is-active';
      codeEl.appendChild(line);
      activeLine = line;

      if (reduced) {
        line.innerHTML = html;
        line.classList.remove('is-active');
        line.classList.add('line-done');
        resolve();
        return;
      }

      let i = 0;
      const tick = () => {
        line.textContent = plain.slice(0, i);
        i += 1;
        if (i <= plain.length) {
          setTimeout(tick, charSpeed(plain, i));
        } else {
          line.innerHTML = html;
          line.classList.remove('is-active');
          line.classList.add('line-done');
          activeLine = null;
          resolve();
        }
      };
      tick();
    });
  }

  function showFinalCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    cursor.setAttribute('aria-hidden', 'true');
    codeEl.appendChild(cursor);
  }

  async function typeCommand(el, text) {
    if (!el) return;
    if (reduced) {
      el.textContent = text;
      return;
    }

    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cmd-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      await delay(18 + Math.floor(Math.random() * 14));
    }
    cursor.remove();
  }

  function setProgress(pct) {
    if (progressBar) progressBar.style.width = pct + '%';
  }

  async function runSimulation() {
    if (!runPanel || !runCmd || !runLog) return;

    terminal.classList.add('run-flash', 'is-running');
    setTimeout(() => terminal.classList.remove('run-flash'), 600);

    setStatus('is-running', 'running');
    runPanel.hidden = false;
    runLog.innerHTML = '';
    setProgress(0);

    await typeCommand(runCmd, RUN_CMD);

    if (reduced) {
      RUN_LINES.forEach((item) => {
        const line = document.createElement('div');
        line.className = 'run-log-line ' + item.class;
        line.textContent = item.text;
        runLog.appendChild(line);
      });
      setProgress(100);
    } else {
      const start = performance.now();
      const duration = 1500;

      const progressTick = () => {
        if (!terminal.classList.contains('is-running')) return;
        const elapsed = performance.now() - start;
        const auto = Math.min(92, (elapsed / duration) * 92);
        const current = parseFloat(progressBar?.style.width || '0') || 0;
        if (auto > current) setProgress(auto);
        if (elapsed < duration) requestAnimationFrame(progressTick);
      };
      requestAnimationFrame(progressTick);

      for (const item of RUN_LINES) {
        await delay(item.delay);
        const line = document.createElement('div');
        line.className = 'run-log-line ' + item.class;
        line.textContent = item.text;
        runLog.appendChild(line);
        setProgress(item.progress);
      }
      await delay(350);
      setProgress(100);
    }

    setStatus('is-running', 'done');
    terminal.classList.add('run-complete');
    terminal.classList.remove('is-running');
  }

  async function runTyping() {
    codeEl.innerHTML = '';
    terminal.classList.add('is-typing');
    terminal.classList.remove('run-complete', 'is-running');
    if (runPanel) runPanel.hidden = true;
    if (runLog) runLog.innerHTML = '';
    setProgress(0);
    setStatus('is-typing', 'typing');

    updateGutter(LINES.length);

    for (let i = 0; i < LINES.length; i++) {
      await typeLine(LINES[i].plain, LINES[i].html);
      if (i < LINES.length - 1) await delay(28 + i * 4);
    }

    showFinalCursor();
    terminal.classList.remove('is-typing');
    setStatus('', 'ready');
    await delay(480);
    await runSimulation();
  }

  function showStatic() {
    codeEl.innerHTML =
      LINES.map((l) => `<span class="terminal-line">${l.html}</span>`).join('') +
      '<span class="cursor-blink" aria-hidden="true"></span>';
    updateGutter(LINES.length);
    setStatus('', 'ready');
    if (runPanel && runCmd && runLog) {
      runPanel.hidden = false;
      runCmd.textContent = RUN_CMD;
      runLog.innerHTML = '';
      RUN_LINES.forEach((item) => {
        const line = document.createElement('div');
        line.className = 'run-log-line ' + item.class;
        line.textContent = item.text;
        line.style.opacity = '1';
        line.style.transform = 'none';
        runLog.appendChild(line);
      });
      setProgress(100);
    }
    terminal.classList.add('run-complete');
  }

  async function play() {
    if (played) return;
    played = true;
    if (reduced) {
      showStatic();
      return;
    }
    await runTyping();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) play();
      });
    },
    { threshold: 0.22, rootMargin: '0px 0px -8% 0px' }
  );

  observer.observe(card);
})();
