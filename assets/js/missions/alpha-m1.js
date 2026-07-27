/* ==========================================================================
   ALPHA MISSION 1 — Prompt Engineering Challenge
   Stage State Machine & Interactive Logic
   ========================================================================== */

const BRIEF_LINES = [
  { text: '> SYSTEM BOOTING...', delay: 0, color: '#00F3FF' },
  { text: '> Artificial Intelligence Core Activated.', delay: 600, color: '#A855F7' },
  { text: '> MISSION RECEIVED.', delay: 1200, color: '#F59E0B' },
  { text: '', delay: 1900, color: '' },
  { text: 'Welcome, Agent.', delay: 2200, color: '#fff' },
  { text: '', delay: 2900, color: '' },
  { text: 'Every AI engineer has one superpower.', delay: 3100, color: '' },
  { text: 'The ability to communicate effectively with AI.', delay: 4200, color: '' },
  { text: '', delay: 5100, color: '' },
  { text: 'Today, your first mission is to prove that', delay: 5300, color: '' },
  { text: 'you can think like a Prompt Engineer.', delay: 6200, color: '#A855F7' },
  { text: '', delay: 7000, color: '' },
  { text: '"The quality of AI output depends on', delay: 7200, color: '' },
  { text: 'the quality of your prompt."', delay: 8000, color: '#00F3FF' },
];

class AlphaMission1 {
  constructor() {
    this.currentStage = 1;
    this.totalStages = 12;
    this.selectedGroup = null;
    this.imageRevealTimer = null;
    this.bigTimer = null;
    this.bigTimerRunning = false;
    this.bigTimerSeconds = 300;
    this.presenterOpen = false;
    this.init();
  }

