/* ==========================================================================
   BETA MISSION 3 — Prompt Relay (v2)
   Secret prompts, Agent 10 text input, and Similarity % Calculation
   ========================================================================== */

const RELAY_PROMPTS = [
  { emoji: '🦁', text: 'A majestic golden lion with a fiery mane standing on top of a mountain at sunset, with dramatic purple clouds behind it.' },
  { emoji: '🏰', text: 'A floating crystal castle in the sky surrounded by waterfalls, glowing blue bridges, and friendly dragons flying around it.' },
  { emoji: '🤖', text: 'A friendly silver robot sitting in a coffee shop reading a book, wearing glasses and a red scarf, with a steaming mug on the table.' },
  { emoji: '🌊', text: 'An underwater city made of coral and glowing jellyfish, with mermaids and fish swimming through colourful neon streets.' },
  { emoji: '🚀', text: 'A neon purple spaceship with golden wings landing on a pink alien planet covered with silver trees and twin moons in the sky.' },
  { emoji: '🌸', text: 'A small cozy Japanese tea house surrounded by cherry blossom trees at dusk, with lanterns reflecting in a still pond nearby.' },
  { emoji: '🦊', text: 'A fox wearing a wizard hat riding a bicycle through a foggy magical forest, carrying a glowing lantern in one paw.' },
  { emoji: '🏔️', text: 'A giant panda meditating on top of a snow covered mountain surrounded by bamboo forests and a rainbow overhead.' },
  { emoji: '🎪', text: 'A vintage carnival at night with spinning Ferris wheels, glowing tents, cotton candy clouds, and fireworks above the crowd.' },
  { emoji: '🌌', text: 'A lone astronaut floating in space near a giant bookshelf built between two stars, reading a glowing book with Saturn visible in the background.' },
];

const BRIEF_LINES = [
  { text: 'A message travels through 10 agents.', delay: 200 },
  { text: 'Each agent can only hear the message once.', delay: 1300 },
  { text: 'Each agent can only whisper to the next once.', delay: 2500 },
  { text: '', delay: 3400 },
  { text: 'By the time the message reaches Agent 10,', delay: 3600 },
  { text: 'it may have changed completely.', delay: 4600, color: '#F43F5E' },
  { text: '', delay: 5300 },
  { text: 'Agent 10 then enters what they heard.', delay: 5500 },
  { text: 'The system will calculate the exact percentage', delay: 6600 },
  { text: 'of accuracy lost along the chain.', delay: 7500, color: '#A855F7' },
];

class BetaMission3 {
  constructor() {
    this.currentStage   = 1;
    this.totalStages    = 8;
    this.presenterOpen  = false;
    this.selectedPromptIdx = 0;
    this.agentAdvanced  = 0;
    this.agent10Text    = '';
    this.init();
  }

