window.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card');
    const celestial = document.getElementById('celestial');
    const windowEl = document.getElementById('window');
    const doorEl = document.getElementById('door');
    const doorFrame = document.getElementById('doorFrame');
    const chimneyEl = document.getElementById('chimney');
    const smokeEl = document.getElementById('smoke');
    const birdEl = document.getElementById('bird');
    const birdFx = document.getElementById('birdFx');
    const starsContainer = document.getElementById('stars');
    const pineTrees = document.querySelectorAll('.pine-tree');
  
    // Responsive scaling for all screen sizes and orientations
    const updateResponsiveScale = () => {
      const padding = 24;
      const availableW = window.innerWidth - padding;
      const availableH = window.innerHeight - padding;
      const scale = Math.min(availableW / 440, availableH / 440, 1);
      document.documentElement.style.setProperty('--scene-scale', scale.toFixed(3));
    };
  
    updateResponsiveScale();
    window.addEventListener('resize', updateResponsiveScale);
    window.addEventListener('orientationchange', updateResponsiveScale);
  
    let audioCtx = null;
    let ambientStarted = false;
    let ambientTimer = null;
  
    const initAudio = () => {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
    };
  
    // SUMMER FOREST AMBIENT 
    const startAmbient = () => {
      if (ambientStarted) return;
      initAudio();
      ambientStarted = true;
  
      // Soft summer breeze
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.03;
      }
      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
  
      const windFilter = audioCtx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.value = 400; 
  
      const windGain = audioCtx.createGain();
      windGain.gain.setValueAtTime(0, audioCtx.currentTime);
      windGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 3);
  
      noiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(audioCtx.destination);
      noiseSource.start();
  
      // Ambient Loop (Bird by day, Crickets by night)
      ambientTimer = setInterval(() => {
        if (!ambientStarted || !audioCtx) return;
        const isNight = document.body.classList.contains('night');
  
        if (isNight) {
          // Crickets (Night)
          if (Math.random() > 0.4) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            const now = audioCtx.currentTime;
            
            osc.frequency.setValueAtTime(4500 + Math.random() * 500, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            
            // Second chirp
            osc.frequency.setValueAtTime(4500 + Math.random() * 500, now + 0.15);
            gain.gain.setValueAtTime(0, now + 0.15);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
          }
        } else {
          // Subtle distant bird (Day)
          if (Math.random() > 0.65) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            const now = audioCtx.currentTime;
  
            osc.frequency.setValueAtTime(2400, now);
            osc.frequency.exponentialRampToValueAtTime(1900, now + 0.12);
  
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.02, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
          }
        }
      }, 4500);
    };
  
    document.body.addEventListener('click', startAmbient, { once: true });
    document.body.addEventListener('touchstart', startAmbient, { once: true, passive: true });
  
    const playChirp = (isNight) => {
      initAudio();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (isNight) {
        // Soft sleep sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.35);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // Happy daytime chirp
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2500, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    };
  
    const playSwitch = () => {
      initAudio();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    };
  
    const playDoor = (isOpen) => {
      initAudio();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(isOpen ? 130 : 210, now);
      osc.frequency.linearRampToValueAtTime(isOpen ? 230 : 110, now + 0.26);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.start(now);
      osc.stop(now + 0.26);
    };
  
    const playPuff = () => {
      initAudio();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    };
  
    const playChime = (isNight) => {
      initAudio();
      const now = audioCtx.currentTime;
      const notes = isNight ? [659.25, 523.25, 392.00] : [392.00, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    };
  
    const playRustle = () => {
      initAudio();
      const now = audioCtx.currentTime;
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.05));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
    };
  
    // Generate stars
    for (let i = 0; i < 35; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 65}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starsContainer.appendChild(star);
    }
  
    // Interactive pine trees
    pineTrees.forEach((tree) => {
      tree.addEventListener('click', () => {
        tree.classList.remove('shake');
        void tree.offsetWidth;
        tree.classList.add('shake');
        playRustle();
  
        const particleBox = tree.querySelector('.tree-particles');
        for (let i = 0; i < 5; i++) {
          const p = document.createElement('div');
          p.className = 'needle-particle';
          p.style.left = `${25 + Math.random() * 50}%`;
          p.style.top = `${25 + Math.random() * 45}%`;
          p.style.setProperty('--dx', `${(Math.random() - 0.5) * 38}px`);
          particleBox.appendChild(p);
          setTimeout(() => p.remove(), 1100);
        }
      });
    });
  
    windowEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!ambientStarted) startAmbient();
      windowEl.classList.toggle('lit');
      doorFrame.classList.toggle('dimmed', !windowEl.classList.contains('lit'));
      playSwitch();
    });
  
    celestial.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!ambientStarted) startAmbient();
      document.body.classList.toggle('night');
      const isNight = document.body.classList.contains('night');
      playChime(isNight);
  
      if (isNight) {
        windowEl.classList.remove('lit');
        doorFrame.classList.add('dimmed');
      } else {
        windowEl.classList.add('lit');
        doorFrame.classList.remove('dimmed');
      }
    });
  
    doorEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!ambientStarted) startAmbient();
      doorEl.classList.toggle('open');
      playDoor(doorEl.classList.contains('open'));
    });
  
    chimneyEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!ambientStarted) startAmbient();
      smokeEl.classList.toggle('off');
      playPuff();
    });
  
    birdEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!ambientStarted) startAmbient();
      birdEl.classList.remove('jump');
      birdFx.classList.remove('animate');
      void birdEl.offsetWidth;
      const isNight = document.body.classList.contains('night');
      const notes = ['♪', '♫', '♬'];
      birdFx.textContent = isNight ? 'Zzz' : notes[Math.floor(Math.random() * notes.length)];
      birdEl.classList.add('jump');
      birdFx.classList.add('animate');
      playChirp(isNight);
    });
  
    // 3D Parallax tilt effect (Mouse & Touch)
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const handleMove = (x, y) => {
      const normX = (x / window.innerWidth - 0.5) * 2;
      const normY = (y / window.innerHeight - 0.5) * 2;
      targetX = -normX * 10;
      targetY = -normY * 10;
    };
    document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
    document.addEventListener('touchend', () => { targetX = 0; targetY = 0; });
  
    const smoothTilt = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      card.style.transform = `rotateY(${-currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg)`;
      requestAnimationFrame(smoothTilt);
    };
    smoothTilt();
  });
  