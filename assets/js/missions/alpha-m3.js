/* ==========================================================================
   ALPHA MISSION 3 — Operation Synapse Restore (v2)
   Robust event handlers, safe element checks, 15-min timer
   ========================================================================== */

const CLUES = [
  'I was created in 1991.',
  'My mascot is a penguin 🐧.',
  'I power over 90% of cloud servers and supercomputers around the world.',
];

class AlphaMission3 {
  constructor() {
    this.currentStage   = 1;
    this.totalStages    = 8;
    this.missionTimer   = null;
    this.missionSeconds = 900; // 15 minutes
    this.missionRunning = false;
    this.clueIndex      = 0;
    this.presenterOpen  = false;
    this.init();
  }

  init() {
    this.runBootSequence();
    this.bindAllButtons();
    this.bindPresenter();
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.togglePresenter();
      if (e.key === 'ArrowRight') this.nextStage();
    });
  }

  /* ── Boot Sequence ─────────────────────────────────────────────────── */
  runBootSequence() {
    const fill = document.getElementById('boot-fill');
    let pct = 0;
    const bootInterval = setInterval(() => {
      pct += Math.random() * 10 + 4;
      if (fill) fill.style.width = Math.min(pct, 100) + '%';
      if (pct >= 100) {
        clearInterval(bootInterval);
        setTimeout(() => this.triggerFailure(), 500);
      }
    }, 80);
  }

  triggerFailure() {
    this.triggerGlitch();
    const fail = document.getElementById('failure-reveal');
    if (fail) fail.style.display = 'block';

    setTimeout(() => {
      this.triggerGlitch();
      const bt = document.getElementById('briefing-text');
      if (bt) bt.style.display = 'block';
      const briefingLines = [
        { text: 'Five security modules have been encrypted.', color: '#fff', delay: 0 },
        { text: 'Only elite Synapse Agents can restore the AI Core.', color: 'var(--text-sub)', delay: 1000 },
        { text: 'Teams have 15 minutes to complete all 5 modules.', color: '#F59E0B', delay: 2000 },
        { text: 'Failure is not an option.', color: '#F43F5E', delay: 2800 },
      ];
      briefingLines.forEach(({ text, color, delay }) => {
        setTimeout(() => {
          const p = document.createElement('p');
          p.textContent = text;
          p.style.color = color;
          p.style.opacity = '0';
          p.style.transition = 'opacity 0.5s ease';
          p.style.fontSize = '1rem';
          p.style.marginBottom = '0.5rem';
          bt.appendChild(p);
          requestAnimationFrame(() => requestAnimationFrame(() => p.style.opacity = '1'));
        }, delay);
      });

      const btn = document.getElementById('s1-next');
      setTimeout(() => { if (btn) btn.style.display = 'inline-flex'; }, 3800);
    }, 1000);
  }

  /* ── Stage Navigation ──────────────────────────────────────────────── */
  nextStage() { if (this.currentStage < this.totalStages) this.goToStage(this.currentStage + 1); }

  goToStage(n) {
    const prev = document.getElementById(`stage-${this.currentStage}`);
    const next = document.getElementById(`stage-${n}`);
    if (!next) return;
    if (prev) prev.classList.remove('active');
    this.currentStage = n;
    next.classList.add('active');

    const ind = document.getElementById('stage-indicator');
    if (ind) ind.textContent = `MISSION 03 // STAGE ${n} OF ${this.totalStages}`;

    this.onStageEnter(n);
    this.triggerGlitch();
    window.soundSystem && window.soundSystem.playClick();
  }

  onStageEnter(n) {
    if (n === 2) this.animateRules();
    if (n === 3) this.showMissionTimer();
    if (n === 8) { this.pulseEnergy(); window.soundSystem && window.soundSystem.playComplete(); }
  }

  showMissionTimer() {
    const disp = document.getElementById('mission-timer-display');
    if (disp) disp.style.display = 'block';
  }

  startMissionTimer() {
    if (this.missionRunning) return;
    this.missionRunning = true;
    this.showMissionTimer();
    this.missionTimer = setInterval(() => {
      this.missionSeconds--;
      const m = Math.floor(this.missionSeconds / 60);
      const s = this.missionSeconds % 60;
      const disp = document.getElementById('mission-timer-display');
      const timeStr = `⏱ ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if (disp) {
        disp.textContent = timeStr;
        if (this.missionSeconds <= 60)  disp.style.color = '#F43F5E';
        else if (this.missionSeconds <= 180) disp.style.color = '#F59E0B';
      }
      if (this.missionSeconds <= 0) clearInterval(this.missionTimer);
    }, 1000);
  }

  pauseMissionTimer() {
    this.missionRunning = false;
    clearInterval(this.missionTimer);
  }

  animateRules() {
    const items = document.querySelectorAll('#rules-list .rule-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 200 + 100);
    });
  }

  /* ── Module 1: MCQ ─────────────────────────────────────────────────── */
  initModule1() {
    const options = document.querySelectorAll('#stage-3 .mc');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('correct', 'wrong'));
        if (opt.dataset.val === '2008') {
          opt.classList.add('correct');
          window.soundSystem && window.soundSystem.playComplete();
        } else {
          opt.classList.add('wrong');
          window.soundSystem && window.soundSystem.playClick();
        }
      });
    });

    const nextBtn = document.getElementById('m1-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToStage(4));
  }

  /* ── Module 2: ASCII ───────────────────────────────────────────────── */
  initModule2() {
    const nextBtn = document.getElementById('m2-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToStage(5));
  }

  /* ── Module 3: Stack ───────────────────────────────────────────────── */
  initModule3() {
    const nextBtn = document.getElementById('m3-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToStage(6));
  }

  /* ── Module 4: Identity (Who Am I) ─────────────────────────────────── */
  /* ── Module 4: Identity (Who Am I) ─────────────────────────────────── */
  initModule4() {
    const nextBtn = document.getElementById('m4-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToStage(7));
  }

  /* ── Module 5: Cyber Defense ───────────────────────────────────────── */
  initModule5() {
    const realCard = document.getElementById('real-card');
    const fakeCard = document.getElementById('fake-card');

    if (realCard) {
      realCard.addEventListener('click', () => {
        realCard.style.boxShadow = '0 0 30px rgba(16,185,129,0.8)';
        window.soundSystem && window.soundSystem.playComplete();
      });
    }

    if (fakeCard) {
      fakeCard.addEventListener('click', () => {
        fakeCard.style.boxShadow = '0 0 30px rgba(244,63,94,0.8)';
        window.soundSystem && window.soundSystem.playClick();
      });
    }

    const nextBtn = document.getElementById('m5-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToStage(8));
  }

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

  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    const panel = document.getElementById('presenter-panel');
    if (panel) panel.classList.toggle('open', this.presenterOpen);
  }

  bindPresenter() {
    const fab   = document.getElementById('presenter-fab');
    const start = document.getElementById('pp-start-timer');
    const stop  = document.getElementById('pp-stop-timer');
    const next  = document.getElementById('pp-next-pp');
    const prev  = document.getElementById('pp-prev');
    const rest  = document.getElementById('pp-restart');

    if (fab)   fab.addEventListener('click', () => this.togglePresenter());
    if (start) start.addEventListener('click', () => this.startMissionTimer());
    if (stop)  stop.addEventListener('click', () => this.pauseMissionTimer());
    if (next)  next.addEventListener('click', () => this.nextStage());
    if (prev)  prev.addEventListener('click', () => { if (this.currentStage > 1) this.goToStage(this.currentStage - 1); });
    if (rest)  rest.addEventListener('click', () => window.location.reload());
  }

  bindAllButtons() {
    const s1 = document.getElementById('s1-next');
    if (s1) s1.addEventListener('click', () => this.goToStage(2));

    const s2 = document.getElementById('s2-next');
    if (s2) s2.addEventListener('click', () => {
      this.goToStage(3);
      this.startMissionTimer();
    });

    this.initModule1();
    this.initModule2();
    this.initModule3();
    this.initModule4();
    this.initModule5();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.mission3 = new AlphaMission3();
});
