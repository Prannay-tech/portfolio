// Milky Way Galaxy Data Background
console.log('Milky Way galaxy background script loading...');
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing galaxy background...');
  const canvas = document.getElementById('bg-canvas');
  
  if (!canvas) {
    console.error('Canvas element with id "bg-canvas" not found');
    return;
  }
  console.log('Canvas found, setting up galaxy background...');
  
  const ctx = canvas.getContext('2d');

  // Set canvas to fixed position and full document size
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'auto';
  canvas.style.display = 'block';

  function getDocumentHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
      window.innerHeight
    );
  }

  let width = window.innerWidth;
  let height = getDocumentHeight();
  canvas.width = width;
  canvas.height = height;
  canvas.style.height = height + 'px';

  // Galaxy colors - Milky Way inspired
  const colors = {
    star: 'rgba(255, 255, 255, 0.9)',
    nebula: 'rgba(147, 51, 234, 0.6)',
    cluster: 'rgba(59, 130, 246, 0.7)',
    cosmic: 'rgba(20, 184, 166, 0.8)',
    stellar: 'rgba(249, 115, 22, 0.7)',
    galactic: 'rgba(239, 68, 68, 0.6)'
  };

  let time = 0;
  let stars = [];
  let clusters = [];
  let cosmicStructures = [];
  let mouseX = 0;
  let mouseY = 0;
  let isMouseDown = false;

  // Star Class (Data Points)
  class Star {
    constructor(x, y, brightness, color) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.brightness = brightness;
      this.color = color;
      this.size = 1 + brightness * 0.1;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.2 + Math.random() * 0.3;
      this.twinkle = 0;
      this.isHovered = false;
    }

    update() {
      // Gentle floating motion
      this.x = this.baseX + Math.cos(time * 0.0003 * this.speed + this.angle) * 10;
      this.y = this.baseY + Math.sin(time * 0.0004 * this.speed + this.angle) * 8;
      
      // Twinkling effect
      this.twinkle = Math.sin(time * 0.01 + this.angle) * 0.3 + 0.7;
      
      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      this.isHovered = dist < 25;
    }

    draw() {
      ctx.save();
      
      // Glow effect when hovered
      if (this.isHovered) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
      }
      
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.brightness * this.twinkle;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.twinkle, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }

  // Data Cluster Class (Nebula-like structures)
  class DataCluster {
    constructor(x, y, size, color) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.size = size;
      this.color = color;
      this.points = [];
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.1 + Math.random() * 0.2;
      this.pulse = 0;
      this.isHovered = false;
      
      // Generate cluster points - increased density
      const pointCount = Math.floor(size / 5);
      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2 + Math.random() * 0.5;
        const distance = Math.random() * size * 0.6;
        this.points.push({
          x: this.x + Math.cos(angle) * distance,
          y: this.y + Math.sin(angle) * distance,
          baseX: this.x + Math.cos(angle) * distance,
          baseY: this.y + Math.sin(angle) * distance,
          size: 1 + Math.random() * 3,
          angle: angle,
          speed: 0.3 + Math.random() * 0.4
        });
      }
    }

    update() {
      // Cluster movement
      this.x = this.baseX + Math.cos(time * 0.0002 * this.speed + this.angle) * 25;
      this.y = this.baseY + Math.sin(time * 0.0003 * this.speed + this.angle) * 20;
      
      // Pulse animation
      this.pulse = Math.sin(time * 0.005 + this.angle) * 0.2 + 0.8;
      
      // Update points
      for (let point of this.points) {
        const baseOffsetX = Math.cos(time * 0.0004 * point.speed + point.angle) * 5;
        const baseOffsetY = Math.sin(time * 0.0005 * point.speed + point.angle) * 5;
        
        point.x = point.baseX + baseOffsetX;
        point.y = point.baseY + baseOffsetY;
      }
      
      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      this.isHovered = dist < this.size;
    }

    draw() {
      ctx.save();
      
      if (this.isHovered) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 30;
      }
      
      // Draw cluster center glow
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.4 * this.pulse;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5 * this.pulse, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw cluster points
      for (let point of this.points) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.9 * this.pulse;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * this.pulse, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }

  // Cosmic Structure Class (Dynamic line graphs)
  class CosmicStructure {
    constructor(x, y, complexity, color) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.complexity = complexity;
      this.color = color;
      this.points = [];
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.15 + Math.random() * 0.25;
      this.animation = 0;
      this.isHovered = false;
      
      // Generate cosmic structure points
      for (let i = 0; i < complexity; i++) {
        const angle = (i / complexity) * Math.PI * 2;
        const radius = 30 + Math.sin(angle * 3) * 15;
        this.points.push({
          x: this.x + Math.cos(angle) * radius,
          y: this.y + Math.sin(angle) * radius,
          baseX: this.x + Math.cos(angle) * radius,
          baseY: this.y + Math.sin(angle) * radius,
          angle: angle,
          speed: 0.2 + Math.random() * 0.3
        });
      }
    }

    update() {
      this.animation += 0.01;
      if (this.animation > 1) this.animation = 1;
      
      // Structure movement
      this.x = this.baseX + Math.cos(time * 0.0002 * this.speed + this.angle) * 20;
      this.y = this.baseY + Math.sin(time * 0.0003 * this.speed + this.angle) * 15;
      
      // Update points with wave motion
      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        const waveOffset = Math.sin(time * 0.002 + i * 0.5) * 8;
        const baseOffsetX = Math.cos(time * 0.0003 * point.speed + point.angle) * 3;
        const baseOffsetY = Math.sin(time * 0.0004 * point.speed + point.angle) * 3;
        
        point.x = point.baseX + baseOffsetX + waveOffset;
        point.y = point.baseY + baseOffsetY + waveOffset;
      }
      
      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      this.isHovered = dist < 60;
    }

    draw() {
      ctx.save();
      
      if (this.isHovered) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 25;
      }
      
      // Draw connecting lines
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7 * this.animation;
      ctx.beginPath();
      
      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      
      // Close the structure
      if (this.points.length > 2) {
        ctx.lineTo(this.points[0].x, this.points[0].y);
      }
      
      ctx.stroke();
      
      // Draw structure points
      for (let point of this.points) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.9 * this.animation;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }

  function initGalaxy() {
    stars = [];
    clusters = [];
    cosmicStructures = [];
    
    // Create stars (data points) - significantly increased density
    const starCount = Math.max(120, Math.floor(height / 40));
    const starColors = [colors.star, colors.nebula, colors.cosmic, colors.stellar];
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const brightness = 0.3 + Math.random() * 0.7;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      stars.push(new Star(x, y, brightness, color));
    }
    
    // Create data clusters (nebula-like) - significantly increased density
    const clusterCount = Math.max(20, Math.floor(height / 200));
    const clusterColors = [colors.cluster, colors.nebula, colors.cosmic, colors.galactic];
    
    for (let i = 0; i < clusterCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 25 + Math.random() * 60;
      const color = clusterColors[Math.floor(Math.random() * clusterColors.length)];
      clusters.push(new DataCluster(x, y, size, color));
    }
    
    // Create cosmic structures (dynamic line graphs) - significantly increased density
    const structureCount = Math.max(15, Math.floor(height / 250));
    const structureColors = [colors.cosmic, colors.stellar, colors.galactic, colors.nebula];
    
    for (let i = 0; i < structureCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const complexity = 5 + Math.floor(Math.random() * 10);
      const color = structureColors[Math.floor(Math.random() * structureColors.length)];
      cosmicStructures.push(new CosmicStructure(x, y, complexity, color));
    }
  }

  function drawGalaxy() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw deep space gradient
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
    gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.1)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw cosmic structures
    cosmicStructures.forEach(structure => {
      structure.update();
      structure.draw();
    });
    
    // Draw data clusters
    clusters.forEach(cluster => {
      cluster.update();
      cluster.draw();
    });
    
    // Draw stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });
  }

  function render() {
    time += 1;
    drawGalaxy();
    requestAnimationFrame(render);
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = getDocumentHeight();
    canvas.width = width;
    canvas.height = height;
    canvas.style.height = height + 'px';
    initGalaxy();
  }

  // Mouse event handlers with improved detection
  canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mousedown', function(e) {
    console.log('Canvas clicked!');
    isMouseDown = true;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Create new star on click
    const brightness = 0.5 + Math.random() * 0.5;
    const starColors = [colors.star, colors.nebula, colors.cosmic, colors.stellar];
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    stars.push(new Star(mouseX, mouseY, brightness, color));
    
    // Create ripple effect
    createRipple(mouseX, mouseY);
  });

  canvas.addEventListener('mouseup', function() {
    isMouseDown = false;
  });

  // Ripple effect function
  function createRipple(x, y) {
    const ripple = {
      x: x,
      y: y,
      radius: 0,
      maxRadius: 50,
      opacity: 1,
      speed: 3
    };
    
    function animateRipple() {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      
      ripple.radius += ripple.speed;
      ripple.opacity -= 0.02;
      
      if (ripple.opacity > 0) {
        requestAnimationFrame(animateRipple);
      }
    }
    
    animateRipple();
  }

  // Window event handlers
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', function() {
    const newHeight = getDocumentHeight();
    if (newHeight !== height) {
      height = newHeight;
      canvas.height = height;
      canvas.style.height = height + 'px';
    }
  });

  initGalaxy();
  render();
  console.log('Milky Way galaxy background initialized successfully with enhanced interactivity!');
}); 