// Dynamic Data Clusters Background
console.log('Data clusters background script loading...');
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing data clusters...');
  const canvas = document.getElementById('bg-canvas');
  
  if (!canvas) {
    console.error('Canvas element with id "bg-canvas" not found');
    return;
  }
  console.log('Canvas found, setting up data clusters...');
  
  const ctx = canvas.getContext('2d');

  // Set canvas to fixed position and full document size
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100%';
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

  // Data cluster settings
  const CLUSTER_COLORS = [
    { primary: 'rgba(255, 99, 132, 0.8)', secondary: 'rgba(255, 99, 132, 0.3)', glow: 'rgba(255, 99, 132, 0.4)' },
    { primary: 'rgba(54, 162, 235, 0.8)', secondary: 'rgba(54, 162, 235, 0.3)', glow: 'rgba(54, 162, 235, 0.4)' },
    { primary: 'rgba(255, 206, 86, 0.8)', secondary: 'rgba(255, 206, 86, 0.3)', glow: 'rgba(255, 206, 86, 0.4)' },
    { primary: 'rgba(75, 192, 192, 0.8)', secondary: 'rgba(75, 192, 192, 0.3)', glow: 'rgba(75, 192, 192, 0.4)' },
    { primary: 'rgba(153, 102, 255, 0.8)', secondary: 'rgba(153, 102, 255, 0.3)', glow: 'rgba(153, 102, 255, 0.4)' },
    { primary: 'rgba(255, 159, 64, 0.8)', secondary: 'rgba(255, 159, 64, 0.3)', glow: 'rgba(255, 159, 64, 0.4)' }
  ];

  let clusters = [];
  let mouseX = 0;
  let mouseY = 0;
  let isMouseDown = false;

  class DataCluster {
    constructor(x, y, colorIndex) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.colorIndex = colorIndex;
      this.points = [];
      this.radius = 40 + Math.random() * 60;
      this.pointCount = 8 + Math.floor(Math.random() * 12);
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.3 + Math.random() * 0.4;
      this.pulse = 0;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.connectionStrength = 0.3 + Math.random() * 0.4;
      
      // Generate points within this cluster
      for (let i = 0; i < this.pointCount; i++) {
        const angle = (i / this.pointCount) * Math.PI * 2 + Math.random() * 0.5;
        const distance = Math.random() * this.radius * 0.8;
        this.points.push({
          x: this.x + Math.cos(angle) * distance,
          y: this.y + Math.sin(angle) * distance,
          baseX: this.x + Math.cos(angle) * distance,
          baseY: this.y + Math.sin(angle) * distance,
          size: 2 + Math.random() * 4,
          angle: angle,
          speed: 0.5 + Math.random() * 0.5
        });
      }
    }

    update(time, mouseInfluence = false) {
      // Update cluster position with gentle movement
      this.x = this.baseX + Math.cos(time * 0.0003 * this.speed + this.angle) * 20;
      this.y = this.baseY + Math.sin(time * 0.0004 * this.speed + this.angle) * 15;
      
      // Pulse animation
      this.pulse = Math.sin(time * this.pulseSpeed) * 0.3 + 0.7;
      
      // Update points
      for (let point of this.points) {
        const baseOffsetX = Math.cos(time * 0.0005 * point.speed + point.angle) * 8;
        const baseOffsetY = Math.sin(time * 0.0006 * point.speed + point.angle) * 8;
        
        point.x = point.baseX + baseOffsetX;
        point.y = point.baseY + baseOffsetY;
        
        // Mouse influence
        if (mouseInfluence) {
          const dx = mouseX - point.x;
          const dy = mouseY - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (1 - dist / 150) * 25;
            point.x += (dx / dist) * force;
            point.y += (dy / dist) * force;
          }
        }
      }
    }

    draw(ctx) {
      const colors = CLUSTER_COLORS[this.colorIndex];
      
      // Draw connections between points
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      for (let i = 0; i < this.points.length; i++) {
        for (let j = i + 1; j < this.points.length; j++) {
          const p1 = this.points[i];
          const p2 = this.points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < this.radius * 1.2) {
            const opacity = (1 - dist / (this.radius * 1.2)) * this.connectionStrength;
            ctx.strokeStyle = colors.secondary.replace('0.3)', `${opacity})`);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw points
      for (let point of this.points) {
        ctx.save();
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * this.pulse, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary;
        ctx.fill();
        ctx.restore();
      }
      
      // Draw cluster center glow
      ctx.save();
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.3 * this.pulse, 0, Math.PI * 2);
      ctx.fillStyle = colors.primary.replace('0.8)', '0.2)');
      ctx.fill();
      ctx.restore();
      
      ctx.restore();
    }
  }

  function initClusters() {
    clusters = [];
    // Increase cluster count and ensure good distribution
    const clusterCount = Math.max(15, Math.floor((width * height) / 60000));
    
    for (let i = 0; i < clusterCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const colorIndex = Math.floor(Math.random() * CLUSTER_COLORS.length);
      clusters.push(new DataCluster(x, y, colorIndex));
    }
    
    console.log(`Initialized ${clusterCount} clusters across ${width}x${height} canvas`);
  }

  function drawBackground() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw clusters
    for (let cluster of clusters) {
      cluster.draw(ctx);
    }
    
    // Draw inter-cluster connections
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const c1 = clusters[i];
        const c2 = clusters[j];
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 300) {
          const opacity = (1 - dist / 300) * 0.1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
          ctx.stroke();
        }
      }
    }
    
    ctx.restore();
  }

  function render(time) {
    // Update clusters
    for (let cluster of clusters) {
      cluster.update(time, isMouseDown);
    }
    
    drawBackground();
    requestAnimationFrame(render);
  }

  function resizeCanvasAndClusters() {
    width = window.innerWidth;
    height = getDocumentHeight();
    canvas.width = width;
    canvas.height = height;
    canvas.style.height = height + 'px';
    initClusters();
  }

  // Mouse event handlers
  canvas.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  canvas.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  canvas.addEventListener('mouseup', function() {
    isMouseDown = false;
  });

  canvas.addEventListener('mouseleave', function() {
    isMouseDown = false;
  });

  // Window event handlers
  window.addEventListener('resize', resizeCanvasAndClusters);
  window.addEventListener('scroll', function() {
    // Update canvas height on scroll to ensure full coverage
    const newHeight = getDocumentHeight();
    if (newHeight !== height) {
      height = newHeight;
      canvas.height = height;
      canvas.style.height = height + 'px';
    }
  });

  initClusters();
  requestAnimationFrame(render);
  console.log('Data clusters background initialized successfully!');
}); 