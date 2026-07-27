/* ==========================================================================
   THE SYNAPSE SOCIETY - SYNAPSE AI TRAINING SIMULATOR FRAMEWORK
   Core Application Controller & Navigation State Machine
   ========================================================================== */

/* ─── Mission Data (Placeholders) ────────────────────────────────────────── */
const PROTOCOL_DATA = {
  alpha: {
    label: 'TEAM ALPHA',
    subtitle: 'Think Like AI',
    themeClass: 'alpha',
    missions: [
      {
        id: 'alpha-m1',
        badge: 'MISSION 01',
        title: 'Prompt Engineering Challenge',
        desc: 'Observe an AI-generated image for 5 seconds, then write the perfect prompt to recreate it in Gemini.',
        icon: '✍️',
        status: 'unlocked',
        url: 'missions/alpha-m1.html'
      },
      {
        id: 'alpha-m2',
        badge: 'MISSION 02',
        title: 'AI Emoji Decoder',
        desc: 'Decode 15 emoji transmissions from the Synapse AI. The language module is corrupted — only emojis remain.',
        icon: '🤖',
        status: 'unlocked',
        url: 'missions/alpha-m2.html'
      },
      {
        id: 'alpha-m3',
        badge: 'MISSION 03',
        title: 'Operation Synapse Restore',
        desc: 'Restore 5 encrypted system modules in 15 minutes to bring the Synapse AI Core back online.',
        icon: '🧠',
        status: 'unlocked',
        url: 'missions/alpha-m3.html'
      }
    ]
  },
  beta: {
    label: 'TEAM BETA',
    subtitle: 'Create With AI',
    themeClass: 'beta',
    missions: [
      {
        id: 'beta-m1',
        badge: 'MISSION 04',
        title: "Wizard's Game Forge",
        desc: 'Use Gemini Canvas to build a magical wizard-themed browser game in just 5 minutes.',
        icon: '✨',
        status: 'unlocked',
        url: 'missions/beta-m1.html'
      },
      {
        id: 'beta-m2',
        badge: 'MISSION 05',
        title: 'AI Vision Challenge',
        desc: 'Identify hidden technology from heavily zoomed images — see the world through the eyes of Computer Vision.',
        icon: '👁️',
        status: 'unlocked',
        url: 'missions/beta-m2.html'
      },
      {
        id: 'beta-m3',
        badge: 'MISSION 06',
        title: 'Prompt Relay',
        desc: 'Whisper a prompt through 10 agents. Watch how AI output changes with every word lost along the chain.',
        icon: '📡',
        status: 'unlocked',
        url: 'missions/beta-m3.html'
      }
    ]
  }
};

/* ─── Navigation Manager ─────────────────────────────────────────────────── */
class NavigationManager {
  constructor() {
    this.currentView = 'intro';   // 'intro' | 'home' | 'alpha' | 'beta'
    this.history = [];
    this.wipeOverlay = document.getElementById('screen-wipe-overlay');
    this.checkHash();
  }

  checkHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'alpha' || hash === 'beta' || hash === 'home') {
      setTimeout(() => {
        this.navigateTo(hash, { instant: true });
      }, 100);
    }
  }

  navigateTo(viewId, opts = {}) {
    if (viewId === this.currentView) return;

    const prevView = this.currentView;
    this.history.push(prevView);
    this.currentView = viewId;

    if (opts.instant) {
      this._swapViews(prevView, viewId);
      return;
    }

    // Cinematic wipe transition
    if (this.wipeOverlay) {
      this.wipeOverlay.classList.remove('wipe-in', 'wipe-out');
      void this.wipeOverlay.offsetWidth;
      this.wipeOverlay.classList.add('wipe-in');

      const onWipeInEnd = () => {
        this.wipeOverlay.removeEventListener('animationend', onWipeInEnd);
        this._swapViews(prevView, viewId);

        void this.wipeOverlay.offsetWidth;
        this.wipeOverlay.classList.remove('wipe-in');
        this.wipeOverlay.classList.add('wipe-out');

        this.wipeOverlay.addEventListener('animationend', () => {
          this.wipeOverlay.classList.remove('wipe-out');
        }, { once: true });
      };

      this.wipeOverlay.addEventListener('animationend', onWipeInEnd, { once: true });
    } else {
      this._swapViews(prevView, viewId);
    }
  }

  _swapViews(fromId, toId) {
    const from = document.getElementById(`${fromId}-screen`);
    const to   = document.getElementById(`${toId}-screen`);

    if (from) from.classList.remove('active');
    if (to)   to.classList.add('active');

    this._updateNav(toId);
    this._updateCardEntryAnimations(to);
  }

  _updateNav(viewId) {
    const header = document.getElementById('top-header');
    const navItems = document.querySelectorAll('.nav-item');
    const backBtn  = document.getElementById('back-btn');

    // Hide header on intro
    if (viewId === 'intro') {
      if (header) header.classList.add('hidden');
    } else {
      if (header) header.classList.remove('hidden');
    }

    // Active nav
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Back button visibility
    if (backBtn) {
      backBtn.style.display = (viewId !== 'home' && viewId !== 'intro') ? '' : 'none';
    }
  }

  _updateCardEntryAnimations(section) {
    if (!section) return;
    // Re-trigger staggered entry animations
    const cards = section.querySelectorAll('.mission-card, .protocol-card');
    cards.forEach(card => {
      card.classList.remove('anim-fade-up');
      void card.offsetWidth;
      card.classList.add('anim-fade-up');
    });
  }

  back() {
    const prev = this.history.pop();
    if (prev) {
      this.currentView = null; // bypass guard
      this.navigateTo(prev);
    }
  }
}

