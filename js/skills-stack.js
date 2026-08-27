/**
 * Tech stack — polished horizontal lanes
 */
(function () {
  const board = document.getElementById('stack-board');
  if (!board) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LANES = [
    {
      title: 'Languages',
      icon: 'fa-code',
      accent: '#fbbf24',
      blurb: 'Core languages for apps, systems, and scripts',
      skills: ['Python', 'JavaScript', 'TypeScript', 'C/C++', 'SQL', 'HTML/CSS', 'Dart', 'Java'],
    },
    {
      title: 'Frontend',
      icon: 'fa-layer-group',
      accent: '#60a5fa',
      blurb: 'Interfaces, design systems, and mobile surfaces',
      skills: ['React.js', 'Next.js', 'Tailwind CSS', 'Responsive Design'],
    },
    {
      title: 'Backend & Infra',
      icon: 'fa-server',
      accent: '#34d399',
      blurb: 'APIs, auth, containers, and cloud delivery',
      skills: [
        'Node.js',
        'FastAPI',
        'REST API',
        'JWT',
        'OAuth 2.0',
        'RBAC',
        'Docker',
        'Kubernetes',
        'AWS EC2/S3',
        'API Gateway',
      ],
    },
    {
      title: 'Databases',
      icon: 'fa-database',
      accent: '#a78bfa',
      blurb: 'Relational, document, and app data layers',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Prisma', 'Query Optimization'],
    },
    {
      title: 'AI / ML',
      icon: 'fa-brain',
      accent: '#c084fc',
      blurb: 'LLMs, RAG, NLP classifiers, and classical ML',
      skills: [
        'LLMs',
        'RAG',
        'FAISS',
        'Vector Embeddings',
        'Hugging Face',
        'OpenAI API',
        'scikit-learn',
        'NLP',
        'TF-IDF',
        'Pandas',
        'Machine Learning',
        'Model Evaluation',
      ],
    },
    {
      title: 'Tools',
      icon: 'fa-screwdriver-wrench',
      accent: '#94a3b8',
      blurb: 'Workflow, design, and team delivery',
      skills: ['Git/GitHub', 'Postman', 'Figma', 'Bitbucket', 'Agile/Scrum'],
    },
  ];

  const TECH_COLORS = [
    ['python', '#3b82f6'],
    ['javascript', '#eab308'],
    ['typescript', '#3178c6'],
    ['react', '#61dafb'],
    ['next', '#e2e8f0'],
    ['tailwind', '#38bdf8'],
    ['node', '#22c55e'],
    ['fastapi', '#14b8a6'],
    ['docker', '#38bdf8'],
    ['kubernetes', '#60a5fa'],
    ['postgres', '#818cf8'],
    ['mongo', '#4ade80'],
    ['openai', '#10b981'],
    ['langchain', '#2dd4bf'],
    ['bert', '#f472b6'],
    ['flutter', '#38bdf8'],
    ['aws', '#f59e0b'],
    ['gcp', '#4285f4'],
    ['git', '#f87171'],
    ['figma', '#f472b6'],
    ['llm', '#c084fc'],
    ['rag', '#e879f9'],
    ['faiss', '#a78bfa'],
    ['vector', '#818cf8'],
    ['hybrid', '#c084fc'],
    ['nlp', '#f472b6'],
    ['onnx', '#38bdf8'],
    ['scikit', '#f59e0b'],
    ['numpy', '#4b79c5'],
    ['pandas', '#150458'],
    ['prompt', '#a78bfa'],
    ['supervised', '#c084fc'],
    ['feature', '#818cf8'],
    ['preprocessing', '#94a3b8'],
    ['machine learning', '#c084fc'],
    ['python for ml', '#3b82f6'],
    ['model evaluation', '#34d399'],
  ];

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function tagColor(skill, fallback) {
    const s = skill.toLowerCase();
    for (const [key, color] of TECH_COLORS) {
      if (s.includes(key)) return color;
    }
    return fallback;
  }

  function skillTags(skills, accent) {
    return skills
      .map((s) => {
        const c = tagColor(s, accent);
        return `<span class="stack-tag" style="--tag-accent: ${c}">${escapeHtml(s)}</span>`;
      })
      .join('');
  }

  LANES.forEach((lane) => {
    const tags = skillTags(lane.skills, lane.accent);
    const scrollContent = reduced ? tags : tags + tags;

    const article = document.createElement('article');
    article.className = 'stack-lane';
    article.style.setProperty('--lane-accent', lane.accent);
    article.innerHTML = `
      <div class="stack-lane-head">
        <span class="stack-lane-icon" aria-hidden="true"><i class="fa-solid ${lane.icon}"></i></span>
        <div class="stack-lane-titles">
          <h3>${escapeHtml(lane.title)}</h3>
          <p class="stack-lane-blurb">${escapeHtml(lane.blurb)}</p>
        </div>
      </div>
      <div class="stack-lane-rail" tabindex="0" aria-label="${escapeHtml(lane.title)} technologies">
        <div class="stack-lane-fade stack-lane-fade--left" aria-hidden="true"></div>
        <div class="stack-lane-fade stack-lane-fade--right" aria-hidden="true"></div>
        <div class="stack-lane-track${reduced ? ' is-static' : ''}">
          <div class="stack-lane-scroll">${scrollContent}</div>
        </div>
      </div>
    `;
    board.appendChild(article);
  });

  function initLaneScroll() {
    if (reduced) return;

    board.querySelectorAll('.stack-lane').forEach((laneEl, i) => {
      const lane = LANES[i];
      const track = laneEl.querySelector('.stack-lane-track');
      const scroll = laneEl.querySelector('.stack-lane-scroll');
      if (!track || !scroll || !lane || track.dataset.scrollReady === '1') return;

      track.dataset.scrollReady = '1';

      laneEl.addEventListener('mouseenter', () => track.classList.add('is-paused'));
      laneEl.addEventListener('mouseleave', () => track.classList.remove('is-paused'));
      laneEl.addEventListener('focusin', () => track.classList.add('is-paused'));
      laneEl.addEventListener('focusout', () => track.classList.remove('is-paused'));

      const half = scroll.scrollWidth / 2;
      const trackW = track.clientWidth;

      if (half > trackW + 12) {
        scroll.style.setProperty('--scroll-distance', `-${half}px`);
        const duration = Math.max(28, Math.min(55, half / 20));
        scroll.style.setProperty('--scroll-duration', `${duration}s`);
        track.classList.add('is-animating');
      } else {
        track.classList.add('is-static');
        scroll.innerHTML = skillTags(lane.skills, lane.accent);
      }
    });
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(initLaneScroll);
  });
  window.addEventListener('load', initLaneScroll);
})();