  init() {
    this.bindStageButtons();
    this.bindPresenterPanel();
    this.bindGroupCards();
    this.bindBigTimer();
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.togglePresenter();
      if (e.key === 'ArrowRight') this.nextStage();
      if (e.key === 'ArrowLeft' && this.currentStage > 1) this.goToStage(this.currentStage - 1);
    });
  }

  /* ── Stage Navigation ──────────────────────────────────────────────── */
  nextStage() {
    if (this.currentStage < this.totalStages) this.goToStage(this.currentStage + 1);
  }

  goToStage(n) {
    const prev = document.getElementById(`stage-${this.currentStage}`);
    const next = document.getElementById(`stage-${n}`);
    if (!next) return;

    if (prev) prev.classList.remove('active');
    this.currentStage = n;
    next.classList.add('active');

    const ind = document.getElementById('stage-indicator');
    if (ind) ind.textContent = `STAGE ${n} / ${this.totalStages}`;

    this.onStageEnter(n);
    window.soundSystem && window.soundSystem.playClick();
  }

  onStageEnter(n) {
    if (n === 2) this.triggerGlitch();
    if (n === 3) this.runBriefTypewriter();
    if (n === 8) this.animateRules();
    if (n === 10) this.resetBigTimer();
  }

  /* ── Glitch FX ─────────────────────────────────────────────────────── */
  triggerGlitch() {
    const el = document.getElementById('glitch-fx');
    if (!el) return;
    el.classList.remove('active');
    void el.offsetWidth;
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 600);
  }

  pulseEnergy() {
    const el = document.getElementById('energy-pulse');
    if (!el) return;
    el.classList.remove('pulse-active');
    void el.offsetWidth;
    el.classList.add('pulse-active');
    setTimeout(() => el.classList.remove('pulse-active'), 900);
  }

  /* ── Typewriter Brief ──────────────────────────────────────────────── */
  runBriefTypewriter() {
    const box = document.getElementById('brief-text');
    const cursor = document.getElementById('brief-cursor');
    const btn = document.getElementById('s3-next');
    if (!box) return;

    box.innerHTML = '';
    if (cursor) cursor.style.display = 'none';

    BRIEF_LINES.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        const line = document.createElement('div');
        if (!text) { line.style.height = '0.6rem'; }
        else {
          line.style.color = color || 'var(--text-sub)';
          line.style.fontFamily = text.startsWith('>') ? "'Fira Code', monospace" : "'Plus Jakarta Sans', sans-serif";
          line.style.fontSize = text.startsWith('>') ? '0.8rem' : '1rem';
          line.style.fontWeight = text.startsWith('>') ? '400' : '400';
          line.style.opacity = '0';
          line.style.transform = 'translateY(6px)';
          line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          line.textContent = text;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
          }));
        }
        box.appendChild(line);
      }, delay);
    });

    const totalDelay = BRIEF_LINES[BRIEF_LINES.length - 1].delay + 1200;
    setTimeout(() => {
      if (cursor) cursor.style.display = 'inline-block';
      if (btn) btn.style.display = 'block';
    }, totalDelay);
  }

  /* ── Group Cards ───────────────────────────────────────────────────── */
  bindGroupCards() {
    const evenCard = document.getElementById('card-even');
    const oddCard  = document.getElementById('card-odd');
    const contBtn  = document.getElementById('s4-next');

    const select = (group) => {
      this.selectedGroup = group;
      evenCard.classList.toggle('selected', group === 'even');
      oddCard.classList.toggle('selected',  group === 'odd');
      contBtn.disabled = false;
      contBtn.style.opacity = '1';
      contBtn.style.pointerEvents = 'auto';
      this.pulseEnergy();
      window.soundSystem && window.soundSystem.playHover();
    };

    evenCard.addEventListener('click', () => select('even'));
    oddCard.addEventListener('click',  () => select('odd'));
  }

  /* ── Stage 5: Countdown 3-2-1 ─────────────────────────────────────── */
  startCountdown321() {
    const nums = ['countdown-3','countdown-2','countdown-1'];
    const btn = document.getElementById('s5-start');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.4'; }

    nums.forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) { el.style.opacity = '1'; el.style.transform = 'scale(1.3)'; }
        window.soundSystem && window.soundSystem.playClick();
        setTimeout(() => { if (el) { el.style.opacity = '0'; el.style.transform = 'scale(0.7)'; } }, 700);
      }, i * 900 + 200);
    });

    setTimeout(() => this.startImageReveal(), 3200);
  }

  /* ── Stage 6: Image Reveal (5 seconds) ────────────────────────────── */
  startImageReveal() {
    this.goToStage(6);
    const totalPerimeter = 2 * Math.PI * 42;
    let seconds = 5;
    const ring = document.getElementById('reveal-timer-ring');
    const digits = document.getElementById('reveal-countdown');

    const tick = () => {
      if (ring) ring.style.strokeDashoffset = (totalPerimeter * (1 - seconds / 5)).toString();
      if (digits) digits.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(this.imageRevealTimer);
        this.blurImages();
        setTimeout(() => this.goToStage(7), 600);
      }
      seconds--;
    };
    tick();
    this.imageRevealTimer = setInterval(tick, 1000);
    window.soundSystem && window.soundSystem.playLaunch();
  }

  blurImages() {
    const evenPanel = document.getElementById('even-panel');
    const oddPanel  = document.getElementById('odd-panel');
    if (evenPanel) evenPanel.classList.add('blurred');
    if (oddPanel)  oddPanel.classList.add('blurred');
    this.pulseEnergy();
  }

  /* ── Rules Animation ───────────────────────────────────────────────── */
  animateRules() {
    const items = document.querySelectorAll('#rules-list .rule-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 200 + 100);
    });
  }

  /* ── Big Timer (5 min) ─────────────────────────────────────────────── */
  resetBigTimer() {
    this.bigTimerSeconds = 300;
    this.bigTimerRunning = false;
    clearInterval(this.bigTimer);
    this.updateBigTimerDisplay();
    const fill = document.getElementById('big-timer-fill');
    if (fill) fill.style.strokeDashoffset = '0';
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    if (startBtn) startBtn.style.display = '';
    if (pauseBtn) pauseBtn.style.display = 'none';
  }

  updateBigTimerDisplay() {
    const m = Math.floor(this.bigTimerSeconds / 60);
    const s = this.bigTimerSeconds % 60;
    const el = document.getElementById('big-timer-digits');
    if (el) el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

    const fill = document.getElementById('big-timer-fill');
    const perimeter = 2 * Math.PI * 114;
    if (fill) {
      const pct = 1 - (this.bigTimerSeconds / 300);
      fill.style.strokeDashoffset = (perimeter * pct).toString();

      if (this.bigTimerSeconds <= 30)       fill.style.stroke = '#F43F5E';
      else if (this.bigTimerSeconds <= 60)  fill.style.stroke = '#F59E0B';
      else                                  fill.style.stroke = 'var(--neon-purple)';
    }
  }

  bindBigTimer() {
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    const nextBtn  = document.getElementById('s10-next');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.bigTimerRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = '';
        window.soundSystem && window.soundSystem.playBoot();

        this.bigTimer = setInterval(() => {
          if (!this.bigTimerRunning) return;
          this.bigTimerSeconds--;
          this.updateBigTimerDisplay();
          if (this.bigTimerSeconds <= 0) {
            clearInterval(this.bigTimer);
            window.soundSystem && window.soundSystem.playComplete();
            this.goToStage(11);
          }
        }, 1000);
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.bigTimerRunning = !this.bigTimerRunning;
        pauseBtn.textContent = this.bigTimerRunning ? '⏸ PAUSE' : '▶ RESUME';
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        clearInterval(this.bigTimer);
        this.goToStage(11);
        window.soundSystem && window.soundSystem.playComplete();
      });
    }
  }

  /* ── Stage Buttons ─────────────────────────────────────────────────── */
  bindStageButtons() {
    const map = {
      's1-next': () => this.goToStage(2),
      's2-next': () => { this.triggerGlitch(); setTimeout(() => this.goToStage(3), 350); },
      's3-next': () => this.goToStage(4),
      's4-next': () => this.goToStage(5),
      's5-start': () => this.startCountdown321(),
      's7-next': () => this.goToStage(8),
      's8-next': () => this.goToStage(9),
      's9-next': () => this.goToStage(10),
      's11-next': () => this.goToStage(12),
    };
    Object.entries(map).forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    });
  }

  /* ── Presenter Panel ───────────────────────────────────────────────── */
  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    const panel = document.getElementById('presenter-panel');
    if (panel) panel.classList.toggle('open', this.presenterOpen);
  }

  bindPresenterPanel() {
    document.getElementById('presenter-fab').addEventListener('click', () => this.togglePresenter());
    document.getElementById('pp-next').addEventListener('click', () => this.nextStage());
    document.getElementById('pp-prev').addEventListener('click', () => { if (this.currentStage > 1) this.goToStage(this.currentStage - 1); });
    document.getElementById('pp-reveal').addEventListener('click', () => {
      if (this.currentStage === 5) this.startCountdown321();
      else this.startImageReveal();
    });
    document.getElementById('pp-restart').addEventListener('click', () => { clearInterval(this.bigTimer); clearInterval(this.imageRevealTimer); window.location.reload(); });
    document.getElementById('pp-apply-images').addEventListener('click', () => {
      const evenSrc = document.getElementById('pp-even-img').value;
      const oddSrc  = document.getElementById('pp-odd-img').value;
      const evenImg = document.getElementById('even-img');
      const oddImg  = document.getElementById('odd-img');
      if (evenImg) evenImg.src = evenSrc;
      if (oddImg)  oddImg.src  = oddSrc;
      window.soundSystem && window.soundSystem.playHover();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.mission1 = new AlphaMission1();
});