/* ─── 3D Card Tilt Controller ────────────────────────────────────────────── */
class TiltCardController {
  constructor() {
    this.cards = document.querySelectorAll('.protocol-card[data-tilt]');
    this.bind();
  }

  bind() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this._onMouseMove(e, card));
      card.addEventListener('mouseleave', () => this._onMouseLeave(card));
    });
  }

  _onMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;

    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    const rotY =  dx * 12;  // max ±12deg
    const rotX = -dy * 10;  // max ±10deg

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;

    // Parallax glow highlight
    const glare = card.querySelector('.card-glare');
    if (glare) {
      const gx = (dx * 0.5 + 0.5) * 100;
      const gy = (dy * 0.5 + 0.5) * 100;
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(168,85,247,0.18) 0%, transparent 70%)`;
    }

    window.soundSystem && window.soundSystem.playHover && window.soundSystem.playHover();
  }

  _onMouseLeave(card) {
    card.style.transform = '';
    const glare = card.querySelector('.card-glare');
    if (glare) glare.style.background = 'transparent';
  }
}

/* ─── Opening Intro Sequence Controller ─────────────────────────────────── */
class OpeningSequenceController {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.progressFill   = document.getElementById('boot-progress-fill');
    this.bootText       = document.getElementById('boot-status-text');
    this.introLogo      = document.getElementById('intro-logo-img');
    this.introTitle     = document.getElementById('intro-main-title');
    this.introSubtitle  = document.getElementById('intro-subtitle');
    this.introBootBox   = document.getElementById('boot-status-box');
    this.skipBtn        = document.getElementById('skip-intro-btn');
    this.skipUsed       = false;

    this.bootSteps = [
      { pct: 15, msg: 'Initializing Synapse AI Training Simulator...' },
      { pct: 30, msg: 'Loading neural architecture modules...' },
      { pct: 52, msg: 'Establishing protocol pathways...' },
      { pct: 72, msg: 'Calibrating team environments...' },
      { pct: 88, msg: 'Syncing mission database...' },
      { pct: 100, msg: 'SYSTEM READY // Welcome, Agent.' }
    ];

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this._skip());
    }
  }

  start() {
    // First, start the particle assembly sequence on the neural canvas
    setTimeout(() => {
      if (window.neuralEngine && window.neuralEngine.startAssemblySequence) {
        window.neuralEngine.startAssemblySequence(
          (progress) => { /* assembling... */ },
          () => this._onAssemblyComplete()
        );
      } else {
        this._onAssemblyComplete();
      }
    }, 400);
  }

  _onAssemblyComplete() {
    if (this.introLogo) this.introLogo.classList.add('assembled');

    // Reveal title
    setTimeout(() => {
      if (this.introTitle)    this.introTitle.classList.add('visible');
      if (this.introSubtitle) this.introSubtitle.classList.add('visible');
    }, 500);

    // Show boot box & progress
    setTimeout(() => {
      if (this.introBootBox) this.introBootBox.classList.add('visible');
      if (this.skipBtn)      this.skipBtn.classList.add('visible');
      this._runBootProgress();
    }, 900);
  }

  _runBootProgress() {
    let step = 0;
    const next = () => {
      if (step >= this.bootSteps.length || this.skipUsed) return;

      const { pct, msg } = this.bootSteps[step];

      if (this.progressFill) this.progressFill.style.width = `${pct}%`;
      if (this.bootText)     this.bootText.textContent = msg;

      step++;

      if (step < this.bootSteps.length) {
        setTimeout(next, 550 + Math.random() * 250);
      } else {
        setTimeout(() => {
          if (!this.skipUsed) this._complete();
        }, 900);
      }
    };
    next();
  }

  _skip() {
    this.skipUsed = true;
    this._complete();
  }

  _complete() {
    if (this.onComplete) this.onComplete();
  }
}

/* ─── Mission Modal Controller ───────────────────────────────────────────── */
class MissionModalController {
  constructor() {
    this.overlay   = document.getElementById('mission-modal-overlay');
    this.title     = document.getElementById('modal-mission-title');
    this.badge     = document.getElementById('modal-mission-badge');
    this.body      = document.getElementById('modal-mission-body');
    this.closeBtn  = document.getElementById('modal-close-btn');

    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.overlay)  this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open(mission) {
    if (!this.overlay) return;

    if (this.badge) this.badge.textContent = mission.badge;
    if (this.title) this.title.textContent = mission.title;
    if (this.body)  this.body.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 1rem;">${mission.icon}</div>
      <p>${mission.desc}</p>
      <br>
      <p style="color: var(--text-muted); font-size:0.85rem; font-style:italic;">
        This mission placeholder will be replaced with detailed challenge content. 
        Status: <strong style="color:var(--accent-rose)">${mission.status.toUpperCase()}</strong>
      </p>
    `;

    this.overlay.classList.add('active');
    window.soundSystem && window.soundSystem.playLaunch();
  }

  close() {
    if (this.overlay) this.overlay.classList.remove('active');
  }
}

