/* ==========================================================================
   BETA MISSION 2 — AI Vision Challenge
   15-challenge zoom reveal engine with HUD overlays
   ========================================================================== */

const VISION_CHALLENGES = [
  { name: 'GitHub', icon: '🐙', desc: "GitHub is the world's largest platform for collaborative software development and version control using Git. It hosts millions of open-source and enterprise projects.", imgSrc: null },
  { name: 'LinkedIn', icon: '💼', desc: "LinkedIn is the world's largest professional networking platform with over 900 million users. It connects professionals with careers, skills, and opportunities.", imgSrc: null },
  { name: 'Google Docs', icon: '📄', desc: "Google Docs is a cloud-based document editor enabling real-time collaboration. Multiple users can edit, comment, and review the same document simultaneously.", imgSrc: null },
  { name: 'Figma', icon: '🎨', desc: "Figma is a collaborative UI/UX design platform used by designers and developers to create websites, apps, and interactive prototypes.", imgSrc: null },
  { name: 'Docker', icon: '🐳', desc: "Docker packages applications and their dependencies into portable containers that run consistently across any computing environment.", imgSrc: null },
  { name: 'ChatGPT', icon: '🤖', desc: "ChatGPT is an AI language model developed by OpenAI capable of generating human-like text, answering questions, writing code, and much more.", imgSrc: null },
  { name: 'Gemini', icon: '✨', desc: "Gemini is Google's most capable AI model family, designed for multimodal reasoning across text, images, code, and data.", imgSrc: null },
  { name: 'Kubernetes', icon: '☸️', desc: "Kubernetes is an open-source container orchestration system that automates deployment, scaling, and management of containerized applications.", imgSrc: null },
  { name: 'Linux Penguin', icon: '🐧', desc: "Linux is an open-source operating system that powers most of the world's servers, Android devices, supercomputers, and cloud infrastructure.", imgSrc: null },
  { name: 'Raspberry Pi', icon: '🍓', desc: "Raspberry Pi is a tiny, affordable single-board computer designed to promote computer science education and enable hardware projects.", imgSrc: null },
  { name: 'CPU Pins', icon: '🔲', desc: "A CPU (Central Processing Unit) is the primary processor of a computer, executing program instructions and performing arithmetic and logic operations.", imgSrc: null },
  { name: 'Ethernet Connector', icon: '🔌', desc: "An Ethernet connector (RJ-45) is a standardised networking plug used to physically connect devices to wired local area networks (LANs).", imgSrc: null },
  { name: 'React', icon: '⚛️', desc: "React is a JavaScript library developed by Meta for building fast, interactive user interfaces using a component-based architecture.", imgSrc: null },
  { name: 'Firebase', icon: '🔥', desc: "Firebase is Google's platform for building mobile and web applications, offering real-time database, authentication, hosting, and cloud functions.", imgSrc: null },
  { name: 'Mechanical Keyboard Switch', icon: '⌨️', desc: "A mechanical keyboard switch is an individual key mechanism that provides tactile feedback, durability, and a unique typing experience preferred by programmers.", imgSrc: null },
];

const AI_FEEDBACKS = [
  'OBJECT RECOGNIZED', 'PATTERN DETECTED', 'CLASSIFICATION SUCCESSFUL',
  'VISUAL MATCH FOUND', 'COMPUTER VISION COMPLETE', 'OBSERVATION SCORE INCREASED',
  'NEURAL ANALYSIS DONE', 'SIGNATURE CONFIRMED', 'SCAN COMPLETE'
];

class BetaMission2 {
  constructor() {
    this.currentStage   = 1;
    this.currentChallenge = 0;
    this.presenterOpen  = false;
    this.observationPct = 0;
    this.init();
  }

