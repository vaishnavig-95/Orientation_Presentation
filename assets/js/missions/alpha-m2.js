/* ==========================================================================
   ALPHA MISSION 2 — AI Emoji Decoder
   ========================================================================== */

const QUESTIONS = [
  {
    emojis: ['🧠','⬇️','📚'],
    answer: 'Deep Learning',
    desc: 'A subset of Machine Learning that uses multi-layer neural networks to learn patterns from massive datasets.',
    usage: 'Used in: Image recognition, speech assistants, self-driving cars.'
  },
  {
    emojis: ['🧠','🕸️','⚡'],
    answer: 'Neural Network',
    desc: 'A computing model inspired by the human brain that enables AI systems to recognize patterns and make predictions.',
    usage: 'Used in: ChatGPT, recommendation systems, computer vision.'
  },
  {
    emojis: ['👁️','🤖','📷'],
    answer: 'Computer Vision',
    desc: 'Allows computers to understand and interpret images and videos just like humans.',
    usage: 'Used in: Face Unlock, CCTV, autonomous vehicles.'
  },
  {
    emojis: ['🐳','📦','⚙️'],
    answer: 'Docker',
    desc: 'A platform that packages applications and their dependencies into lightweight containers, ensuring consistent operation across systems.',
    usage: 'Used in: Software deployment, cloud applications, DevOps.'
  },
  {
    emojis: ['☸️','🐳','☁️'],
    answer: 'Kubernetes',
    desc: 'An orchestration platform that automates the deployment, scaling, and management of Docker containers.',
    usage: 'Used in: Cloud infrastructure and large-scale applications.'
  },
  {
    emojis: ['👨‍💻','♾️','🚀'],
    answer: 'DevOps',
    desc: 'A culture and set of practices combining software development and IT operations for faster, more reliable software delivery.',
    usage: 'Used in: CI/CD pipelines, automation, cloud engineering.'
  },
  {
    emojis: ['🔐','🔑','📄'],
    answer: 'Encryption',
    desc: 'The process of converting readable information into coded data so only authorized users can access it.',
    usage: 'Used in: Online banking, messaging apps, digital payments.'
  },
  {
    emojis: ['🎣','📧','💰'],
    answer: 'Phishing',
    desc: 'A cyberattack where attackers trick people into revealing sensitive information through fake emails, websites, or messages.',
    usage: 'Always verify links before clicking!'
  },
  {
    emojis: ['🌐','📱','⌚','💡'],
    answer: 'Internet of Things (IoT)',
    desc: 'A network of physical devices connected to the internet that collect and exchange data.',
    usage: 'Examples: Smart watches, smart homes, connected cars.'
  },
  {
    emojis: ['🪙','🔐','🌐'],
    answer: 'Cryptocurrency',
    desc: 'A digital currency secured using cryptography and typically powered by blockchain technology.',
    usage: 'Examples: Bitcoin, Ethereum.'
  },
  {
    emojis: ['💼','🤝','🌐'],
    answer: 'LinkedIn',
    desc: "The world's largest professional networking platform used to build careers, showcase skills, and connect with recruiters.",
    usage: 'Used by: Over 900 million professionals worldwide.'
  },
  {
    emojis: ['🎨','🟣','📐'],
    answer: 'Figma',
    desc: 'A collaborative UI/UX design platform used to design websites, mobile apps, and prototypes.',
    usage: 'Used by: Designers, product teams, and developers.'
  },
  {
    emojis: ['💎','💻'],
    answer: 'Ruby',
    desc: 'A simple and developer-friendly programming language known for its elegant syntax.',
    usage: 'Popular Framework: Ruby on Rails.'
  },
  {
    emojis: ['📄','✍️','☁️'],
    answer: 'Google Docs',
    desc: 'A cloud-based document editor that allows multiple users to collaborate in real time.',
    usage: 'Used by: Students, teams, and professionals worldwide.'
  },
  {
    emojis: ['🐙','📂','💻'],
    answer: 'GitHub',
    desc: 'A platform for hosting and collaborating on code using Git version control.',
    usage: 'Essential for: Developers working on projects together.'
  }
];

const STORY_LINES = [
  { text: 'The Synapse AI has lost its language module.', delay: 200 },
  { text: 'It can no longer communicate using text.', delay: 1400 },
  { text: 'Every message is now encrypted into emojis.', delay: 2600 },
  { text: 'Your mission is to decode each transmission', delay: 3800 },
  { text: 'before the AI loses communication completely.', delay: 4800, color: '#A855F7' },
];

