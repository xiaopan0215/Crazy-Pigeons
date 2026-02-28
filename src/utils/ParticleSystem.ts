export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  active: boolean;
}

export class ParticleSystem {
  private particles: Particle[];
  private poolSize: number;
  private activeCount: number;

  constructor(size: number = 200) {
    this.poolSize = size;
    this.activeCount = 0;
    this.particles = [];
    
    // Initialize pool
    for (let i = 0; i < size; i++) {
      this.particles.push({
        x: 0, y: 0, vx: 0, vy: 0, life: 0, color: '#FFF', size: 0, active: false
      });
    }
  }

  spawn(x: number, y: number, color: string, count: number = 5, speed: number = 5) {
    let spawned = 0;
    for (let i = 0; i < this.poolSize; i++) {
      if (spawned >= count) break;
      
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.x = x;
        p.y = y;
        p.vx = (Math.random() - 0.5) * speed;
        p.vy = (Math.random() - 0.5) * speed;
        p.life = 1.0;
        p.color = color;
        p.size = Math.random() * 4 + 2;
        spawned++;
      }
    }
  }

  update() {
    for (let i = 0; i < this.poolSize; i++) {
      const p = this.particles[i];
      if (p.active) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // Gravity
        p.life -= 0.05;
        
        if (p.life <= 0) {
          p.active = false;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.poolSize; i++) {
      const p = this.particles[i];
      if (p.active) {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
  
  reset() {
      for(let i=0; i<this.poolSize; i++) {
          this.particles[i].active = false;
      }
  }
}
