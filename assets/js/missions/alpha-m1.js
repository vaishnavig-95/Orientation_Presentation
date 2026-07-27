/* ==========================================================================
   ALPHA MISSION 1 — Prompt Engineering Challenge Controller
   11-stage presentation engine with opening fade-up & glitch transition
   ========================================================================== */

const MONOLOGUE_TEXT = `Welcome, Agent.

Every AI engineer has one superpower.

The ability to communicate effectively with AI.

Today,

your first mission

is to prove that

you can think

like a Prompt Engineer.

"The quality of AI output depends on the quality of your prompt."`;

class AlphaMission1 {
  constructor() {
    this.currentStage      = 1;
    this.timerInterval     = null;
    this.timerSeconds      = 300; // 5 minutes
    this.timerRunning      = false;
    this.imageRevealTimer  = null;
    this.currentImgNum     = 1;
    this.presenterOpen     = false;

    this.init();
  }

  init() {
    this.bindButtons();
    this.bindPresenter();
    this.startOpeningAnimation();
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.togglePresenter();
    });
  }

  startOpeningAnimation() {
    // Automatically fade up after 3.2 seconds
    setTimeout(() => {
      const s1 = document.getElementById('stage-1');
      if (s1 && this.currentStage === 1) {
        s1.classList.add('fade-up');
        setTimeout(() => this.goToStage(2), 1000);
      }
    }, 3200);
  }

  triggerGlitch(callback) {
    const glitch = document.getElementById('glitch-overlay');
    if (glitch) {
      glitch.classList.remove('active');
      void glitch.offsetWidth;
      glitch.classList.add('active');
      window.soundSystem && window.soundSystem.playGlitch();
      setTimeout(() => {
        glitch.classList.remove('active');
        if (callback) callback();
      }, 400);
    } else if (callback) {
      callback();
    }
  }

  goToStage(n) {
    const prev = document.getElementById(`stage-${this.currentStage}`);
    const next = document.getElementById(`stage-${n}`);
    if (!next) return;

    if (prev) prev.classList.remove('active');
    this.currentStage = n;
    next.classList.add('active');

    const sel = document.getElementById('pp-stage-select');
    if (sel) sel.value = n;

    this.onStageEnter(n);
    window.soundSystem && window.soundSystem.playClick();
  }

  onStageEnter(n) {
    if (n === 3) this.startTypewriter();
    if (n === 5) this.resetCountdown();
    if (n === 6) this.startImageReveal();
    if (n === 8) this.animateRules();
    if (n === 10) this.updateTimerDisplay();
    if (n === 11) window.soundSystem && window.soundSystem.playComplete();
  }

  /* ── Stage 3: Typewriter Briefing Monologue ───────────────────────── */
  startTypewriter() {
    const box = document.getElementById('brief-text');
    const cursor = document.getElementById('brief-cursor');
    const btn = document.getElementById('s3-next');
    if (!box) return;

    box.textContent = '';
    if (cursor) cursor.style.display = 'inline-block';
    if (btn) btn.style.display = 'none';

    let idx = 0;
    clearInterval(this.typewriterInterval);
    this.typewriterInterval = setInterval(() => {
      box.textContent += MONOLOGUE_TEXT[idx];
      idx++;
      if (idx % 4 === 0) window.soundSystem && window.soundSystem.playTypewriter();

      if (idx >= MONOLOGUE_TEXT.length) {
        clearInterval(this.typewriterInterval);
        if (cursor) cursor.style.display = 'none';
        if (btn) btn.style.display = 'inline-block';
      }
    }, 28);
  }

  /* ── Stage 5: 3-2-1 Countdown ─────────────────────────────────────── */
  resetCountdown() {
    ['3','2','1'].forEach(id => {
      const el = document.getElementById(`countdown-${id}`);
      if (el) { el.style.opacity = '0'; el.style.transform = 'scale(0.5)'; }
    });
  }

  startCountdownSequence() {
    const ids = ['3','2','1'];
    ids.forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(`countdown-${id}`);
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'scale(1.2)';
          window.soundSystem && window.soundSystem.playCountdown();
          setTimeout(() => { el.style.transform = 'scale(1.0)'; }, 200);
        }
      }, i * 1000);
    });

    setTimeout(() => this.goToStage(6), 3200);
  }

  /* ── Stage 6: Image Reveal (Image 1 then Image 2) ────────────────── */
  startImageReveal() {
    clearInterval(this.imageRevealTimer);
    const circumference = 2 * Math.PI * 42; // 263.9
    const ring   = document.getElementById('reveal-timer-ring');
    const digits = document.getElementById('reveal-countdown');
    const label  = document.getElementById('reveal-image-label');
    const img    = document.getElementById('challenge-img');
    const btn    = document.getElementById('switch-img-btn');

    this.currentImgNum = 1;
    let seconds = 10;

    if (img) img.src = '../assets/images/challenge_01_spiderman.jpg';
    if (label) label.textContent = '⏱ MEMORIZE IMAGE 1 / 2 (SPIDERMAN)';
    if (btn) btn.textContent = 'NEXT IMAGE (GROOT) →';

    const tick1 = () => {
      if (ring) ring.style.strokeDashoffset = (circumference * (1 - seconds / 10)).toString();
      if (digits) digits.textContent = seconds;
      if (seconds <= 3 && ring) ring.style.stroke = '#F43F5E';
      else if (ring) ring.style.stroke = 'var(--neon-purple)';

      if (seconds <= 0) {
        clearInterval(this.imageRevealTimer);
        this.switchToImage2();
      } else {
        seconds--;
      }
    };

    tick1();
    this.imageRevealTimer = setInterval(tick1, 1000);
    window.soundSystem && window.soundSystem.playLaunch();
  }

  switchToImage2() {
    clearInterval(this.imageRevealTimer);
    this.currentImgNum = 2;
    const img   = document.getElementById('challenge-img');
    const label = document.getElementById('reveal-image-label');
    const btn   = document.getElementById('switch-img-btn');

    if (img) img.src = '../assets/images/challenge_02_groot.jpg';
    if (label) label.textContent = '⏱ MEMORIZE IMAGE 2 / 2 (GROOT)';
    if (btn) btn.textContent = 'CONTINUE MISSION →';

    let seconds = 10;
    const circumference = 2 * Math.PI * 42;
    const ring   = document.getElementById('reveal-timer-ring');
    const digits = document.getElementById('reveal-countdown');

    const tick2 = () => {
      if (ring) ring.style.strokeDashoffset = (circumference * (1 - seconds / 10)).toString();
      if (digits) digits.textContent = seconds;
      if (seconds <= 3 && ring) ring.style.stroke = '#F43F5E';
      else if (ring) ring.style.stroke = 'var(--neon-purple)';

      if (seconds <= 0) {
        clearInterval(this.imageRevealTimer);
        this.goToStage(7); // Mission Objective
      } else {
        seconds--;
      }
    };

    tick2();
    this.imageRevealTimer = setInterval(tick2, 1000);
    window.soundSystem && window.soundSystem.playBoot();
  }

  /* ── Stage 8: Rules Animation ─────────────────────────────────────── */
  animateRules() {
    const items = document.querySelectorAll('#rules-list .rule-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 180 + 100);
    });
  }

  /* ── Stage 10: 5-Minute Main Timer ─────────────────────────────────── */
  startTimer() {
    if (this.timerRunning) return;
    this.timerRunning = true;
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-block';

    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateTimerDisplay();
        if (this.timerSeconds === 60) window.soundSystem && window.soundSystem.playAlarm();
      } else {
        this.pauseTimer();
        window.soundSystem && window.soundSystem.playComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    if (startBtn) { startBtn.style.display = 'inline-block'; startBtn.textContent = '▶ RESUME TIMER'; }
    if (pauseBtn) pauseBtn.style.display = 'none';
  }

  resetTimer() {
    this.pauseTimer();
    this.timerSeconds = 300;
    this.updateTimerDisplay();
    const startBtn = document.getElementById('timer-start-btn');
    if (startBtn) startBtn.textContent = '▶ START TIMER';
  }

  updateTimerDisplay() {
    const m = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
    const s = (this.timerSeconds % 60).toString().padStart(2, '0');
    const digits = document.getElementById('big-timer-digits');
    if (digits) digits.textContent = `${m}:${s}`;

    const fill = document.getElementById('big-timer-fill');
    if (fill) {
      const circumference = 2 * Math.PI * 114; // 716.3
      fill.style.strokeDashoffset = (circumference * (1 - this.timerSeconds / 300)).toString();
    }
  }

  /* ── Presenter Controls ───────────────────────────────────────────── */
  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    const p = document.getElementById('presenter-panel');
    if (p) p.classList.toggle('open', this.presenterOpen);
  }

  bindPresenter() {
    const fab = document.getElementById('presenter-fab');
    if (fab) fab.addEventListener('click', () => this.togglePresenter());

    const jumpBtn = document.getElementById('pp-jump-btn');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => {
        const sel = document.getElementById('pp-stage-select');
        if (sel) this.goToStage(parseInt(sel.value));
      });
    }

    const pStart = document.getElementById('pp-timer-start');
    const pPause = document.getElementById('pp-timer-pause');
    const pReset = document.getElementById('pp-timer-reset');
    const pRestart = document.getElementById('pp-restart');

    if (pStart) pStart.addEventListener('click', () => this.startTimer());
    if (pPause) pPause.addEventListener('click', () => this.pauseTimer());
    if (pReset) pReset.addEventListener('click', () => this.resetTimer());
    if (pRestart) pRestart.addEventListener('click', () => window.location.reload());
  }

  bindButtons() {
    const s2Next = document.getElementById('s2-next');
    if (s2Next) {
      s2Next.addEventListener('click', () => {
        this.triggerGlitch(() => this.goToStage(3));
      });
    }

    const b = (id, targetStage) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => this.goToStage(targetStage));
    };

    b('s3-next', 4);
    b('s4-next', 5);
    b('s7-next', 8);
    b('s8-next', 9);
    b('s9-next', 10);
    b('s10-next', 11);

    const s5Start = document.getElementById('s5-start');
    if (s5Start) s5Start.addEventListener('click', () => this.startCountdownSequence());

    const switchBtn = document.getElementById('switch-img-btn');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        if (this.currentImgNum === 1) {
          this.switchToImage2();
        } else {
          clearInterval(this.imageRevealTimer);
          this.goToStage(7);
        }
      });
    }

    const tStart = document.getElementById('timer-start-btn');
    const tPause = document.getElementById('timer-pause-btn');
    if (tStart) tStart.addEventListener('click', () => this.startTimer());
    if (tPause) tPause.addEventListener('click', () => this.pauseTimer());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.alphaMission1 = new AlphaMission1();
});
