/* ==========================================================================
   BETA MISSION 2 — AI Vision Challenge (v3)
   10-challenge zoom reveal engine with Java replace & interactive zoom slider
   ========================================================================== */

const VISION_CHALLENGES = [
  {
    name: 'GitHub',
    desc: "GitHub is the world's largest platform for collaborative software development and version control using Git.",
    svg: `<svg width="180" height="180" viewBox="0 0 100 100" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M50 0C22.4 0 0 22.4 0 50c0 22.1 14.3 40.8 34.2 47.4 2.5.5 3.4-1.1 3.4-2.4 0-1.2 0-4.4-.1-8.6-13.9 3-16.8-6.7-16.8-6.7-2.3-5.8-5.6-7.3-5.6-7.3-4.5-3.1.3-3 .3-3 5 .4 7.6 5.1 7.6 5.1 4.5 7.7 11.8 5.5 14.7 4.2.5-3.3 1.8-5.5 3.2-6.8-11.1-1.3-22.8-5.6-22.8-24.7 0-5.5 1.9-9.9 5.1-13.4-.5-1.3-2.2-6.4.5-13.3 0 0 4.2-1.3 13.7 5.1 4-1.1 8.3-1.7 12.5-1.7 4.2 0 8.5.6 12.5 1.7 9.5-6.5 13.7-5.1 13.7-5.1 2.7 6.9 1 12 .5 13.3 3.2 3.5 5.1 7.9 5.1 13.4 0 19.2-11.7 23.4-22.9 24.6 1.8 1.5 3.4 4.5 3.4 9.1 0 6.6-.1 11.9-.1 13.5 0 1.3.9 2.9 3.4 2.4C85.7 90.8 100 72.1 100 50 100 22.4 77.6 0 50 0z" fill="#00F3FF"/></svg>`
  },
  {
    name: 'React.js',
    desc: "React is a JavaScript library developed by Meta for building fast, interactive user interfaces using components.",
    svg: `<svg width="200" height="200" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="10" fill="#61DAFB"/><ellipse cx="50" cy="50" rx="42" ry="16" stroke="#61DAFB" stroke-width="4" transform="rotate(0 50 50)"/><ellipse cx="50" cy="50" rx="42" ry="16" stroke="#61DAFB" stroke-width="4" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="42" ry="16" stroke="#61DAFB" stroke-width="4" transform="rotate(120 50 50)"/></svg>`
  },
  {
    name: 'Figma',
    desc: "Figma is a collaborative cloud-based UI/UX design platform used by designers and product teams worldwide.",
    svg: `<svg width="160" height="220" viewBox="0 0 38 57" fill="none"><path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38L19 38L19 28.5Z" fill="#F24E1E"/><path d="M0 47.5C0 42.2533 4.25329 38 9.5 38L19 38L19 57L9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/><path d="M19 0L9.5 0C4.25329 0 0 4.25329 0 9.5C0 14.7467 4.25329 19 9.5 19L19 19L19 0Z" fill="#F24E1E"/><path d="M0 28.5C0 23.2533 4.25329 19 9.5 19L19 19L19 38L9.5 38C4.25329 38 0 33.7467 0 28.5Z" fill="#A259FF"/><path d="M19 0L28.5 0C33.7467 0 38 4.25329 38 9.5C38 14.7467 33.7467 19 28.5 19L19 19L19 0Z" fill="#1ABCFE"/></svg>`
  },
  {
    name: 'Java',
    desc: "Java is a popular class-based, object-oriented programming language designed to have as few implementation dependencies as possible (Write Once, Run Anywhere).",
    svg: `<svg width="180" height="200" viewBox="0 0 100 100" fill="none"><path d="M40 20C40 20 45 12 55 22C60 27 50 35 45 38" stroke="#E76F00" stroke-width="4" stroke-linecap="round"/><path d="M50 10C50 10 58 5 68 15C72 20 62 28 58 30" stroke="#5382A1" stroke-width="4" stroke-linecap="round"/><path d="M25 65C25 65 35 60 65 60C75 60 80 65 80 65" stroke="#E76F00" stroke-width="6" stroke-linecap="round"/><path d="M30 75C30 75 42 72 60 72C70 72 75 75 75 75" stroke="#5382A1" stroke-width="5" stroke-linecap="round"/><path d="M20 85C20 85 45 88 80 85" stroke="#E76F00" stroke-width="6" stroke-linecap="round"/></svg>`
  },
  {
    name: 'Firebase',
    desc: "Firebase is Google's mobile and web platform offering real-time databases, authentication, and cloud infrastructure.",
    svg: `<svg width="180" height="200" viewBox="0 0 100 100" fill="none"><path d="M25 80L50 15L75 80L50 65Z" fill="#FFCA28"/><path d="M50 15L75 80L50 65Z" fill="#FFA000"/></svg>`
  },
  {
    name: 'ChatGPT / OpenAI',
    desc: "OpenAI's ChatGPT is an artificial intelligence model trained to assist with reasoning, writing, coding, and research.",
    svg: `<svg width="180" height="180" viewBox="0 0 100 100" fill="none"><path d="M50 10L85 30V70L50 90L15 70V30L50 10Z" stroke="#10A37F" stroke-width="6" fill="none"/><circle cx="50" cy="50" r="15" fill="#10A37F"/></svg>`
  },
  {
    name: 'Python',
    desc: "Python is a high-level programming language widely used in Artificial Intelligence, Data Science, and Web Development.",
    svg: `<svg width="180" height="180" viewBox="0 0 100 100" fill="none"><path d="M48 10C25 10 26 20 26 20H48V25H15C15 25 5 24 5 45C5 66 14 65 14 65V52C14 41 24 41 24 41H46C46 41 55 41 55 31V20C55 20 57 10 48 10Z" fill="#3776AB"/><path d="M52 90C75 90 74 80 74 80H52V75H85C85 75 95 76 95 55C95 34 86 35 86 35V48C86 59 76 59 76 59H54C54 54 45 54 45 69V80C45 80 43 90 52 90Z" fill="#FFD43B"/></svg>`
  },
  {
    name: 'Apple',
    desc: "Apple Inc. designs and manufactures consumer electronics, computer software, and online services.",
    svg: `<svg width="160" height="190" viewBox="0 0 100 100" fill="none"><path d="M75 52C75 38 86 32 87 31C80 21 69 20 66 19C57 18 48 24 44 24C39 24 32 19 25 19C16 19 7 24 3 32C-6 48 1 72 10 85C14 91 19 98 26 98C33 97 35 93 43 93C51 93 54 97 61 97C68 97 73 91 77 85C82 78 84 72 85 71C84 70 75 66 75 52Z" fill="#FFF"/><path d="M58 13C62 8 65 2 64 0C59 0 52 4 48 9C44 14 41 20 42 22C48 22 54 18 58 13Z" fill="#FFF"/></svg>`
  },
  {
    name: 'Linux Tux',
    desc: "Linux is an open-source Operating System kernel powering most internet servers, Android, and supercomputers.",
    svg: `<svg width="180" height="200" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="55" rx="30" ry="35" fill="#FFF"/><ellipse cx="50" cy="55" rx="20" ry="25" fill="#000"/><circle cx="42" cy="40" r="4" fill="#FFF"/><circle cx="58" cy="40" r="4" fill="#FFF"/><path d="M42 50Q50 60 58 50Z" fill="#FFA500"/></svg>`
  },
  {
    name: 'CPU Microchip',
    desc: "The Central Processing Unit (CPU) is the primary electronic circuit that executes instructions comprising a computer program.",
    svg: `<svg width="200" height="200" viewBox="0 0 100 100" fill="none"><rect x="25" y="25" width="50" height="50" rx="8" fill="#1E293B" stroke="#00F3FF" stroke-width="4"/><rect x="38" y="38" width="24" height="24" fill="#00F3FF"/><line x1="30" y1="10" x2="30" y2="25" stroke="#00F3FF" stroke-width="4"/><line x1="50" y1="10" x2="50" y2="25" stroke="#00F3FF" stroke-width="4"/><line x1="70" y1="10" x2="70" y2="25" stroke="#00F3FF" stroke-width="4"/><line x1="30" y1="75" x2="30" y2="90" stroke="#00F3FF" stroke-width="4"/><line x1="50" y1="75" x2="50" y2="90" stroke="#00F3FF" stroke-width="4"/><line x1="70" y1="75" x2="70" y2="90" stroke="#00F3FF" stroke-width="4"/></svg>`
  }
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
    this.zoomScale      = 5.0;
    this.init();
  }

  init() {
    this.buildPresenterMenu();
    this.bindButtons();
    this.bindPresenter();
    this.bindZoomSlider();
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.togglePresenter();
    });
  }

  bindZoomSlider() {
    const slider = document.getElementById('zoom-slider');
    const label  = document.getElementById('zoom-val-label');
    if (!slider) return;

    slider.addEventListener('input', () => {
      const val = parseFloat(slider.value) / 100;
      this.zoomScale = val;
      if (label) label.textContent = `${val.toFixed(1)}x`;

      const renderBox = document.getElementById('vision-render-box');
      if (renderBox) {
        renderBox.style.transform = `scale(${val})`;
      }
    });
  }

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

  animateRules() {
    const items = document.querySelectorAll('#rules-list .rule-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 200 + 100);
    });
  }

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
      pct += Math.random() * 12 + 6;
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

    // Reset slider to 5.0x (max zoom)
    const slider = document.getElementById('zoom-slider');
    const label  = document.getElementById('zoom-val-label');
    if (slider) slider.value = 500;
    if (label)  label.textContent = '5.0x';
    this.zoomScale = 5.0;

    const renderBox = document.getElementById('vision-render-box');
    if (renderBox) {
      renderBox.innerHTML = ch.svg;
      renderBox.style.transform = 'scale(5.0)'; // Max initial zoom
    }

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

    // Smoothly zoom out render box to 1.0x
    const renderBox = document.getElementById('vision-render-box');
    const slider = document.getElementById('zoom-slider');
    const label  = document.getElementById('zoom-val-label');
    if (slider) slider.value = 100;
    if (label)  label.textContent = '1.0x';

    if (renderBox) {
      renderBox.style.transform = 'scale(1.0)';
    }

    setTimeout(() => {
      document.getElementById('scan-phase').style.display = 'none';
      document.getElementById('image-phase').style.display = 'none';
      document.getElementById('answer-phase').style.display = '';

      document.getElementById('answer-name').textContent = ch.name;
      document.getElementById('answer-desc').textContent = ch.desc;

      this.observationPct = Math.round(((this.currentChallenge + 1) / VISION_CHALLENGES.length) * 100);
      const fill = document.getElementById('obs-fill');
      const obsLabel = document.getElementById('obs-pct-label');
      if (fill) fill.style.width = this.observationPct + '%';
      if (obsLabel) obsLabel.textContent = this.observationPct + '%';

      this.pulseEnergy();
      window.soundSystem && window.soundSystem.playComplete();
    }, 2000);
  }

  pulseEnergy() {
    const el = document.getElementById('energy-pulse');
    if (!el) return;
    el.classList.remove('pulse-active'); void el.offsetWidth;
    el.classList.add('pulse-active');
    setTimeout(() => el.classList.remove('pulse-active'), 900);
  }

  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    document.getElementById('presenter-panel').classList.toggle('open', this.presenterOpen);
  }

  buildPresenterMenu() {
    const sel = document.getElementById('pp-jump-sel');
    if (!sel) return;
    sel.innerHTML = '';
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
