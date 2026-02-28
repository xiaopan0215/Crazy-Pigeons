import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LevelConfig } from '@/types';
import { useSound } from '@/hooks/useSound';
import { ParticleSystem } from '@/utils/ParticleSystem';

interface GameEngineProps {
  level: LevelConfig;
  onGameOver: (success: boolean, stars: number) => void;
  onUpdateAmmo: (remaining: number) => void;
  onUpdateStars: (stars: number) => void;
  isPaused: boolean;
}

interface Projectile {
  id: string;
  angle: number; // Angle on the target (radians)
  distance: number; // Distance from center
  type: 'stuck' | 'flying';
  x?: number; // For flying projectiles
  y?: number; // For flying projectiles
  isWorm?: boolean;
}

const TARGET_RADIUS = 120; // Increased radius
const PROJECTILE_RADIUS = 12; // Radius of the corn projectile
const PIGEON_Y_OFFSET = 350; // Distance from center to pigeon
const PIGEON_IMG_URL = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Q-version%20cartoon%20pigeon%20dancing%20to%20music%2C%20dynamic%20pose%2C%20wearing%20headphones%20and%20sunglasses%2C%20happy%20expression%2C%20musical%20notes%2C%20vibrant%20colors%2C%20vector%20style%2C%20white%20background&image_size=square";