/* ─── Protocol Screen Builder ────────────────────────────────────────────── */
class ProtocolScreenBuilder {
  constructor(teamKey, modalController) {
    this.teamKey = teamKey; // 'alpha' | 'beta'
    this.data = PROTOCOL_DATA[teamKey];
    this.modal = modalController;
  }

  buildMissionCards(container) {
    if (!container) return;
    container.innerHTML = '';

    this.data.missions.forEach((mission, idx) => {
      const card = document.createElement('div');
      card.className = `mission-card scanline-card${mission.status === 'locked' ? ' locked' : ''}${mission.status === 'complete' ? ' complete' : ''} anim-fade-up`;
      card.style.animationDelay = `${idx * 0.13}s`;

      const statusClass = mission.status;
      const btnDisabled = mission.status === 'locked' ? 'disabled' : '';

      card.innerHTML = `
        <div class="mission-top-bar">
          <span class="mission-badge">${mission.badge}</span>
          <span class="status-tag ${statusClass}">${mission.status.toUpperCase()}</span>
        </div>
        <div class="mission-icon">${mission.icon}</div>
        <div class="mission-title">${mission.title}</div>
        <div class="mission-desc">${mission.desc}</div>
        <button class="btn-launch-mission shimmer-card" ${btnDisabled} data-mission-id="${mission.id}">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z"/></svg>
          LAUNCH MISSION
        </button>
      `;

      const btn = card.querySelector('.btn-launch-mission');
      if (btn && !btn.disabled) {
        btn.addEventListener('click', () => {
          window.soundSystem && window.soundSystem.playLaunch();
          if (mission.url) {
            window.location.href = mission.url;
          } else {
            this.modal.open(mission);
          }
        });
      }

      // Locked card click shows "Mission is locked" flash
      if (mission.status === 'locked') {
        card.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          card.style.animation = 'none';
          card.style.border = '1px solid var(--accent-rose)';
          setTimeout(() => {
            card.style.border = '';
          }, 400);
        });
      }

      container.appendChild(card);
    });
  }

  buildSVGPaths(svgEl, cardContainer) {
    if (!svgEl || !cardContainer) return;

    requestAnimationFrame(() => {
      const cards = cardContainer.querySelectorAll('.mission-card');
      if (cards.length < 2) return;

      svgEl.innerHTML = '';

      for (let i = 0; i < cards.length - 1; i++) {
        const r1 = cards[i].getBoundingClientRect();
        const r2 = cards[i + 1].getBoundingClientRect();
        const svgRect = svgEl.getBoundingClientRect();

        const x1 = r1.right - svgRect.left;
        const y1 = r1.top + r1.height / 2 - svgRect.top;
        const x2 = r2.left - svgRect.left;
        const y2 = r2.top + r2.height / 2 - svgRect.top;

        const cx1 = x1 + (x2 - x1) * 0.4;
        const cx2 = x2 - (x2 - x1) * 0.4;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`);
        path.setAttribute('fill', 'none');
        path.classList.add(this.teamKey === 'alpha' ? 'path-node-alpha' : 'path-node-beta');
        svgEl.appendChild(path);

        // Animated glow node at connection end
        ['start', 'end'].forEach((pos) => {
          const x = pos === 'start' ? x1 : x2;
          const y = pos === 'start' ? y1 : y2;
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', x);
          circle.setAttribute('cy', y);
          circle.setAttribute('r', 5);
          circle.setAttribute('fill', this.teamKey === 'alpha' ? '#A855F7' : '#00F3FF');
          circle.style.filter = `drop-shadow(0 0 6px ${this.teamKey === 'alpha' ? '#A855F7' : '#00F3FF'})`;
          svgEl.appendChild(circle);
        });
      }
    });
  }
}

/* ─── Fullscreen Toggle ──────────────────────────────────────────────────── */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen && document.exitFullscreen();
  }
}

/* ─── App Controller (Root) ──────────────────────────────────────────────── */
class AppController {
  constructor() {
    this.nav     = null;
    this.modal   = null;
    this.tilt    = null;
    this.intro   = null;
    this.builders = {};

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.nav   = new NavigationManager();
    this.modal = new MissionModalController();

    // Build protocol screens
    ['alpha', 'beta'].forEach(team => {
      const builder = new ProtocolScreenBuilder(team, this.modal);
      this.builders[team] = builder;

      const cardContainer = document.getElementById(`${team}-mission-cards`);
      builder.buildMissionCards(cardContainer);

      const svgEl = document.getElementById(`${team}-path-svg`);
      builder.buildSVGPaths(svgEl, cardContainer);
    });

    // Tilt cards on home screen
    this.tilt = new TiltCardController();

    // Bind nav events
    this._bindNavigation();

    // Bind fullscreen button
    const fsBtn = document.getElementById('fullscreen-btn');
    if (fsBtn) fsBtn.addEventListener('click', () => {
      toggleFullscreen();
      window.soundSystem && window.soundSystem.playClick();
    });

    // Bind sound toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const muted = window.soundSystem.toggleMute();
        soundBtn.classList.toggle('muted', muted);
      });
    }

    // Start opening intro sequence
    this.nav._updateNav('intro');
    this._startIntro();

    // Handle resize: rebuild SVG paths
    window.addEventListener('resize', () => {
      ['alpha', 'beta'].forEach(team => {
        const svgEl = document.getElementById(`${team}-path-svg`);
        const cardContainer = document.getElementById(`${team}-mission-cards`);
        this.builders[team] && this.builders[team].buildSVGPaths(svgEl, cardContainer);
      });
    });
  }

  _startIntro() {
    this.intro = new OpeningSequenceController(() => {
      this.nav.navigateTo('home', { instant: false });
      window.soundSystem && window.soundSystem.playBoot();
    });

    setTimeout(() => this.intro.start(), 100);
  }

  _bindNavigation() {
    // Nav items (Home, Alpha, Beta)
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.addEventListener('click', () => {
        window.soundSystem && window.soundSystem.playClick();
        this.nav.navigateTo(item.dataset.view);
        if (item.dataset.view === 'alpha' || item.dataset.view === 'beta') {
          const team = item.dataset.view;
          window.neuralEngine && window.neuralEngine.setThemeMode(team);
        }
      });
    });

    // Enter Protocol buttons on home screen
    document.querySelectorAll('.btn-enter-protocol[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        window.soundSystem && window.soundSystem.playLaunch();
        window.neuralEngine && window.neuralEngine.setThemeMode(target);
        this.nav.navigateTo(target);
      });
    });

    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.soundSystem && window.soundSystem.playClick();
        this.nav.back();
      });
    }

    // Return Home buttons inside protocol screens
    document.querySelectorAll('.btn-return-home').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundSystem && window.soundSystem.playClick();
        this.nav.navigateTo('home');
        window.neuralEngine && window.neuralEngine.setThemeMode('alpha');
      });
    });

    // Brand logo click -> home
    const brand = document.querySelector('.brand-container');
    if (brand) {
      brand.addEventListener('click', () => {
        window.soundSystem && window.soundSystem.playClick();
        this.nav.navigateTo('home');
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F11') { e.preventDefault(); toggleFullscreen(); }
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    });
  }
}

/* ─── Bootstrap ──────────────────────────────────────────────────────────── */
window.app = new AppController();
