/* ==========================================================================
   BETA MISSION 1 — Wizard's Game Forge
   ========================================================================== */

const STORY_LINES_WIZARD = [
  { text: 'The Wizarding World has begun losing its magic.', delay: 200 },
  { text: 'Ancient spells are fading.', delay: 1300 },
  { text: 'Magical creatures are disappearing.', delay: 2200 },
  { text: 'The Great Hall needs new creators.', delay: 3100 },
  { text: '', delay: 3900 },
  { text: 'Using Gemini Canvas, your team has 5 minutes', delay: 4100 },
  { text: 'to build a magical browser game that could exist', delay: 5100 },
  { text: 'inside the Wizarding World.', delay: 6000, color: '#F59E0B' },
  { text: '', delay: 6700 },
  { text: 'No coding experience is required.', delay: 6900 },
  { text: 'Your creativity is your greatest power. ✨', delay: 7800, color: '#A855F7' },
];

class BetaMission1 {
  constructor() {
    this.currentStage  = 1;
    this.totalStages   = 7;
    this.forgeTimer    = null;
    this.forgeRunning  = false;
    this.forgeSeconds  = 300;
    this.presenterOpen = false;
    this.spawnInterval = null;
    this.init();
  }

  init() {
    this.spawnMagicParticles();
    this.bindButtons();
    this.bindPresenter();
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.togglePresenter();
      if (e.key === 'ArrowRight') this.nextStage();
    });
  }

  /* ── Magic Particle Spawner ────────────────────────────────────────── */
  spawnMagicParticles() {
    this.spawnInterval = setInterval(() => {
      const p = document.createElement('div');
      p.className = 'magic-particle';
      const size = Math.random() * 6 + 3;
      const colors = ['#A855F7', '#F59E0B', '#7C3AED', '#00F3FF', '#fff'];
      p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${Math.random() * 100}vw;
        bottom:-10px;
        animation-duration:${Math.random() * 6 + 5}s;
        animation-delay:${Math.random() * 2}s;
        box-shadow:0 0 6px currentColor;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 12000);
    }, 250);
  }

  /* ── Stage Nav ─────────────────────────────────────────────────────── */
  nextStage() { if (this.currentStage < this.totalStages) this.goToStage(this.currentStage + 1); }

  goToStage(n) {
    const prev = document.getElementById(`stage-${this.currentStage}`);
    const next = document.getElementById(`stage-${n}`);
    if (!next) return;
    if (prev) prev.classList.remove('active');
    this.currentStage = n;
    next.classList.add('active');
    this.onStageEnter(n);
    window.soundSystem && window.soundSystem.playClick();
  }

  onStageEnter(n) {
    if (n === 2) this.runStory();
  }

  /* ── Story Typewriter ──────────────────────────────────────────────── */
  runStory() {
    const box = document.getElementById('story-text');
    const btn = document.getElementById('s2-next');
    if (!box) return;

    STORY_LINES_WIZARD.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.textContent = text || '\u00A0';
        p.style.color = color || 'var(--text-sub)';
        p.style.fontSize = '1rem';
        p.style.lineHeight = '1.7';
        p.style.opacity = '0';
        p.style.transition = 'opacity 0.5s ease';
        box.appendChild(p);
        requestAnimationFrame(() => requestAnimationFrame(() => p.style.opacity = '1'));
      }, delay);
    });

    const lastDelay = STORY_LINES_WIZARD[STORY_LINES_WIZARD.length - 1].delay + 1200;
    setTimeout(() => { if (btn) btn.style.display = 'block'; }, lastDelay);
  }

  /* ── Copy Prompt ───────────────────────────────────────────────────── */
  copyPrompt() {
    const text = `Create a playable wizard-themed browser game using HTML, CSS and JavaScript.

The game should include:
• Beautiful magical environment
• Smooth character movement
• Attractive UI
• Win/Lose screen
• Score system
• Timer
• Smooth animations
• Fantasy-inspired visual effects

Then improve this prompt with your own creative ideas.`;

    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copy-btn');
      if (btn) { btn.textContent = 'COPIED ✓'; btn.style.background = 'rgba(16,185,129,0.3)'; btn.style.color = '#10B981'; }
      window.soundSystem && window.soundSystem.playComplete();
      setTimeout(() => {
        if (btn) { btn.textContent = 'COPY'; btn.style.background = ''; btn.style.color = ''; }
      }, 2000);
    }).catch(() => {});
  }

  /* ── Forge Timer ───────────────────────────────────────────────────── */
  startForgeTimer() {
    if (this.forgeRunning) return;
    this.forgeRunning = true;
    const startBtn = document.getElementById('forge-start-btn');
    const pauseBtn = document.getElementById('forge-pause-btn');
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = '';
    window.soundSystem && window.soundSystem.playBoot();

    this.forgeTimer = setInterval(() => {
      if (!this.forgeRunning) return;
      this.forgeSeconds--;
      this.updateForgeDisplay();
      if (this.forgeSeconds <= 0) {
        clearInterval(this.forgeTimer);
        window.soundSystem && window.soundSystem.playComplete();
        this.timeUp();
      }
    }, 1000);
  }

  updateForgeDisplay() {
    const m = Math.floor(this.forgeSeconds / 60);
    const s = this.forgeSeconds % 60;
    const el = document.getElementById('big-timer-digits');
    if (el) el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

    const fill = document.getElementById('big-timer-fill');
    const perimeter = 2 * Math.PI * 114;
    if (fill) {
      const pct = 1 - (this.forgeSeconds / 300);
      fill.style.strokeDashoffset = (perimeter * pct).toString();
      if (this.forgeSeconds <= 60) {
        fill.style.stroke = '#F43F5E';
        fill.style.filter = 'drop-shadow(0 0 12px #F43F5E)';
      } else if (this.forgeSeconds <= 120) {
        fill.style.stroke = '#F59E0B';
        fill.style.filter = 'drop-shadow(0 0 12px #F59E0B)';
      }
    }
  }

  timeUp() {
    this.goToStage(7);
  }

  /* ── Presenter ─────────────────────────────────────────────────────── */
  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    const panel = document.getElementById('presenter-panel');
    if (panel) panel.classList.toggle('open', this.presenterOpen);
  }

  bindPresenter() {
    document.getElementById('presenter-fab').addEventListener('click', () => this.togglePresenter());
    document.getElementById('pp-prev').addEventListener('click', () => { if (this.currentStage > 1) this.goToStage(this.currentStage - 1); });
    document.getElementById('pp-next').addEventListener('click', () => this.nextStage());
    document.getElementById('pp-start-timer').addEventListener('click', () => {
      if (this.currentStage !== 6) this.goToStage(6);
      this.startForgeTimer();
    });
    document.getElementById('pp-restart').addEventListener('click', () => window.location.reload());
  }

  bindButtons() {
    document.getElementById('s1-next').addEventListener('click', () => this.goToStage(2));
    document.getElementById('s2-next').addEventListener('click', () => this.goToStage(3));
    document.getElementById('s3-next').addEventListener('click', () => this.goToStage(4));
    document.getElementById('s4-next').addEventListener('click', () => this.goToStage(5));
    document.getElementById('s5-next').addEventListener('click', () => this.goToStage(6));
    document.getElementById('s6-next').addEventListener('click', () => this.timeUp());

    document.getElementById('copy-btn').addEventListener('click', () => this.copyPrompt());

    document.getElementById('forge-start-btn').addEventListener('click', () => this.startForgeTimer());
    document.getElementById('forge-pause-btn').addEventListener('click', () => {
      this.forgeRunning = !this.forgeRunning;
      const btn = document.getElementById('forge-pause-btn');
      if (btn) btn.textContent = this.forgeRunning ? '⏸ PAUSE' : '▶ RESUME';
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.betaMission1 = new BetaMission1();
});
