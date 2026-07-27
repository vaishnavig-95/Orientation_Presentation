/* ==========================================================================
   THE SYNAPSE SOCIETY - MISSION 01: PROMPT ENGINEERING CHALLENGE
   Presenter Control Panel Controller
   ========================================================================== */

class PresenterController {
  constructor() {
    this.panel = document.getElementById('presenter-panel');
    this.isVisible = false;
    
    // 10 Challenge Images Database
    this.imageCatalog = [
      { id: '1', title: '01. Medieval Spider-Man', src: 'assets/images/challenge_01_spiderman.jpg' },
      { id: '2', title: '02. Groot Window Cleaner', src: 'assets/images/challenge_02_groot.jpg' },
      { id: '3', title: '03. Underwater Poseidon Knight', src: 'assets/images/challenge_03_underwater.jpg' },
      { id: '4', title: '04. Clockwork Wizard Library', src: 'assets/images/challenge_04_wizard.jpg' },
      { id: '5', title: '05. Cyberpunk Samurai Rooftop', src: 'assets/images/challenge_05_cyber_samurai.png' },
      { id: '6', title: '06. Steampunk Airship Sunset', src: 'assets/images/challenge_06_steampunk_airship.png' },
      { id: '7', title: '07. Bioluminescent Alien Flora', src: 'assets/images/challenge_07_alien_flora.png' },
      { id: '8', title: '08. Astronaut Cosmic Nebula', src: 'assets/images/challenge_08_astronaut_nebula.png' },
      { id: '9', title: '09. Ice Dragon Aurora Tower', src: 'assets/images/challenge_09_ice_dragon.png' },
      { id: '10', title: '10. Cybernetic Visor Alley Cat', src: 'assets/images/challenge_10_cyber_cat.png' }
    ];
    
    // Default active images
    this.selectedEvenImage = this.imageCatalog[0].src;
    this.selectedOddImage = this.imageCatalog[1].src;
    
    this.submissions = [];
    this.init();
  }
  
  init() {
    this.populateSelects();
    this.bindEvents();
  }
  
  populateSelects() {
    const evenSelect = document.getElementById('pres-even-select');
    const oddSelect = document.getElementById('pres-odd-select');
    
    if (!evenSelect || !oddSelect) return;
    
    evenSelect.innerHTML = '';
    oddSelect.innerHTML = '';
    
    this.imageCatalog.forEach((item, index) => {
      const optEven = document.createElement('option');
      optEven.value = item.src;
      optEven.textContent = item.title;
      if (index === 0) optEven.selected = true;
      evenSelect.appendChild(optEven);
      
      const optOdd = document.createElement('option');
      optOdd.value = item.src;
      optOdd.textContent = item.title;
      if (index === 1) optOdd.selected = true;
      oddSelect.appendChild(optOdd);
    });
  }
  
  bindEvents() {
    // Presenter Toggle Button
    const toggleBtn = document.getElementById('presenter-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.togglePanel());
    }
    
    const closeBtn = document.getElementById('pres-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hidePanel());
    }
    
    // Image selection change handlers
    const evenSelect = document.getElementById('pres-even-select');
    const oddSelect = document.getElementById('pres-odd-select');
    
    if (evenSelect) {
      evenSelect.addEventListener('change', (e) => {
        this.selectedEvenImage = e.target.value;
        this.updateDisplayedImages();
      });
    }
    
    if (oddSelect) {
      oddSelect.addEventListener('change', (e) => {
        this.selectedOddImage = e.target.value;
        this.updateDisplayedImages();
      });
    }
    
    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Toggle Presenter Panel on 'P' key
      if (e.key === 'p' || e.key === 'P') {
        // Prevent toggle if typing in input/textarea
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        this.togglePanel();
      }
      // Stage Navigation
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (window.appState) window.appState.nextStage();
      }
      if (e.key === 'ArrowLeft') {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (window.appState) window.appState.prevStage();
      }
      if (e.key === 'f' || e.key === 'F') {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        this.toggleFullscreen();
      }
      if (e.key === 'r' || e.key === 'R') {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (window.appState) window.appState.restartMission();
      }
    });
  }
  
  togglePanel() {
    this.isVisible = !this.isVisible;
    if (this.panel) {
      this.panel.classList.toggle('visible', this.isVisible);
    }
    if (window.soundSystem) window.soundSystem.playClick();
  }
  
  hidePanel() {
    this.isVisible = false;
    if (this.panel) {
      this.panel.classList.remove('visible');
    }
  }
  
  updateDisplayedImages() {
    const evenImg = document.getElementById('even-challenge-img');
    const oddImg = document.getElementById('odd-challenge-img');
    
    if (evenImg) evenImg.src = this.selectedEvenImage;
    if (oddImg) oddImg.src = this.selectedOddImage;
  }
  
  addSubmission(group, promptText, studentName = 'Agent') {
    this.submissions.push({
      group,
      promptText,
      studentName,
      timestamp: new Date().toLocaleTimeString()
    });
    
    const feed = document.getElementById('pres-submissions-feed');
    if (feed) {
      const item = document.createElement('div');
      item.className = 'pres-submission-item';
      item.innerHTML = `<strong>[${group.toUpperCase()}] ${studentName}:</strong> "${promptText}"`;
      feed.prepend(item);
    }
  }
  
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }
}

window.presenterController = new PresenterController();
