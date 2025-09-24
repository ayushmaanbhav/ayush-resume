import React, { useRef, useEffect } from 'react';

// Configuration constants - centralized for maintainability
const CONFIG = {
    // Animation settings
    TARGET_FPS: 18,
    FRAME_INTERVAL: 1000 / 18,

    // Particle pool sizes
    TAIL_PARTICLE_POOL_SIZE: 30,
    SPARKLE_PARTICLE_POOL_SIZE: 30,
    CHILD_METEORITE_POOL_SIZE: 30,

    // Child meteorite settings
    MAX_CHILD_METEORITES: 8,
    CHILD_METEORITE_SPAWN_CHANCE: 0.4,
    CHILD_METEORITE_DISTANCE_RANGE: { min: 3, max: 8 },
    CHILD_METEORITE_SIZE_RANGE: { min: 1.5, max: 4.0 },
    CHILD_METEORITE_LIFE_RANGE: { min: 0.5, max: 1.5 },
    CHILD_METEORITE_GRAVITY: 0.03,
    CHILD_METEORITE_FRICTION: 0.96,
    CHILD_METEORITE_ORBIT_SPEED_RANGE: { min: 0.005, max: 0.015 },

    // Sparkle particle settings
    SPARKLE_SPAWN_CHANCE: 0.35,
    SPARKLE_SIZE_RANGE: { min: 0.8, max: 2.5 },
    SPARKLE_LIFE_RANGE: { min: 0.1, max: 0.3 },
    SPARKLE_GRAVITY: 0.01,
    SPARKLE_FRICTION: 0.92,
    SPARKLE_SHADOW_BLUR: 8,

    // Tail particle settings
    TAIL_SPAWN_CHANCE: 0.3,
    TAIL_SIZE_RANGE: { min: 0.5, max: 2 },
    TAIL_LIFE_RANGE: { min: 0.3, max: 0.8 },
    TAIL_GRAVITY: 0.02,
    TAIL_FRICTION: 0.95,
    TAIL_ALPHA: 0.6,

    // Meteor settings
    METEOR_COUNT_BASE: 15,
    METEOR_COUNT_MULTIPLIER: 90,
    STAR_COUNT_BASE: 5,
    STAR_COUNT_MULTIPLIER: 25,

    // Physics settings
    TRAIL_OFFSET: 15,
    CHILD_METEORITE_ANGLE_VARIATION: 0.3,
    CHILD_METEORITE_SPEED_MULTIPLIER: { min: 0.3, max: 0.8 },

    // Visual settings
    CHILD_METEORITE_SHADOW_BLUR: 12,
    METEOR_SHADOW_BLUR: 15,
    STAR_SIZE_RANGE: { min: 0.5, max: 1.5 },
    STAR_ALPHA_RANGE: { min: 0.3, max: 1 },
    STAR_TWINKLE_SPEED_RANGE: { min: 0.01, max: 0.03 }
};

const SpaceBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let meteors = [];
        let stars = [];
        let animationFrameId;
        let lastTimestamp = 0;
        const frameInterval = CONFIG.FRAME_INTERVAL;

        function setSize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        function random(min, max) { return Math.random() * (max - min) + min; }

        class Star {
            constructor() {
                this.x = random(0, width);
                this.y = random(0, height);
                this.radius = random(CONFIG.STAR_SIZE_RANGE.min, CONFIG.STAR_SIZE_RANGE.max);
                this.alpha = random(CONFIG.STAR_ALPHA_RANGE.min, CONFIG.STAR_ALPHA_RANGE.max);
                this.twinkleSpeed = random(CONFIG.STAR_TWINKLE_SPEED_RANGE.min, CONFIG.STAR_TWINKLE_SPEED_RANGE.max);
                this.twinkleDirection = 1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
            update() {
                this.alpha += this.twinkleSpeed * this.twinkleDirection;
                if (this.alpha > 1 || this.alpha < 0.03) {
                    this.twinkleDirection *= -1;
                }
                this.draw();
            }
        }

        // Object Pool for particle reuse - Performance optimization
        class ParticlePool {
            constructor(particleClass, initialSize = 50) {
                this.particleClass = particleClass;
                this.pool = [];
                this.active = new Set();
                this.expandPool(initialSize);
            }

            expandPool(size) {
                for (let i = 0; i < size; i++) {
                    this.pool.push(new this.particleClass());
                }
            }

            get() {
                let particle = this.pool.pop();
                if (!particle) {
                    particle = new this.particleClass();
                    this.expandPool(10);
                }
                this.active.add(particle);
                return particle;
            }

            release(particle) {
                if (this.active.has(particle)) {
                    this.active.delete(particle);
                    this.pool.push(particle);
                }
            }

            update() {
                this.active.forEach(particle => {
                    if (particle.update()) {
                        this.release(particle);
                    }
                });
            }

            draw() {
                this.active.forEach(particle => particle.draw());
            }
        }

        // Base Particle class
        class Particle {
            constructor() {
                this.x = 0;
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.life = 1;
                this.maxLife = 1;
                this.size = 1;
                this.color = { r: 255, g: 255, b: 255 };
                this.alpha = 1;
                this.gravity = 0;
                this.friction = 0.98;
            }

            update() {
                this.vy += this.gravity;
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.02;
                return this.life <= 0;
            }

            draw() {
                const alpha = this.life * this.alpha;
                if (alpha <= 0) return;

                ctx.globalAlpha = alpha;
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // Tail particle for meteor trails - Physics-based animation
        class TailParticle extends Particle {
            constructor() {
                super();
                this.maxLife = random(CONFIG.TAIL_LIFE_RANGE.min, CONFIG.TAIL_LIFE_RANGE.max);
                this.life = this.maxLife;
                this.size = random(CONFIG.TAIL_SIZE_RANGE.min, CONFIG.TAIL_SIZE_RANGE.max);
                this.gravity = CONFIG.TAIL_GRAVITY;
                this.friction = CONFIG.TAIL_FRICTION;
            }

            update() {
                this.vy += this.gravity;
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.015;
                this.size *= 0.98;
                return this.life <= 0 || this.size < 0.1;
            }
        }

        // Sparkle particle for twinkling effects
        class SparkleParticle extends Particle {
            constructor() {
                super();
                this.maxLife = random(CONFIG.SPARKLE_LIFE_RANGE.min, CONFIG.SPARKLE_LIFE_RANGE.max);
                this.life = this.maxLife;
                this.size = random(CONFIG.SPARKLE_SIZE_RANGE.min, CONFIG.SPARKLE_SIZE_RANGE.max);
                this.twinkleSpeed = random(0.1, 0.2);
                this.twinklePhase = random(0, Math.PI * 2);
                this.gravity = CONFIG.SPARKLE_GRAVITY;
                this.friction = CONFIG.SPARKLE_FRICTION;
            }

            update() {
                this.vy += this.gravity;
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.025;
                this.twinklePhase += this.twinkleSpeed;
                return this.life <= 0;
            }

            draw() {
                const alpha = this.life * this.alpha * (0.5 + 0.5 * Math.sin(this.twinklePhase));
                if (alpha <= 0) return;

                ctx.globalAlpha = alpha;
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.shadowBlur = CONFIG.SPARKLE_SHADOW_BLUR;
                ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        }

        // Child meteorite - Tiny meteors orbiting main meteor
        class ChildMeteorite extends Particle {
            constructor(parentMeteor) {
                super();
                // Initialize with default values, will be set when spawned
                this.parentMeteor = parentMeteor || null;
                this.maxLife = random(CONFIG.CHILD_METEORITE_LIFE_RANGE.min, CONFIG.CHILD_METEORITE_LIFE_RANGE.max);
                this.life = this.maxLife;
                this.size = random(CONFIG.CHILD_METEORITE_SIZE_RANGE.min, CONFIG.CHILD_METEORITE_SIZE_RANGE.max);
                this.angle = 0; // Will be set when spawned
                this.speed = 1; // Will be set when spawned
                this.distance = random(1, 3); // Updated distance range
                this.orbitAngle = random(0, Math.PI * 2);
                this.orbitSpeed = random(CONFIG.CHILD_METEORITE_ORBIT_SPEED_RANGE.min, CONFIG.CHILD_METEORITE_ORBIT_SPEED_RANGE.max);
                this.gravity = CONFIG.CHILD_METEORITE_GRAVITY;
                this.friction = CONFIG.CHILD_METEORITE_FRICTION;
            }

            update() {
                // Only update if we have a valid parent meteor
                if (!this.parentMeteor) {
                    this.life -= 0.02;
                    return this.life <= 0;
                }

                // Calculate trailing offset - position orbital center behind the meteor
                const trailOffset = CONFIG.TRAIL_OFFSET;
                const offsetX = -Math.cos(this.parentMeteor.angle) * trailOffset;
                const offsetY = -Math.sin(this.parentMeteor.angle) * trailOffset;

                // Set orbital center position (behind the meteor)
                const orbitalCenterX = this.parentMeteor.x + offsetX;
                const orbitalCenterY = this.parentMeteor.y + offsetY;

                // Orbit around the trailing center point
                this.orbitAngle += this.orbitSpeed;
                const orbitX = Math.cos(this.orbitAngle) * this.distance;
                const orbitY = Math.sin(this.orbitAngle) * this.distance;

                this.x = orbitalCenterX + orbitX;
                this.y = orbitalCenterY + orbitY;

                // Add some independent movement
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;

                this.vy += this.gravity;
                this.vx *= this.friction;
                this.vy *= this.friction;

                this.x += this.vx;
                this.y += this.vy;

                this.life -= 0.008;
                this.size *= 0.995;
                return this.life <= 0 || this.size < 0.1;
            }

            draw() {
                const alpha = this.life * this.alpha;
                if (alpha <= 0 || !this.parentMeteor) return;

                const scale = this.parentMeteor.depth / this.parentMeteor.targetDepth;
                const currentSize = this.size * scale;

                ctx.globalAlpha = alpha;
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.shadowBlur = CONFIG.CHILD_METEORITE_SHADOW_BLUR;
                ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.3})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        }

        class Meteor {
            constructor() {
                this.colorPalette = [
                    { r: 67, g: 56, b: 202 },
                    { r: 109, g: 40, b: 217 },
                    { r: 16, g: 185, b: 129 },
                    { r: 245, g: 158, b: 11 }
                ];
                this.tailParticles = new ParticlePool(TailParticle, CONFIG.TAIL_PARTICLE_POOL_SIZE);
                this.sparkleParticles = new ParticlePool(SparkleParticle, CONFIG.SPARKLE_PARTICLE_POOL_SIZE);
                this.childMeteorites = new ParticlePool(ChildMeteorite, CONFIG.CHILD_METEORITE_POOL_SIZE);
                this.childMeteoriteCount = 0; // Track number of child meteorites for even spacing
                this.reset();
            }

            reset() {
                this.x = Math.random() * (width * 1.25) - (width * 0.5);
                this.y = Math.random() * -100 - 10;
                this.speed = Math.random() * 2 + 0.5;
                this.length = Math.random() * 250 + 100;
                this.angle = Math.random() * 0.01 - 0.005 + (- Math.PI * 3 / 2 - Math.atan(width / height));
                this.wobbleAngle = Math.random() * Math.PI * 2;
                this.wobbleFrequency = Math.random() * 0.02 + 0.01;
                this.wobbleAmplitude = Math.random() * 10 + 2.5;
                this.life = 1;
                this.fadeSpeed = Math.random() * 0.005 + 0.001;
                this.depth = random(0, 30);
                this.targetDepth = random(240, 1000);

                // Clear existing particles
                this.tailParticles = new ParticlePool(TailParticle, CONFIG.TAIL_PARTICLE_POOL_SIZE);
                this.sparkleParticles = new ParticlePool(SparkleParticle, CONFIG.SPARKLE_PARTICLE_POOL_SIZE);
                this.childMeteorites = new ParticlePool(ChildMeteorite, CONFIG.CHILD_METEORITE_POOL_SIZE);
                this.childMeteoriteCount = 0; // Reset meteorite count
            }

            update() {
                this.speed += 0.05 * this.speed * Math.pow(this.depth / this.targetDepth, 2);
                this.x += this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);
                this.wobbleAngle += this.wobbleFrequency;
                this.life -= this.fadeSpeed;
                if (this.depth < this.targetDepth) {
                    this.depth += 0.25 + 2.5 * Math.pow(this.depth / this.targetDepth, 2);
                }

                // Spawn particles
                this.spawnParticles();

                // Update particle systems
                this.tailParticles.update();
                this.sparkleParticles.update();
                this.childMeteorites.update();

                if (this.life <= 0 || this.x - this.length > width || this.y - this.length > height) {
                    this.reset();
                }
            }

            spawnParticles() {
                // Spawn tail particles occasionally
                if (Math.random() < CONFIG.TAIL_SPAWN_CHANCE) {
                    const tailParticle = this.tailParticles.get();
                    tailParticle.x = this.x;
                    tailParticle.y = this.y;
                    tailParticle.vx = -Math.cos(this.angle) * this.speed * 0.5;
                    tailParticle.vy = -Math.sin(this.angle) * this.speed * 0.5;
                    tailParticle.color = this.getCurrentColor();
                    tailParticle.alpha = CONFIG.TAIL_ALPHA;
                }

                // Spawn sparkle particles very frequently for maximum visibility
                if (Math.random() < CONFIG.SPARKLE_SPAWN_CHANCE) {
                    const sparkleParticle = this.sparkleParticles.get();
                    sparkleParticle.x = this.x + random(-3, 3);
                    sparkleParticle.y = this.y + random(-3, 3);
                    sparkleParticle.vx = random(-1, 1);
                    sparkleParticle.vy = random(-1, 1);
                    sparkleParticle.color = this.getCurrentColor();
                    sparkleParticle.alpha = 1.0; // Maximum alpha for sparkle particles
                }

                // Spawn child meteorites very frequently for maximum visibility with even angular spacing
                if (Math.random() < CONFIG.CHILD_METEORITE_SPAWN_CHANCE && this.childMeteorites.active.size < CONFIG.MAX_CHILD_METEORITES) {
                    const childMeteorite = this.childMeteorites.get();
                    // Initialize child meteorite with parent reference
                    childMeteorite.parentMeteor = this;
                    childMeteorite.angle = this.angle + random(-CONFIG.CHILD_METEORITE_ANGLE_VARIATION, CONFIG.CHILD_METEORITE_ANGLE_VARIATION);
                    childMeteorite.speed = this.speed * random(CONFIG.CHILD_METEORITE_SPEED_MULTIPLIER.min, CONFIG.CHILD_METEORITE_SPEED_MULTIPLIER.max);
                    childMeteorite.distance = random(CONFIG.CHILD_METEORITE_DISTANCE_RANGE.min, CONFIG.CHILD_METEORITE_DISTANCE_RANGE.max);
                    // Use even angular spacing based on current meteorite count
                    childMeteorite.orbitAngle = (Math.PI * 2 * this.childMeteoriteCount) / CONFIG.MAX_CHILD_METEORITES;
                    childMeteorite.orbitSpeed = random(CONFIG.CHILD_METEORITE_ORBIT_SPEED_RANGE.min, CONFIG.CHILD_METEORITE_ORBIT_SPEED_RANGE.max);
                    childMeteorite.color = this.getCurrentColor();
                    childMeteorite.alpha = 1.0; // Maximum alpha for full visibility
                    childMeteorite.maxLife = random(CONFIG.CHILD_METEORITE_LIFE_RANGE.min, CONFIG.CHILD_METEORITE_LIFE_RANGE.max);
                    childMeteorite.life = childMeteorite.maxLife;
                    // Scale size based on parent meteor scale and increase base size
                    const parentScale = this.depth / this.targetDepth;
                    childMeteorite.size = random(CONFIG.CHILD_METEORITE_SIZE_RANGE.min, CONFIG.CHILD_METEORITE_SIZE_RANGE.max) * parentScale;
                    childMeteorite.gravity = CONFIG.CHILD_METEORITE_GRAVITY;
                    childMeteorite.friction = CONFIG.CHILD_METEORITE_FRICTION;
                    this.childMeteoriteCount++; // Increment count for next even spacing
                }
            }

            getCurrentColor() {
                const colorPos = (this.wobbleAngle / (Math.PI)) % this.colorPalette.length;
                const colorIndex1 = Math.floor(colorPos);
                const colorIndex2 = (colorIndex1 + 1) % this.colorPalette.length;
                const blendFactor = colorPos - colorIndex1;
                const color1 = this.colorPalette[colorIndex1];
                const color2 = this.colorPalette[colorIndex2];
                return {
                    r: Math.floor(color1.r + (color2.r - color1.r) * blendFactor),
                    g: Math.floor(color1.g + (color2.g - color1.g) * blendFactor),
                    b: Math.floor(color1.b + (color2.b - color1.b) * blendFactor)
                };
            }

            draw() {
                const scale = this.depth / this.targetDepth;
                const currentLength = 30 + this.length * scale;
                const wobbleOffset = Math.sin(this.wobbleAngle) * this.wobbleAmplitude;
                const wobbleX = wobbleOffset * Math.cos(this.angle - Math.PI / 2);
                const wobbleY = wobbleOffset * Math.sin(this.angle - Math.PI / 2);
                const startX = this.x + wobbleX;
                const startY = this.y + wobbleY;
                const endX = startX - currentLength * Math.cos(this.angle);
                const endY = startY - currentLength * Math.sin(this.angle);
                const colorPos = (this.wobbleAngle / (Math.PI)) % this.colorPalette.length;
                const colorIndex1 = Math.floor(colorPos);
                const colorIndex2 = (colorIndex1 + 1) % this.colorPalette.length;
                const blendFactor = colorPos - colorIndex1;
                const color1 = this.colorPalette[colorIndex1];
                const color2 = this.colorPalette[colorIndex2];
                const r = Math.floor(color1.r + (color2.r - color1.r) * blendFactor);
                const g = Math.floor(color1.g + (color2.g - color1.g) * blendFactor);
                const b = Math.floor(color1.b + (color2.b - color1.b) * blendFactor);
                const pulse = (Math.sin(this.wobbleAngle * 4) + 1) / 2;
                const alpha = (this.life < 0.1 ? this.life * (0.4 + pulse * 0.6) : 0.4 * pulse + scale * 2 * 0.6);
                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.shadowBlur = CONFIG.METEOR_SHADOW_BLUR;
                ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1 + (scale * 8);
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Draw particle systems
                this.tailParticles.draw();
                this.sparkleParticles.draw();
                this.childMeteorites.draw();
            }
        }

        function animate(timestamp) {
            animationFrameId = requestAnimationFrame(animate);
            const elapsed = timestamp - lastTimestamp;
            if (elapsed < frameInterval) return;
            lastTimestamp = timestamp - (elapsed % frameInterval);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            stars.forEach(s => s.update());
            meteors.forEach(m => { m.update(); m.draw(); });
        }

        function init() {
            setSize();
            const numMeteors = Math.floor(width / CONFIG.METEOR_COUNT_MULTIPLIER) + CONFIG.METEOR_COUNT_BASE;
            const numStars = Math.floor(width / CONFIG.STAR_COUNT_MULTIPLIER) + CONFIG.STAR_COUNT_BASE;
            meteors = [];
            stars = [];
            for (let i = 0; i < numMeteors; i++) { meteors.push(new Meteor()); }
            for (let i = 0; i < numStars; i++) { stars.push(new Star()); }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            lastTimestamp = 0;
            animate(0);
        }

        function debounce(func, delay) {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        }

        const debouncedInit = debounce(init, 250);
        window.addEventListener('resize', debouncedInit);
        init();

        return () => {
            window.removeEventListener('resize', debouncedInit);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="bg-animation-canvas" ref={canvasRef}></canvas>;
};

export default SpaceBackground;
