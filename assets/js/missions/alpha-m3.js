/* ==========================================================================
   ALPHA MISSION 3 — Operation Synapse Restore
   15-min timer, 5-module reveal machine, presenter panel
   ========================================================================== */

const CLUES = [
  'I was created in 1991.',
  'My mascot is a penguin.',
  'I power most servers around the world.',
];

class AlphaMission3 {
  constructor() {
    this.currentStage = 1;
    this.totalStages  = 8;
    this.missionTimer     = null;
    this.missionSeconds   = 900; // 15 minutes
    this.missionRunning   = false;
    this.clueIndex        = 0;
    this.presenterOpen    = false;
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
      pct += Math.random() * 8 + 3;
      if (fill) fill.style.width = Math.min(pct, 100) + '%';
      if (pct >= 100) {
        clearInterval(bootInterval);
        setTimeout(() => this.triggerFailure(), 600);
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
        { text: 'Only elite Synapse Agents can restore the AI Core.', color: 'var(--text-sub)', delay: 1200 },
        { text: 'Teams have 15 minutes.', color: '#F59E0B', delay: 2400 },
        { text: 'Failure is not an option.', color: '#F43F5E', delay: 3200 },
      ];
      briefingLines.forEach(({ text, color, delay }) => {
        setTimeout(() => {
          const p = document.createElement('p');
          p.textContent = text;
          p.style.color  = color;
          p.style.opacity = '0';
          p.style.transition = 'opacity 0.5s ease';
          p.style.fontSize = '1rem';
          p.style.marginBottom = '0.6rem';
          bt.appendChild(p);
          requestAnimationFrame(() => requestAnimationFrame(() => p.style.opacity = '1'));
        }, delay);
      });

      const btn = document.getElementById('s1-next');
      setTimeout(() => { if (btn) btn.style.display = 'inline-flex'; }, 4500);
    }, 1200);
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
    this.onStageEnter(n);
    this.triggerGlitch();
    window.soundSystem && window.soundSystem.playClick();
  }

  onStageEnter(n) {
    if (n === 2) this.animateRules();
    if (n === 3) this.showMissionTimer();
    if (n === 6) this.initClues();
    if (n === 8) { this.pulseEnergy(); window.soundSystem && window.soundSystem.playComplete(); }
  }

  /* ── Mission Timer ─────────────────────────────────────────────────── */
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

  /* ── Rules Animation ───────────────────────────────────────────────── */
  animateRules() {
    const items = document.querySelectorAll('#rules-list .rule-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 220 + 100);
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

    document.getElementById('m1-reveal-btn').addEventListener('click', () => {
      options.forEach(o => { o.classList.remove('correct','wrong'); if (o.dataset.val === '2008') o.classList.add('correct'); });
      const rev = document.getElementById('m1-reveal');
      if (rev) rev.style.display = 'block';
      const prog = document.getElementById('m1-prog-fill');
      if (prog) setTimeout(() => prog.style.width = '20%', 300);
      this.pulseEnergy();
    });

    document.getElementById('m1-next').addEventListener('click', () => this.goToStage(4));
  }

  /* ── Module 2: ASCII ───────────────────────────────────────────────── */
  initModule2() {
    document.getElementById('m2-decode-btn').addEventListener('click', () => {
      const el = document.getElementById('decoded-text');
      if (el) el.style.opacity = '1';
      window.soundSystem && window.soundSystem.playBoot();
    });

    document.getElementById('m2-reveal-btn').addEventListener('click', () => {
      const rev = document.getElementById('m2-reveal');
      if (rev) rev.style.display = 'block';
      this.pulseEnergy();
      window.soundSystem && window.soundSystem.playComplete();
    });

    document.getElementById('m2-next').addEventListener('click', () => this.goToStage(5));
  }

  /* ── Module 3: Stack ───────────────────────────────────────────────── */
  initModule3() {
    document.getElementById('m3-animate-btn').addEventListener('click', () => {
      const items = document.querySelectorAll('.stack-item');
      items.forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('placed');
          window.soundSystem && window.soundSystem.playHover();
        }, i * 320);
      });
    });

    document.getElementById('m3-reveal-btn').addEventListener('click', () => {
      const items = document.querySelectorAll('.stack-item');
      items.forEach(item => item.classList.add('placed'));
      const rev = document.getElementById('m3-reveal');
      if (rev) rev.style.display = 'block';
      this.pulseEnergy();
      window.soundSystem && window.soundSystem.playComplete();
    });

    document.getElementById('m3-next').addEventListener('click', () => this.goToStage(6));
  }

  /* ── Module 4: Who Am I? ───────────────────────────────────────────── */
  initClues() {
    this.clueIndex = 0;
    const box = document.getElementById('clues-box');
    if (box) box.innerHTML = '';
  }

  initModule4() {
    document.getElementById('m4-clue-btn').addEventListener('click', () => {
      if (this.clueIndex >= CLUES.length) return;
      const box = document.getElementById('clues-box');
      const line = document.createElement('div');
      line.className = 'clue-line';
      line.textContent = `> ${CLUES[this.clueIndex]}`;
      box.appendChild(line);
      requestAnimationFrame(() => requestAnimationFrame(() => line.classList.add('shown')));
      this.clueIndex++;
      window.soundSystem && window.soundSystem.playBoot();

      if (this.clueIndex >= CLUES.length) {
        const q = document.getElementById('who-am-i-question');
        if (q) q.style.opacity = '1';
      }
    });

    document.getElementById('m4-reveal-btn').addEventListener('click', () => {
      // Show all clues
      CLUES.forEach((clue, i) => {
        if (i >= this.clueIndex) {
          const box = document.getElementById('clues-box');
          const line = document.createElement('div');
          line.className = 'clue-line shown';
          line.textContent = `> ${clue}`;
          box.appendChild(line);
        }
      });
      this.clueIndex = CLUES.length;
      const q = document.getElementById('who-am-i-question');
      if (q) q.style.opacity = '1';

      const rev = document.getElementById('m4-reveal');
      if (rev) rev.style.display = 'block';
      this.pulseEnergy();
      window.soundSystem && window.soundSystem.playComplete();
    });

    document.getElementById('m4-next').addEventListener('click', () => this.goToStage(7));
  }

  /* ── Module 5: Cyber Defense ───────────────────────────────────────── */
  initModule5() {
    document.getElementById('m5-reveal-btn').addEventListener('click', () => {
      // Highlight real card
      const realCard = document.getElementById('real-card');
      const fakeWarn = document.getElementById('fake-warning');
      if (realCard) { realCard.style.boxShadow = '0 0 30px rgba(16,185,129,0.6)'; }
      if (fakeWarn) fakeWarn.style.display = 'flex';
      const rev = document.getElementById('m5-reveal');
      if (rev) rev.style.display = 'block';
      this.pulseEnergy();
      window.soundSystem && window.soundSystem.playComplete();
    });

    document.getElementById('m5-next').addEventListener('click', () => this.goToStage(8));
  }

  /* ── Glitch / Pulse helpers ────────────────────────────────────────── */
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

  /* ── Presenter Panel ───────────────────────────────────────────────── */
  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    const panel = document.getElementById('presenter-panel');
    if (panel) panel.classList.toggle('open', this.presenterOpen);
  }

  bindPresenter() {
    document.getElementById('presenter-fab').addEventListener('click', () => this.togglePresenter());
    document.getElementById('pp-start-timer').addEventListener('click', () => this.startMissionTimer());
    document.getElementById('pp-stop-timer').addEventListener('click', () => this.pauseMissionTimer());
    document.getElementById('pp-next-pp').addEventListener('click', () => this.nextStage());
    document.getElementById('pp-prev').addEventListener('click', () => { if (this.currentStage > 1) this.goToStage(this.currentStage - 1); });
    document.getElementById('pp-restart').addEventListener('click', () => window.location.reload());
  }

  /* ── Bind All Buttons ──────────────────────────────────────────────── */
  bindAllButtons() {
    document.getElementById('s1-next').addEventListener('click', () => this.goToStage(2));
    document.getElementById('s2-next').addEventListener('click', () => {
      this.goToStage(3);
      this.startMissionTimer();
    });

    // Init each module once DOM is ready
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