const GameEngine: React.FC<GameEngineProps> = ({ 
  level, 
  onGameOver, 
  onUpdateAmmo, 
  onUpdateStars,
  isPaused 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null); // For static target caching
  const pigeonImageRef = useRef<HTMLImageElement | null>(null); // For pigeon image
  
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [flyingProjectile, setFlyingProjectile] = useState<Projectile | null>(null);
  const [rotation, setRotation] = useState(0);
  const [remainingAmmo, setRemainingAmmo] = useState(level.initialAmmo);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  
  const stateRef = useRef({
    rotation: 0,
    projectiles: [] as Projectile[],
    flyingProjectile: null as Projectile | null,
    peckMarks: [] as { angle: number }[],
    gameState: 'playing' as 'playing' | 'won' | 'lost',
    remainingAmmo: level.initialAmmo,
    rotationSpeed: level.rotationSpeed,
    particleSystem: new ParticleSystem(200),
    lastTime: 0,
    shake: 0,
    // Combo & Floating Text
    combo: 0,
    lastHitTime: 0,
    misses: 0, // Track misses
    floatingTexts: [] as { id: string, x: number, y: number, text: string, life: number, color: string }[],
    // Hit Effects (Rings/Pops)
    hitEffects: [] as { x: number, y: number, radius: number, life: number, color: string, width: number }[],
    // Background Feathers
    feathers: [] as { x: number, y: number, vx: number, vy: number, rotation: number, rotationSpeed: number }[]
  });

  // Load Pigeon Image
  useEffect(() => {
    const img = new Image();
    img.src = PIGEON_IMG_URL;
    img.onload = () => {
        pigeonImageRef.current = img;
    };
  }, []);

  // Initialize level
  useEffect(() => {
    // Generate initial seeds and worms on the target
    const initialItems: Projectile[] = [];
    // Use level config for item count if possible, or fallback
    const itemCount = level.targetProjectiles || (8 + level.id); 
    
    for (let i = 0; i < itemCount; i++) {
        const angle = (Math.PI * 2 * i) / itemCount;
        // Worm chance based on difficulty
        let wormChance = 0.1; // Easy default
        if (level.difficulty === 'normal') wormChance = 0.2;
        if (level.difficulty === 'hard') wormChance = 0.3;
        
        // Ensure first few items are not worms to prevent instant loss on start?
        // Randomly decide
        const isWorm = Math.random() < wormChance; 
        
        initialItems.push({
            id: `item-${i}`,
            angle: angle,
            distance: TARGET_RADIUS,
            type: 'stuck',
            isWorm: isWorm
        });
    }

    // Calculate total seeds to win
    const totalSeeds = initialItems.filter(i => !i.isWorm).length;
    
    // Ensure at least one seed exists, otherwise re-gen or just swap one worm
    if (totalSeeds === 0 && initialItems.length > 0) {
        initialItems[0].isWorm = false;
    }

    // Init Feathers
    const initialFeathers = Array.from({ length: 10 }).map(() => ({
        x: Math.random() * 400,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
    }));

    stateRef.current = {
      rotation: 0,
      projectiles: initialItems, 
      flyingProjectile: null,
      peckMarks: [], 
      gameState: 'playing',
      particleSystem: stateRef.current.particleSystem, // Keep existing instance
      remainingAmmo: totalSeeds, 
      rotationSpeed: level.rotationSpeed,
      lastTime: performance.now(),
      shake: 0,
      combo: 0,
      lastHitTime: 0,
      misses: 0,
      floatingTexts: [],
      hitEffects: [],
      feathers: initialFeathers
    };
    stateRef.current.particleSystem.reset(); // Reset particles
    
    setProjectiles(initialItems);
    setFlyingProjectile(null);
    setRotation(0);
    setRemainingAmmo(totalSeeds);
    setGameState('playing');
    onUpdateAmmo(totalSeeds);
    onUpdateStars(0);
  }, [level]);

  // Sound effects helper
  const { playSound } = useSound();

  const [isShooting, setIsShooting] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  const handleShoot = useCallback(() => {
    if (stateRef.current.gameState !== 'playing' || isPaused || stateRef.current.flyingProjectile) return;
    
    // Create the flying pigeon projectile (Dash)
    const pigeonDash: Projectile = {
        id: 'pigeon-dash',
        angle: 0,
        distance: PIGEON_Y_OFFSET,
        type: 'flying',
        x: 0,
        y: PIGEON_Y_OFFSET
    };
    
    stateRef.current.flyingProjectile = pigeonDash;
    
    setIsFlying(true);
    setIsShooting(true);
    
    // Play dash sound (pop)
    playSound('pop');
  }, [isPaused, playSound]);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize Offscreen Canvas for caching target base
    if (!offscreenCanvasRef.current) {
        const osc = document.createElement('canvas');
        osc.width = 300; // Enough for target
        osc.height = 300;
        offscreenCanvasRef.current = osc;
    }

    const renderTargetBase = () => {
        const osc = offscreenCanvasRef.current;
        if (!osc) return;
        const osCtx = osc.getContext('2d');
        if (!osCtx) return;
        
        osCtx.clearRect(0, 0, osc.width, osc.height);
        osCtx.save();
        osCtx.translate(osc.width/2, osc.height/2);
        
        // Draw Petals (Simplified) with Gradient
        const petalCount = 12;
        for (let i = 0; i < petalCount; i++) {
            osCtx.save();
            osCtx.rotate((i * Math.PI * 2) / petalCount);
            
            // Gradient for petals
            const gradient = osCtx.createLinearGradient(0, -TARGET_RADIUS - 10, 0, -TARGET_RADIUS + 20);
            gradient.addColorStop(0, '#FFB300');
            gradient.addColorStop(1, '#FF8F00');
            osCtx.fillStyle = gradient;
            
            osCtx.beginPath();
            osCtx.ellipse(0, -TARGET_RADIUS - 10, 20, 30, 0, 0, Math.PI * 2);
            osCtx.fill();
            osCtx.restore();
        }

        // Draw Center with Radial Gradient
        const centerGradient = osCtx.createRadialGradient(0, 0, 10, 0, 0, TARGET_RADIUS);
        centerGradient.addColorStop(0, '#FFEB3B'); // Bright center
        centerGradient.addColorStop(1, '#FFCA28'); // Darker edge
        
        osCtx.beginPath();
        osCtx.arc(0, 0, TARGET_RADIUS, 0, Math.PI * 2);
        osCtx.fillStyle = centerGradient;
        osCtx.fill();
        
        // Draw Inner Circle Detail
        osCtx.beginPath();
        osCtx.arc(0, 0, TARGET_RADIUS - 10, 0, Math.PI * 2);
        osCtx.fillStyle = 'rgba(255, 143, 0, 0.3)';
        osCtx.fill();
        
        osCtx.restore();
    };
    
    // Initial render of static parts
    renderTargetBase();

    let animationFrameId: number;

    const render = (time: number) => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      const deltaTime = time - stateRef.current.lastTime;
      stateRef.current.lastTime = time;

      // Update Feathers
      stateRef.current.feathers.forEach(f => {
        f.y += f.vy;
        f.x += Math.sin(time / 1000 + f.y / 100) * 0.5; // Sway
        f.rotation += f.rotationSpeed;
        
        if (f.y > canvas.height) {
            f.y = -20;
            f.x = Math.random() * canvas.width;
        }
      });
      
      // Update Floating Texts
      stateRef.current.floatingTexts.forEach(t => {
          t.y -= 1; // Float up
          t.life -= 0.02;
      });
      stateRef.current.floatingTexts = stateRef.current.floatingTexts.filter(t => t.life > 0);

      // Update Hit Effects
      stateRef.current.hitEffects.forEach(h => {
          h.radius += 1.5;
          h.life -= 0.05;
          h.width *= 0.9;
      });
      stateRef.current.hitEffects = stateRef.current.hitEffects.filter(h => h.life > 0);

      // Update Rotation
      // Simple variation logic: change speed periodically if enabled
      let currentRotationSpeed = stateRef.current.rotationSpeed;
      if (level.speedVariation) {
        // Vary speed using sine wave based on time
        const variation = Math.sin(time / 1000) * 0.02;
        currentRotationSpeed = Math.max(0.01, currentRotationSpeed + variation);
      }
      
      stateRef.current.rotation += currentRotationSpeed * level.rotationDirection; 
      // Normalize rotation
      if (stateRef.current.rotation >= Math.PI * 2) stateRef.current.rotation -= Math.PI * 2;
      if (stateRef.current.rotation < 0) stateRef.current.rotation += Math.PI * 2;

      // Update Particles
      stateRef.current.particleSystem.update();

      // Update Flying Projectile (Pigeon Dash)
      if (stateRef.current.flyingProjectile) {
        const speed = 12; // Speed
        stateRef.current.flyingProjectile.y! -= speed;
        stateRef.current.flyingProjectile.distance = stateRef.current.flyingProjectile.y!;
        
        // Add Motion Trail Particle
        if (time % 2 === 0) { // Add trail every other frame
            stateRef.current.particleSystem.spawn(
                canvas.width / 2,
                canvas.height / 2 - 100 + stateRef.current.flyingProjectile.y! + 30, // Lower trail
                'rgba(255, 255, 255, 0.4)',
                1,
                2
            );
        }

        // Check Collision with Target (Eating Range)
        if (stateRef.current.flyingProjectile.distance <= TARGET_RADIUS + 20) {
           // Calculate hit angle
           const hitAngle = -stateRef.current.rotation;
           const normalizedHitAngle = (hitAngle + Math.PI * 4) % (Math.PI * 2);

           // Check what we hit
           let hitItemIndex = -1;
           const hit = stateRef.current.projectiles.some((p, index) => {
             const angleDiff = Math.abs(p.angle - normalizedHitAngle);
             const minAngle = (2 * PROJECTILE_RADIUS) / TARGET_RADIUS * 2; // Wider acceptance for eating
             const diff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
             if (diff < minAngle) {
                 hitItemIndex = index;
                 return true;
             }
             return false;
           });

           if (hit) {
               const item = stateRef.current.projectiles[hitItemIndex];
               
               if (item.isWorm) {
                   // Ate a worm! Game Over.
                   stateRef.current.gameState = 'lost';
                   setGameState('lost');
                   playSound('lose');
                   if (navigator.vibrate) navigator.vibrate(500);
                   onGameOver(false, 0);
               } else {
                   // Ate a seed!
                   
                   // Combo Logic
                   const now = performance.now();
                   if (now - stateRef.current.lastHitTime < 1500) {
                       stateRef.current.combo++;
                   } else {
                       stateRef.current.combo = 1;
                   }
                   stateRef.current.lastHitTime = now;
                   
                   // Floating Text
                   let text = "+1";
                   let color = "#FFF";
                   if (stateRef.current.combo > 1) {
                       text = `Combo x${stateRef.current.combo}!`;
                       color = "#FFD700"; // Gold
                   }
                   
                   stateRef.current.floatingTexts.push({
                       id: Math.random().toString(),
                       x: canvas.width / 2,
                       y: canvas.height / 2 - 100 + TARGET_RADIUS,
                       text: text,
                       life: 1.0,
                       color: color
                   });

                   // Hit Effect (Pop)
                   stateRef.current.hitEffects.push({
                       x: canvas.width / 2,
                       y: canvas.height / 2 - 100 + TARGET_RADIUS,
                       radius: 20,
                       life: 1.0,
                       color: '#FFD700',
                       width: 5
                   });

                   // Add peck mark at the location of the seed
                   stateRef.current.peckMarks.push({
                       angle: item.angle
                   });

                   // Remove the seed
                   stateRef.current.projectiles.splice(hitItemIndex, 1);
                   stateRef.current.remainingAmmo--; // Decrement seeds left
                   setRemainingAmmo(stateRef.current.remainingAmmo);
                   onUpdateAmmo(stateRef.current.remainingAmmo);
                   
                   playSound('hit'); // Eating sound
                   if (navigator.vibrate) navigator.vibrate(50);
                   
                   // Particle effect for eating (Crumbs)
                   // Shells (Brown)
                   stateRef.current.particleSystem.spawn(
                       canvas.width / 2,
                       canvas.height / 2 - 100 + TARGET_RADIUS,
                       '#3E2723', // Dark Brown
                       5,
                       8
                   );
                   // Kernel (Light)
                   stateRef.current.particleSystem.spawn(
                       canvas.width / 2,
                       canvas.height / 2 - 100 + TARGET_RADIUS,
                       '#FFECB3', // Light Yellow
                       5,
                       8
                   );

                   // Return pigeon to start immediately (bounce back)
                   stateRef.current.flyingProjectile = null;
                   
                   // Ensure static pigeon reappears
                   setTimeout(() => {
                       setIsFlying(false);
                       setIsShooting(false);
                   }, 50); 
                   
                   // Check Win
                   if (stateRef.current.remainingAmmo === 0) {
                       stateRef.current.gameState = 'won';
                       setGameState('won');
                       playSound('win');
                       
                       // Calculate Stars based on misses
                       const misses = stateRef.current.misses;
                       let stars = 3;
                       if (misses > 0) stars = 2;
                       if (misses > 2) stars = 1;
                       
                       // Create Confetti
                       stateRef.current.particleSystem.spawn(canvas.width / 2, canvas.height / 2, '#FFD700', 15, 15);
                       stateRef.current.particleSystem.spawn(canvas.width / 2, canvas.height / 2, '#FF4081', 15, 15);
                       stateRef.current.particleSystem.spawn(canvas.width / 2, canvas.height / 2, '#00B0FF', 15, 15);
                       stateRef.current.particleSystem.spawn(canvas.width / 2, canvas.height / 2, '#76FF03', 15, 15);

                       onGameOver(true, stars);
                   }
               }
           } else {
               // Missed everything (hit empty space on target)
               // Increment misses
               stateRef.current.misses++;
               
               // Break combo
               stateRef.current.combo = 0;
               
               // Feedback "Miss"
               stateRef.current.floatingTexts.push({
                   id: Math.random().toString(),
                   x: canvas.width / 2,
                   y: canvas.height / 2 - 120, // Slightly higher
                   text: "Miss!",
                   life: 0.8,
                   color: "#E57373" // Red
               });
               
               // Just return to start
               stateRef.current.flyingProjectile = null;
               
               setTimeout(() => {
                   setIsFlying(false);
                   setIsShooting(false);
               }, 50);
           }
        }
      }

      // Update Shake
      if (stateRef.current.shake > 0) {
        stateRef.current.shake *= 0.9; // Decay shake
        if (stateRef.current.shake < 0.5) stateRef.current.shake = 0;
      }

      // Handle Resize / Retina Display
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shakeX = (Math.random() - 0.5) * stateRef.current.shake;
      const shakeY = (Math.random() - 0.5) * stateRef.current.shake;

      // Draw Feathers (Background)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      stateRef.current.feathers.forEach(f => {
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate(f.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, 3, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
      });

      // Save context for rotation
      ctx.save();
      ctx.translate(canvas.width / 2 + shakeX, canvas.height / 2 - 100 + shakeY); // Shift target up a bit
      
      // Draw Target (Sunflower)
      ctx.save();
      ctx.rotate(stateRef.current.rotation);
      
      // Draw Cached Static Target Base
      if (offscreenCanvasRef.current) {
          ctx.drawImage(offscreenCanvasRef.current, -150, -150); // Centered (300x300 canvas)
      }

      // Draw Peck Marks (Craters)
      stateRef.current.peckMarks.forEach(mark => {
        ctx.save();
        ctx.rotate(mark.angle);
        ctx.translate(0, TARGET_RADIUS);
        
        // Crater style
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Dark hole
        ctx.fill();
        
        // Inner depth
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Deeper hole
        ctx.fill();
        
        ctx.restore();
      });
      
      // Draw Target Items (Seeds and Worms)
      stateRef.current.projectiles.forEach((p, index) => {
        ctx.save();
        ctx.rotate(p.angle);
        ctx.translate(0, TARGET_RADIUS);

        if (p.isWorm) {
            // Draw Worm
            const wiggle = Math.sin(time / 200 + index) * 2; // Wiggle effect
            ctx.save();
            ctx.translate(wiggle, 0);

            ctx.fillStyle = '#8D6E63'; // Brown/Reddish
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            // Worm eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(-3, -3, 3, 0, Math.PI * 2);
            ctx.arc(3, -3, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(-3, -3, 1, 0, Math.PI * 2);
            ctx.arc(3, -3, 1, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        } else {
            // Draw Seed (Sunflower Seed)
            ctx.fillStyle = '#3E2723'; // Dark shell
            ctx.beginPath();
            ctx.ellipse(0, 0, 6, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            // Stripe
            ctx.strokeStyle = '#D7CCC8';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(0, 10);
            ctx.stroke();
        }
        ctx.restore();
      });

      ctx.restore(); // Restore rotation

      ctx.restore(); // Restore translation

      // Draw Hit Effects
      stateRef.current.hitEffects.forEach(h => {
          ctx.save();
          ctx.globalAlpha = h.life;
          ctx.strokeStyle = h.color;
          ctx.lineWidth = h.width;
          ctx.beginPath();
          ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
      });

      // Draw Flying Projectile (Pigeon Dash)
      if (stateRef.current.flyingProjectile) {
         const p = stateRef.current.flyingProjectile;
         ctx.save();
         
         const drawX = canvas.width / 2;
         const drawY = canvas.height / 2 - 100 + p.y!; 
         
         ctx.translate(drawX, drawY); 
         ctx.scale(1.5, 1.5); // Increase size by 50%
         
         if (pigeonImageRef.current && pigeonImageRef.current.complete) {
             // Draw Image in Circle
             ctx.beginPath();
             ctx.arc(0, 0, 25, 0, Math.PI * 2);
             ctx.clip();
             // Image is square, draw centered
             ctx.drawImage(pigeonImageRef.current, -25, -25, 50, 50);
             
             // Optional: Add border
             ctx.strokeStyle = 'white';
             ctx.lineWidth = 2;
             ctx.stroke();
         } else {
             // Fallback: Simplified shapes if image not loaded
             ctx.fillStyle = '#607D8B';
             ctx.beginPath();
             ctx.ellipse(0, 0, 15, 25, 0, 0, Math.PI * 2);
             ctx.fill();
             ctx.fillStyle = '#FF9800';
             ctx.beginPath();
             ctx.moveTo(-3, -25);
             ctx.lineTo(3, -25);
             ctx.lineTo(0, -32);
             ctx.fill();
         }
         
         ctx.restore();
      }

      // Draw Particles
      stateRef.current.particleSystem.draw(ctx);
      
      // Draw Floating Texts
      stateRef.current.floatingTexts.forEach(t => {
          ctx.save();
          ctx.globalAlpha = t.life;
          ctx.fillStyle = t.color;
          ctx.font = "bold 20px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(t.text, t.x, t.y);
          ctx.restore();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [level, isPaused, onGameOver]);

  // Wiggle state for idle pigeon
  const [idleOffset, setIdleOffset] = useState(0);
  const stateRefIdle = useRef({
      idleOffset: 0
  });
  
  useEffect(() => {
    let frameId: number;
    const animate = (time: number) => {
      const offset = Math.sin(time / 500) * 5;
      setIdleOffset(offset); // Update React state for CSS transform
      stateRefIdle.current.idleOffset = offset; // Update ref for Canvas if needed
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="w-full h-full relative" onClick={handleShoot}>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={800} 
        className="w-full h-full block touch-none"
      />
      {/* Pigeon Overlay */}
      <div 
        className={`absolute bottom-[10%] left-1/2 pointer-events-none transition-opacity duration-100 ${isFlying ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
            transform: `translate(-50%, ${idleOffset}px) ${isShooting ? 'scale(0.9)' : 'scale(1)'}`,
            transition: 'transform 0.1s, opacity 0.1s'
        }}
      >
         <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white relative">
             <img 
                src={PIGEON_IMG_URL}
                alt="Pigeon"
                className="w-full h-full object-cover"
             />
         </div>
      </div>
    </div>
  );
};

export default GameEngine;
