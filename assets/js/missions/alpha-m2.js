/* ==========================================================================
   ALPHA MISSION 2 — AI Emoji Decoder (v2)
   10 questions · Pause button · TIME'S UP screen · Back to Team Alpha
   ========================================================================== */

const QUESTIONS = [
  {
    emojis: ['🧠','🤖','📊'],
    answer: 'Deep Learning',
    desc: 'A subset of Machine Learning that uses multi-layered artificial neural networks to learn patterns directly from massive datasets.',
    usage: 'Powers: Image recognition, computer vision, language models.'
  },
  {
    emojis: ['🧠','🕸️','⚡'],
    answer: 'Neural Network',
    desc: 'A computing model inspired by human brain neurons. Interconnected node layers process input data to learn patterns.',
    usage: 'Powers: ChatGPT, Gemini, facial recognition, autonomous driving.'
  },
  {
    emojis: ['🔥','🧱','🛡️'],
    answer: 'Firewall',
    desc: 'A digital security system that monitors and filters incoming and outgoing network traffic based on security policies.',
    usage: 'Used in: Corporate networks, personal computers, cloud routers.'
  },
  {
    emojis: ['💎','🔴','💻'],
    answer: 'Ruby',
    desc: 'A dynamic, open-source programming language designed for elegant code readability and developer productivity.',
    usage: 'Famous framework: Ruby on Rails — powers GitHub & Shopify.'
  },
  {
    emojis: ['☁️','💻','⚡'],
    answer: 'Cloud Computing',
    desc: 'On-demand availability of computer system resources, especially data storage and processing power, over the Internet.',
    usage: 'Examples: Google Cloud, AWS, Microsoft Azure.'
  },
  {
    emojis: ['♾️','💻','🚀'],
    answer: 'DevOps',
    desc: 'A set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle.',
    usage: 'Used in: CI/CD automation, continuous deployment, microservices.'
  },
  {
    emojis: ['🔐','🔑','📜'],
    answer: 'Encryption',
    desc: 'The process of encoding information so that only authorized parties possessing the decryption key can read it.',
    usage: 'Protects: Banking apps, HTTPS web traffic, encrypted messages.'
  },
  {
    emojis: ['🎣','📧','💳'],
    answer: 'Phishing',
    desc: 'A cyber crime in which targets are contacted by email or message by someone posing as a legitimate institution to lure individuals into providing sensitive data.',
    usage: 'Always check: Sender addresses, domain names, and suspicious links.'
  },
  {
    emojis: ['🌐','⌚','📱'],
    answer: 'Internet of Things (IoT)',
    desc: 'Physical objects embedded with sensors, processing ability, and software that connect and exchange data with other devices over the internet.',
    usage: 'Examples: Smart watches, connected vehicles, smart home sensors.'
  },
  {
    emojis: ['🔗','🧊','🪙'],
    answer: 'Blockchain',
    desc: 'A shared, immutable ledger that facilitates the process of recording transactions and tracking assets in a network.',
    usage: 'Powers: Bitcoin, Ethereum, decentralized apps (dApps).'
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
    this.currentStage  = 1;
    this.currentQ      = 0;
    this.questionTimer = null;
    this.questionPaused = false;
    this.questionSeconds = 20;
    this.presenterOpen = false;
    this.phase = 'signal'; // 'signal' | 'emoji' | 'timesup' | 'answer'
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
    setTimeout(() => {
      this.triggerGlitch();
      const wb = document.getElementById('warning-box');
      if (wb) wb.style.display = 'block';
    }, 2500);

    setTimeout(() => {
      this.triggerGlitch();
      const pb = document.getElementById('protocol-box');
      const pt = document.getElementById('protocol-text');
      if (pb) pb.style.display = 'block';
      if (pt) {
        ['AI Core Unable To Communicate...', '', 'Switching To Emoji Protocol...'].forEach((line, i) => {
          setTimeout(() => { pt.innerHTML += (line ? line : '&nbsp;') + '<br>'; }, i * 800);
        });
      }
    }, 4500);

    setTimeout(() => {
      this.triggerGlitch();
      const mr = document.getElementById('mission02-reveal');
      if (mr) { mr.style.display = 'block'; mr.style.animation = 'fadeUp 0.6s ease both'; }
    }, 7500);
  }

  /* ── Stage Navigation ──────────────────────────────────────────────── */
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

  /* ── Story ─────────────────────────────────────────────────────────── */
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

  /* ── Rules ─────────────────────────────────────────────────────────── */
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
    this.questionPaused = false;
    this.phase = 'signal';
    this.showSignalPhase(idx);
  }

  showSignalPhase(idx) {
    document.getElementById('signal-phase').style.display = '';
    document.getElementById('emoji-phase').style.display = 'none';
    document.getElementById('answer-phase').style.display = 'none';
    document.getElementById('timesup-phase').style.display = 'none';

    const fill   = document.getElementById('signal-fill');
    const status = document.getElementById('signal-status');
    const statusTexts = ['Establishing connection...', 'Scanning neural pathways...', 'Signal locked!', 'Incoming Transmission...'];
    let pct = 0;
    const step = setInterval(() => {
      pct += Math.random() * 12 + 4;
      if (fill)   fill.style.width = Math.min(pct, 100) + '%';
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
    document.getElementById('timesup-phase').style.display = 'none';

    this.phase = 'emoji';
    document.getElementById('q-counter').textContent = `TRANSMISSION ${String(idx + 1).padStart(2,'0')} / ${QUESTIONS.length}`;

    // Reset pause button
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.textContent = '⏸ PAUSE';
      pauseBtn.style.opacity = '1';
    }

    // Emit emojis one by one
    const row = document.getElementById('emoji-row');
    row.innerHTML = '';
    q.emojis.forEach(emoji => {
      const span = document.createElement('span');
      span.className = 'emoji-token';
      span.textContent = emoji;
      row.appendChild(span);
    });
    const tokens = row.querySelectorAll('.emoji-token');
    tokens.forEach((t, i) => {
      setTimeout(() => {
        t.classList.add('revealed');
        window.soundSystem && window.soundSystem.playHover();
      }, i * 500 + 200);
    });

    const totalDelay = (q.emojis.length - 1) * 500 + 700;
    setTimeout(() => this.startQuestionTimer(), totalDelay);
    window.soundSystem && window.soundSystem.playBoot();
  }

  startQuestionTimer() {
    const perimeter = 2 * Math.PI * 96;
    this.questionSeconds = 20;
    const ring   = document.getElementById('q-timer-ring');
    const digits = document.getElementById('q-timer-digits');
    clearInterval(this.questionTimer);
    this.questionPaused = false;

    this.questionTimer = setInterval(() => {
      if (this.questionPaused) return;
      if (ring)   ring.style.strokeDashoffset = (perimeter * (1 - this.questionSeconds / 20)).toString();
      if (digits) digits.textContent = this.questionSeconds;
      if (this.questionSeconds <= 5 && ring) ring.style.stroke = '#F43F5E';
      else if (ring) ring.style.stroke = 'var(--neon-purple)';
      this.questionSeconds--;
      if (this.questionSeconds < 0) {
        clearInterval(this.questionTimer);
        this.showTimesUp();
      }
    }, 1000);
  }

  togglePause() {
    this.questionPaused = !this.questionPaused;
    const btn = document.getElementById('pause-btn');
    if (btn) btn.textContent = this.questionPaused ? '▶ RESUME' : '⏸ PAUSE';
    window.soundSystem && window.soundSystem.playHover();
  }

  showTimesUp() {
    clearInterval(this.questionTimer);
    this.phase = 'timesup';
    document.getElementById('signal-phase').style.display = 'none';
    document.getElementById('emoji-phase').style.display = 'none';
    document.getElementById('answer-phase').style.display = 'none';
    document.getElementById('timesup-phase').style.display = '';
    this.triggerGlitch();
    window.soundSystem && window.soundSystem.playClick();
  }

  revealAnswer() {
    clearInterval(this.questionTimer);
    const q = QUESTIONS[this.currentQ];
    this.phase = 'answer';
    document.getElementById('signal-phase').style.display = 'none';
    document.getElementById('emoji-phase').style.display = 'none';
    document.getElementById('timesup-phase').style.display = 'none';
    document.getElementById('answer-phase').style.display = '';

    document.getElementById('answer-name').textContent = q.answer;
    document.getElementById('answer-emojis').textContent = q.emojis.join(' ');
    document.getElementById('answer-desc').textContent = q.desc;
    document.getElementById('answer-usage').textContent = q.usage;

    const pulse = document.getElementById('energy-pulse');
    if (pulse) {
      pulse.classList.remove('pulse-active');
      void pulse.offsetWidth;
      pulse.classList.add('pulse-active');
    }
    window.soundSystem && window.soundSystem.playComplete();
  }

  /* ── FX ────────────────────────────────────────────────────────────── */
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
    document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
    document.getElementById('timesup-reveal-btn').addEventListener('click', () => this.revealAnswer());
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