  init() {
    this.buildPresenterMenu();
    this.bindButtons();
    this.bindPresenter();
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.togglePresenter();
    });
  }

  /* ── Stage Nav ─────────────────────────────────────────────────────── */
  goToStage(n) {
    const prev = document.getElementById(`stage-${this.currentStage}`);
    const next = document.getElementById(`stage-${n}`);
    if (!next) return;
    if (prev) prev.classList.remove('active');
    this.currentStage = n;
    next.classList.add('active');
    if (n === 2) this.animateRules();
    if (n === 3) this.loadChallenge(0);
    window.soundSystem && window.soundSystem.playClick();
  }

  /* ── Rules ─────────────────────────────────────────────────────────── */
  animateRules() {
    const items = document.querySelectorAll('#rules-list .rule-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 200 + 100);
    });
  }

  /* ── Challenge Engine ──────────────────────────────────────────────── */
  loadChallenge(idx) {
    if (idx >= VISION_CHALLENGES.length) { this.goToStage(4); return; }
    this.currentChallenge = idx;
    this.showScanPhase(idx);
    this.updateProgressLabel();
  }

  updateProgressLabel() {
    const el = document.getElementById('q-progress-label');
    if (el) el.textContent = `AI VISION CHALLENGE // IMAGE ${this.currentChallenge + 1} / ${VISION_CHALLENGES.length}`;
  }

  showScanPhase(idx) {
    document.getElementById('scan-phase').style.display = '';
    document.getElementById('image-phase').style.display = 'none';
    document.getElementById('answer-phase').style.display = 'none';

    const fill   = document.getElementById('scan-fill');
    const status = document.getElementById('scan-status');
    const pctEl  = document.getElementById('scan-pct');
    const statusTexts = ['Initializing visual analysis...', 'Processing image data...', 'Neural pattern matching...', 'Signal locked!'];

    let pct = 0;
    const step = setInterval(() => {
      pct += Math.random() * 10 + 5;
      const clamped = Math.min(pct, 100);
      if (fill) fill.style.width = clamped + '%';
      if (pctEl) pctEl.textContent = Math.floor(clamped) + '%';
      const si = Math.floor((clamped / 100) * (statusTexts.length - 1));
      if (status) status.textContent = statusTexts[si];
      if (pct >= 100) {
        clearInterval(step);
        setTimeout(() => this.showImagePhase(idx), 400);
      }
    }, 100);

    window.soundSystem && window.soundSystem.playBoot();
  }

  showImagePhase(idx) {
    const ch = VISION_CHALLENGES[idx];
    document.getElementById('scan-phase').style.display = 'none';
    document.getElementById('image-phase').style.display = '';
    document.getElementById('answer-phase').style.display = 'none';

    document.getElementById('challenge-counter').textContent = `CHALLENGE ${String(idx + 1).padStart(2,'0')} / ${VISION_CHALLENGES.length}`;

    // Placeholder icon (replace with real zoomed images later)
    const placeholder = document.getElementById('vision-img-placeholder');
    const img = document.getElementById('vision-img');
    placeholder.textContent = '?';
    placeholder.style.display = 'flex';
    img.style.display = 'none';

    if (ch.imgSrc) {
      placeholder.style.display = 'none';
      img.src = ch.imgSrc;
      img.style.display = 'block';
      img.style.transform = 'scale(10)';
    }

    // HUD labels animate
    const hudLabels = document.querySelectorAll('.hud-label');
    hudLabels.forEach((l, i) => {
      setTimeout(() => { l.style.opacity = '0'; setTimeout(() => { l.style.opacity = '1'; }, 150); }, i * 200);
    });

    // AI feedback tags
    this.showRandomFeedback();
  }

  showRandomFeedback() {
    const container = document.getElementById('ai-feedback-tags');
    if (!container) return;
    container.innerHTML = '';
    const tags = AI_FEEDBACKS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
    tags.forEach((tag, i) => {
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'ai-feedback-tag';
        el.textContent = tag;
        el.style.animationDelay = (i * 0.1) + 's';
        container.appendChild(el);
      }, i * 300);
    });
  }

  revealObject() {
    const ch = VISION_CHALLENGES[this.currentChallenge];

    // Zoom out image if real image set
    const img = document.getElementById('vision-img');
    if (img && img.style.display !== 'none') {
      img.style.transform = 'scale(1)';
    } else {
      // Show icon as "revealed"
      const placeholder = document.getElementById('vision-img-placeholder');
      if (placeholder) {
        placeholder.textContent = ch.icon;
        placeholder.style.fontSize = '6rem';
        placeholder.style.border = '2px solid var(--accent-cyan)';
        placeholder.style.boxShadow = '0 0 40px rgba(0,243,255,0.4)';
      }
    }

    // Switch to answer phase after delay
    setTimeout(() => {
      document.getElementById('scan-phase').style.display = 'none';
      document.getElementById('image-phase').style.display = 'none';
      document.getElementById('answer-phase').style.display = '';

      document.getElementById('answer-name').textContent = ch.name;
      document.getElementById('answer-desc').textContent = ch.desc;

      // Update observation progress
      this.observationPct = Math.round(((this.currentChallenge + 1) / VISION_CHALLENGES.length) * 100);
      const fill = document.getElementById('obs-fill');
      const label = document.getElementById('obs-pct-label');
      if (fill) fill.style.width = this.observationPct + '%';
      if (label) label.textContent = this.observationPct + '%';

      this.pulseEnergy();
      window.soundSystem && window.soundSystem.playComplete();
    }, ch.imgSrc ? 2600 : 400);
  }

  /* ── FX helpers ────────────────────────────────────────────────────── */
  triggerGlitch() {
    const el = document.getElementById('glitch-fx');
    if (!el) return;
    el.classList.remove('active'); void el.offsetWidth;
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 600);
  }

  pulseEnergy() {
    const el = document.getElementById('energy-pulse');
    if (!el) return;
    el.classList.remove('pulse-active'); void el.offsetWidth;
    el.classList.add('pulse-active');
    setTimeout(() => el.classList.remove('pulse-active'), 900);
  }

  /* ── Presenter ─────────────────────────────────────────────────────── */
  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    document.getElementById('presenter-panel').classList.toggle('open', this.presenterOpen);
  }

  buildPresenterMenu() {
    const sel = document.getElementById('pp-jump-sel');
    if (!sel) return;
    VISION_CHALLENGES.forEach((ch, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `C${i + 1}: ${ch.name}`;
      sel.appendChild(opt);
    });
  }

  bindPresenter() {
    document.getElementById('presenter-fab').addEventListener('click', () => this.togglePresenter());
    document.getElementById('pp-reveal-pp').addEventListener('click', () => this.revealObject());
    document.getElementById('pp-next-c').addEventListener('click', () => this.loadChallenge(this.currentChallenge + 1));
    document.getElementById('pp-jump-btn').addEventListener('click', () => {
      const idx = parseInt(document.getElementById('pp-jump-sel').value);
      if (!isNaN(idx)) {
        if (this.currentStage !== 3) this.goToStage(3);
        this.loadChallenge(idx);
      }
    });
    document.getElementById('pp-restart').addEventListener('click', () => window.location.reload());
  }

  bindButtons() {
    document.getElementById('s1-next').addEventListener('click', () => this.goToStage(2));
    document.getElementById('s2-next').addEventListener('click', () => this.goToStage(3));
    document.getElementById('reveal-btn').addEventListener('click', () => this.revealObject());
    document.getElementById('next-challenge-btn').addEventListener('click', () => this.loadChallenge(this.currentChallenge + 1));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.betaMission2 = new BetaMission2();
});