  init() {
    this.buildPromptCarousel();
    this.buildAgentChain();
    this.bindButtons();
    this.bindPresenter();
    this.bindModalButtons();
    this.bindCompare();
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.togglePresenter();
      if (e.key === 'ArrowRight') this.nextStage();
    });
  }

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
    if (n === 2) this.runBrief();
    if (n === 3) this.animateRules();
    if (n === 5) { this.agentAdvanced = 1; this.updateAgentChain(); }
    if (n === 7) this.setupComparisonStage();
    if (n === 8) { this.triggerGlitch(); window.soundSystem && window.soundSystem.playComplete(); }
  }

  runBrief() {
    const box = document.getElementById('brief-text');
    const btn = document.getElementById('s2-next');
    if (!box) return;
    box.innerHTML = '';
    BRIEF_LINES.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.textContent = text || '\u00A0';
        p.style.color = color || 'var(--text-sub)';
        p.style.fontSize = '1rem';
        p.style.lineHeight = '1.8';
        p.style.opacity = '0';
        p.style.transition = 'opacity 0.5s ease';
        box.appendChild(p);
        requestAnimationFrame(() => requestAnimationFrame(() => p.style.opacity = '1'));
      }, delay);
    });
    const last = BRIEF_LINES[BRIEF_LINES.length - 1].delay + 1200;
    setTimeout(() => { if (btn) btn.style.display = 'block'; }, last);
  }

  animateRules() {
    const items = document.querySelectorAll('#rules-list .rule-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 200 + 100);
    });
  }

  buildPromptCarousel() {
    const container = document.getElementById('prompt-carousel');
    if (!container) return;
    container.innerHTML = '';

    RELAY_PROMPTS.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'prompt-card';
      card.innerHTML = `
        <div class="prompt-card-emoji">${p.emoji}</div>
        <div class="prompt-card-text" style="font-weight:700;color:#fff;">Prompt #${i + 1}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">(Click to view secret)</div>
      `;
      card.addEventListener('click', () => {
        this.selectedPromptIdx = i;
        document.querySelectorAll('.prompt-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.openModal(i);
        window.soundSystem && window.soundSystem.playHover();
      });
      container.appendChild(card);
    });
  }

  openModal(idx) {
    const p = RELAY_PROMPTS[idx];
    const modal = document.getElementById('prompt-modal');
    document.getElementById('modal-prompt-emoji').textContent = p.emoji;
    document.getElementById('modal-prompt-text').textContent  = p.text;
    modal.classList.add('active');
    window.soundSystem && window.soundSystem.playBoot();
  }

  closeModal() {
    document.getElementById('prompt-modal').classList.remove('active');
  }

  bindModalButtons() {
    document.getElementById('modal-cancel').addEventListener('click', () => {
      document.querySelectorAll('.prompt-card').forEach(c => c.classList.remove('selected'));
      const btn = document.getElementById('s4-next');
      btn.disabled = true; btn.style.opacity = '0.4'; btn.style.pointerEvents = 'none';
      this.closeModal();
    });

    document.getElementById('modal-confirm').addEventListener('click', () => {
      this.closeModal();
      const btn = document.getElementById('s4-next');
      btn.disabled = false; btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
      window.soundSystem && window.soundSystem.playComplete();
    });
  }

  buildAgentChain() {
    const row = document.getElementById('agent-row');
    if (!row) return;
    row.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'agent-node-wrap';

      const node = document.createElement('div');
      node.className = 'agent-node';
      node.id = `agent-${i}`;
      node.textContent = i === 10 ? '📝' : `A${i}`;

      const label = document.createElement('div');
      label.className = 'agent-label';
      label.textContent = i === 10 ? 'Agent 10' : `Agent ${i}`;

      wrap.appendChild(node);
      wrap.appendChild(label);
      row.appendChild(wrap);

      if (i < 10) {
        const connector = document.createElement('div');
        connector.className = 'agent-connector';
        connector.id = `connector-${i}`;
        row.appendChild(connector);
      }
    }
  }

  updateAgentChain() {
    for (let i = 1; i <= 10; i++) {
      const node = document.getElementById(`agent-${i}`);
      if (!node) continue;
      node.classList.remove('active', 'transmitted');
      if (i < this.agentAdvanced) node.classList.add('transmitted');
      if (i === this.agentAdvanced) node.classList.add('active');
    }
    for (let i = 1; i < 10; i++) {
      const conn = document.getElementById(`connector-${i}`);
      if (!conn) continue;
      conn.classList.remove('active');
      if (i < this.agentAdvanced) conn.classList.add('active');
    }
  }

  advanceAgent() {
    if (this.agentAdvanced < 10) {
      this.agentAdvanced++;
      this.updateAgentChain();
      window.soundSystem && window.soundSystem.playHover();
      this.pulseEnergy();

      if (this.agentAdvanced === 10) {
        const btn = document.getElementById('s5-next');
        if (btn) { btn.style.display = ''; btn.style.animation = 'glowPulse 2s ease infinite'; }
        const advBtn = document.getElementById('advance-btn');
        if (advBtn) { advBtn.disabled = true; advBtn.style.opacity = '0.4'; }
        window.soundSystem && window.soundSystem.playLaunch();
      }
    }
  }

  setupComparisonStage() {
    const orig = RELAY_PROMPTS[this.selectedPromptIdx].text;
    const textarea = document.getElementById('agent10-prompt-textarea');
    this.agent10Text = textarea ? textarea.value.trim() : '';

    document.getElementById('original-prompt-display').textContent = orig;
    document.getElementById('final-prompt-display').textContent = this.agent10Text || '(No prompt entered by Agent 10)';
  }

  bindCompare() {
    const compareBtn = document.getElementById('compare-btn');
    if (!compareBtn) return;

    compareBtn.addEventListener('click', () => {
      const original = RELAY_PROMPTS[this.selectedPromptIdx].text;
      const received = this.agent10Text || '';

      // Calculate similarity %
      const similarity = this.calculateSimilarity(original, received);
      
      const badge = document.getElementById('similarity-score-badge');
      const pctEl = document.getElementById('similarity-percentage');
      if (badge) badge.style.display = 'block';
      if (pctEl) pctEl.textContent = `${similarity}%`;

      const diffResult = document.getElementById('diff-result');
      if (diffResult) {
        diffResult.style.display = 'block';
        diffResult.innerHTML = this.generateDiff(original, received);
      }

      const nextBtn = document.getElementById('s7-next');
      if (nextBtn) nextBtn.style.display = '';
      this.pulseEnergy();
      window.soundSystem && window.soundSystem.playComplete();
    });
  }

  calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    const words1 = str1.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const words2 = str2.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);

    let matches = 0;
    const used = new Set();
    words1.forEach(w1 => {
      const idx = words2.findIndex((w2, i) => w2 === w1 && !used.has(i));
      if (idx !== -1) {
        matches++;
        used.add(idx);
      }
    });

    const total = Math.max(words1.length, words2.length);
    return Math.round((matches / total) * 100);
  }

  generateDiff(original, received) {
    const origWords = original.split(' ');
    const recWords  = received.split(' ');
    const maxLen    = Math.max(origWords.length, recWords.length);
    let origHtml = '';
    let recHtml  = '';

    for (let i = 0; i < maxLen; i++) {
      const ow = origWords[i] || '';
      const rw = recWords[i]  || '';
      const owClean = ow.toLowerCase().replace(/[^a-z]/g, '');
      const rwClean = rw.toLowerCase().replace(/[^a-z]/g, '');

      if (owClean === rwClean && owClean !== '') {
        origHtml += `<span class="diff-word match">${ow} </span>`;
        recHtml  += `<span class="diff-word match">${rw} </span>`;
      } else if (ow && rw) {
        origHtml += `<span class="diff-word changed">${ow} </span>`;
        recHtml  += `<span class="diff-word changed">${rw} </span>`;
      } else if (ow) {
        origHtml += `<span class="diff-word missing">${ow} </span>`;
      } else {
        recHtml  += `<span class="diff-word missing">${rw} </span>`;
      }
    }

    return `
      <div style="display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;">
        <div style="flex:1;min-width:260px;">
          <div style="font-family:'Fira Code',monospace;font-size:0.75rem;color:var(--accent-cyan);margin-bottom:6px;">ORIGINAL PROMPT (AGENT 1)</div>
          <div class="compare-prompt-text">${origHtml}</div>
        </div>
        <div style="flex:1;min-width:260px;">
          <div style="font-family:'Fira Code',monospace;font-size:0.75rem;color:var(--neon-purple);margin-bottom:6px;">FINAL PROMPT (AGENT 10)</div>
          <div class="compare-prompt-text">${recHtml || '<span style="color:var(--text-muted);">(Empty)</span>'}</div>
        </div>
      </div>
    `;
  }

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

  togglePresenter() {
    this.presenterOpen = !this.presenterOpen;
    document.getElementById('presenter-panel').classList.toggle('open', this.presenterOpen);
  }

  bindPresenter() {
    document.getElementById('presenter-fab').addEventListener('click', () => this.togglePresenter());
    document.getElementById('pp-prev').addEventListener('click', () => { if (this.currentStage > 1) this.goToStage(this.currentStage - 1); });
    document.getElementById('pp-next').addEventListener('click', () => this.goToStage(this.currentStage + 1));
    document.getElementById('pp-advance').addEventListener('click', () => this.advanceAgent());
    document.getElementById('pp-restart').addEventListener('click', () => window.location.reload());
  }

  bindButtons() {
    document.getElementById('s1-next').addEventListener('click', () => this.goToStage(2));
    document.getElementById('s2-next').addEventListener('click', () => this.goToStage(3));
    document.getElementById('s3-next').addEventListener('click', () => this.goToStage(4));
    document.getElementById('s4-next').addEventListener('click', () => this.goToStage(5));
    document.getElementById('s5-next').addEventListener('click', () => this.goToStage(6));
    document.getElementById('s6-next').addEventListener('click', () => this.goToStage(7));
    document.getElementById('s7-next').addEventListener('click', () => this.goToStage(8));
    document.getElementById('advance-btn').addEventListener('click', () => this.advanceAgent());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.betaMission3 = new BetaMission3();
});