class AlphaMission2 {
  constructor() {
    this.currentStage = 1;
    this.currentQ = 0;
    this.questionTimer = null;
    this.questionSeconds = 15;
    this.emojiRevealIndex = 0;
    this.presenterOpen = false;
    this.phase = 'signal'; // 'signal' | 'emoji' | 'answer'
    this.init();
  }

  init() {
    this.bindButtons();
    this.buildPresenterJumpMenu();
    this.startOpeningSequence();
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.togglePresenter();
    });
  }

  /* ── Opening Sequence ──────────────────────────────────────────────── */
  startOpeningSequence() {
    // Show warning after 2.5s
    setTimeout(() => {
      this.triggerGlitch();
      const wb = document.getElementById('warning-box');
      if (wb) wb.style.display = 'block';
    }, 2500);

    // Show protocol text after 4s
    setTimeout(() => {
      this.triggerGlitch();
      const pb = document.getElementById('protocol-box');
      const pt = document.getElementById('protocol-text');
      if (pb) pb.style.display = 'block';
      if (pt) {
        const lines = ['AI Core Unable To Communicate...', '', 'Switching To Emoji Protocol...'];
        lines.forEach((line, i) => {
          setTimeout(() => {
            pt.innerHTML += (line ? line : '&nbsp;') + '<br>';
          }, i * 800);
        });
      }
    }, 4500);

    // Show mission reveal after 7.5s
    setTimeout(() => {
      this.triggerGlitch();
      const mr = document.getElementById('mission02-reveal');
      if (mr) { mr.style.display = 'block'; mr.style.animation = 'fadeUp 0.6s ease both'; }
    }, 7500);
  }

  /* ── Stage Nav ─────────────────────────────────────────────────────── */
  goToStage(n) {
    const prev = document.getElementById(`stage-${this.currentStage}`);
    const next = document.getElementById(`stage-${n}`);
    if (!next) return;
    if (prev) prev.classList.remove('active');
    this.currentStage = n;
    next.classList.add('active');
    if (n === 2) this.runStory();
    if (n === 3) this.animateRules();
    if (n === 4) { this.currentQ = 0; this.loadQuestion(0); }
    window.soundSystem && window.soundSystem.playClick();
  }

  /* ── Story Typewriter ──────────────────────────────────────────────── */
  runStory() {
    const box = document.getElementById('story-text');
    const btn = document.getElementById('s2-next');
    if (!box) return;

    STORY_LINES.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.textContent = text;
        p.style.color = color || 'var(--text-sub)';
        p.style.opacity = '0';
        p.style.transition = 'opacity 0.5s ease';
        box.appendChild(p);
        requestAnimationFrame(() => requestAnimationFrame(() => p.style.opacity = '1'));
      }, delay);
    });

    const lastDelay = STORY_LINES[STORY_LINES.length - 1].delay + 1200;
    setTimeout(() => { if (btn) btn.style.display = 'block'; }, lastDelay);
  }

  /* ── Rules Animation ───────────────────────────────────────────────── */
  animateRules() {
    const items = document.querySelectorAll('#obj-rules-list .rule-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 200 + 100);
    });
  }

  /* ── Question Engine ───────────────────────────────────────────────── */
  loadQuestion(idx) {
    if (idx >= QUESTIONS.length) { this.goToStage(5); return; }
    this.currentQ = idx;
    this.phase = 'signal';
    this.showSignalPhase(idx);
  }

  showSignalPhase(idx) {
    document.getElementById('signal-phase').style.display = '';
    document.getElementById('emoji-phase').style.display = 'none';
    document.getElementById('answer-phase').style.display = 'none';

    const fill = document.getElementById('signal-fill');
    const status = document.getElementById('signal-status');
    const statusTexts = ['Establishing connection...', 'Scanning neural pathways...', 'Signal locked!', 'Incoming Transmission...'];

    let pct = 0;
    const step = setInterval(() => {
      pct += Math.random() * 12 + 4;
      if (fill) fill.style.width = Math.min(pct, 100) + '%';
      const si = Math.floor((Math.min(pct, 100) / 100) * (statusTexts.length - 1));
      if (status) status.textContent = statusTexts[si];
      if (pct >= 100) {
        clearInterval(step);
        setTimeout(() => this.showEmojiPhase(idx), 400);
      }
    }, 120);
  }

  showEmojiPhase(idx) {
    const q = QUESTIONS[idx];
    document.getElementById('signal-phase').style.display = 'none';
    document.getElementById('emoji-phase').style.display = '';
    document.getElementById('answer-phase').style.display = 'none';

    // Counter
    document.getElementById('q-counter').textContent = `TRANSMISSION ${String(idx + 1).padStart(2,'0')} / ${QUESTIONS.length}`;

    // Clear emojis
    const row = document.getElementById('emoji-row');
    row.innerHTML = '';
    q.emojis.forEach(emoji => {
      const span = document.createElement('span');
      span.className = 'emoji-token';
      span.textContent = emoji;
      row.appendChild(span);
    });

    // Reveal emojis one by one
    const tokens = row.querySelectorAll('.emoji-token');
    tokens.forEach((t, i) => {
      setTimeout(() => {
        t.classList.add('revealed');
        window.soundSystem && window.soundSystem.playHover();
      }, i * 500 + 200);
    });

    // Start countdown
    const totalDelay = (q.emojis.length - 1) * 500 + 700;
    setTimeout(() => this.startQuestionTimer(), totalDelay);

    window.soundSystem && window.soundSystem.playBoot();
  }

  startQuestionTimer() {
    const perimeter = 2 * Math.PI * 96;
    let seconds = 15;
    const ring = document.getElementById('q-timer-ring');
    const digits = document.getElementById('q-timer-digits');
    clearInterval(this.questionTimer);

    this.questionTimer = setInterval(() => {
      if (ring) ring.style.strokeDashoffset = (perimeter * (1 - seconds / 15)).toString();
      if (digits) digits.textContent = seconds;
      if (seconds <= 5 && ring) ring.style.stroke = '#F43F5E';
      else if (ring) ring.style.stroke = 'var(--neon-purple)';
      seconds--;
      if (seconds < 0) {
        clearInterval(this.questionTimer);
        // Auto reveal on timeout
        this.revealAnswer();
      }
    }, 1000);
  }

  revealAnswer() {
    clearInterval(this.questionTimer);
    const q = QUESTIONS[this.currentQ];
    this.phase = 'answer';

    document.getElementById('signal-phase').style.display = 'none';
    document.getElementById('emoji-phase').style.display = 'none';
    document.getElementById('answer-phase').style.display = '';

    document.getElementById('answer-name').textContent = q.answer;
    document.getElementById('answer-emojis').textContent = q.emojis.join(' ');
    document.getElementById('answer-desc').textContent = q.desc;
    document.getElementById('answer-usage').textContent = q.usage;

    // Energy pulse
    const pulse = document.getElementById('energy-pulse');
    if (pulse) {
      pulse.classList.remove('pulse-active');
      void pulse.offsetWidth;
      pulse.classList.add('pulse-active');
    }

    window.soundSystem && window.soundSystem.playComplete();
  }

  /* ── Helpers ───────────────────────────────────────────────────────── */
  triggerGlitch() {
    const el = document.getElementById('glitch-fx');
    if (!el) return;
    el.classList.remove('active');
    void el.offsetWidth;
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 600);
  }

  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    const panel = document.getElementById('presenter-panel');
    if (panel) panel.classList.toggle('open', this.presenterOpen);
  }

  buildPresenterJumpMenu() {
    const sel = document.getElementById('pp-q-jump');
    if (!sel) return;
    QUESTIONS.forEach((q, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `Q${i + 1}: ${q.answer}`;
      sel.appendChild(opt);
    });
  }

  bindButtons() {
    document.getElementById('s1-next').addEventListener('click', () => this.goToStage(2));
    document.getElementById('s2-next').addEventListener('click', () => this.goToStage(3));
    document.getElementById('s3-next').addEventListener('click', () => this.goToStage(4));

    document.getElementById('reveal-btn').addEventListener('click', () => this.revealAnswer());
    document.getElementById('next-q-btn').addEventListener('click', () => {
      this.loadQuestion(this.currentQ + 1);
      window.soundSystem && window.soundSystem.playClick();
    });

    // Presenter panel
    document.getElementById('presenter-fab').addEventListener('click', () => this.togglePresenter());
    document.getElementById('pp-reveal-pp').addEventListener('click', () => this.revealAnswer());
    document.getElementById('pp-next-q').addEventListener('click', () => {
      clearInterval(this.questionTimer);
      this.loadQuestion(this.currentQ + 1);
    });
    document.getElementById('pp-jump-btn').addEventListener('click', () => {
      const idx = parseInt(document.getElementById('pp-q-jump').value);
      if (!isNaN(idx)) {
        clearInterval(this.questionTimer);
        if (this.currentStage !== 4) this.goToStage(4);
        this.loadQuestion(idx);
      }
    });
    document.getElementById('pp-restart').addEventListener('click', () => window.location.reload());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.mission2 = new AlphaMission2();
});
