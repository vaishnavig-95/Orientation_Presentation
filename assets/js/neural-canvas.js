/* ==========================================================================
   THE SYNAPSE SOCIETY - NEURAL CANVAS & PARTICLE ASSEMBLY ENGINE
   ========================================================================== */

class NeuralCanvasEngine {
  constructor() {
    this.canvas = document.getElementById('neural-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.particles = [];
    this.assemblyParticles = [];
    this.numParticles = Math.min(Math.floor((this.width * this.height) / 12000), 120);
    
    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      radius: 180,
      active: false
    };

    this.mode = 'ambient'; // 'ambient' or 'assembly'
    this.assemblyProgress = 0; // 0 to 1
    this.logoPoints = [];
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    this.createAmbientParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createAmbientParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.3 ? '#8A2BE2' : (Math.random() > 0.5 ? '#A855F7' : '#00F3FF'),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }
  }

  // Generate target points for assembling the Synapse Society Logo ring & node structure
  generateLogoAssemblyPoints() {
    const points = [];
    const centerX = this.width / 2;
    const centerY = this.height / 2 - 40;
    const radius = Math.min(this.width, this.height) * 0.16;
    
    const count = 350;
    // Outer glowing ring
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.sin(angle * 6) * 12);
      points.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        color: '#A855F7'
      });
    }

    // Inner neural bridge lines / core circle
    const innerCount = 180;
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2;
      const r = radius * 0.55;
      points.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        color: '#00F3FF'
      });
    }

    // Center core node
    for (let i = 0; i < 50; i++) {
      const r = (Math.random() * radius * 0.25);
      const angle = Math.random() * Math.PI * 2;
      points.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        color: '#FFFFFF'
      });
    }

    return points;
  }

  startAssemblySequence(onProgress, onComplete) {
    this.mode = 'assembly';
    this.logoPoints = this.generateLogoAssemblyPoints();
    this.assemblyParticles = [];

    // Create particles scattered across screen
    for (let i = 0; i < this.logoPoints.length; i++) {
      const target = this.logoPoints[i];
      const startAngle = Math.random() * Math.PI * 2;
      const startDist = Math.max(this.width, this.height) * (0.6 + Math.random() * 0.5);
      
      this.assemblyParticles.push({
        x: this.width / 2 + Math.cos(startAngle) * startDist,
        y: this.height / 2 + Math.sin(startAngle) * startDist,
        targetX: target.x,
        targetY: target.y,
        color: target.color,
        size: Math.random() * 2.5 + 1,
        speed: 0.02 + Math.random() * 0.03
      });
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.015;
      this.assemblyProgress = Math.min(progress, 1);
      if (onProgress) onProgress(this.assemblyProgress);

      if (progress >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          this.mode = 'ambient';
          if (onComplete) onComplete();
        }, 800);
      }
    }, 30);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.mode === 'assembly') {
      this.drawAssemblyMode();
    } else {
      this.drawAmbientMode();
    }

    requestAnimationFrame(() => this.animate());
  }

  drawAssemblyMode() {
    for (let p of this.assemblyParticles) {
      p.x += (p.targetX - p.x) * p.speed;
      p.y += (p.targetY - p.y) * p.speed;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    }

    if (this.assemblyProgress > 0.6) {
      const alpha = (this.assemblyProgress - 0.6) * 2.5;
      this.ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.35})`;
      this.ctx.lineWidth = 1;
      for (let i = 0; i < this.assemblyParticles.length; i += 8) {
        const p1 = this.assemblyParticles[i];
        const p2 = this.assemblyParticles[(i + 20) % this.assemblyParticles.length];
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    }
  }

  drawAmbientMode() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      p.pulse += p.pulseSpeed;
      const currentRadius = p.radius + Math.sin(p.pulse) * 0.8;

      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.28;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }
  }

  setThemeMode(theme) {
    if (theme === 'beta') {
      this.particles.forEach(p => {
        p.color = Math.random() > 0.4 ? '#00F3FF' : '#A855F7';
      });
    } else {
      this.particles.forEach(p => {
        p.color = Math.random() > 0.3 ? '#8A2BE2' : (Math.random() > 0.5 ? '#A855F7' : '#00F3FF');
      });
    }
  }
}

window.neuralEngine = null;
window.addEventListener('DOMContentLoaded', () => {
  window.neuralEngine = new NeuralCanvasEngine();
});
