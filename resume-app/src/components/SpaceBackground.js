import React, { useRef, useEffect } from 'react';

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
        const targetFPS = 15;
        const frameInterval = 1000 / targetFPS;

        function setSize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        function random(min, max) { return Math.random() * (max - min) + min; }

        class Star {
            constructor() { this.x = random(0, width); this.y = random(0, height); this.radius = random(0.5, 1.5); this.alpha = random(0.3, 1); this.twinkleSpeed = random(0.01, 0.03); this.twinkleDirection = 1; }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; ctx.fill(); }
            update() { this.alpha += this.twinkleSpeed * this.twinkleDirection; if (this.alpha > 1 || this.alpha < 0.03) { this.twinkleDirection *= -1; } this.draw(); }
        }

        class Meteor {
            constructor() {
                this.colorPalette = [
                    { r: 67, g: 56, b: 202 },
                    { r: 109, g: 40, b: 217 },
                    { r: 16, g: 185, b: 129 },
                    { r: 245, g: 158, b: 11 }
                ];
                this.reset();
            }
            reset() { this.x = Math.random() * (width * 1.25) - (width * 0.5); this.y = Math.random() * -100 - 10; this.speed = Math.random() * 2 + 0.5; this.length = Math.random() * 250 + 100; this.angle = Math.random() * 0.01 - 0.005 + (width > height ? Math.PI * 3 / 4 - width / height : Math.PI / 2 - width / height); this.wobbleAngle = Math.random() * Math.PI * 2; this.wobbleFrequency = Math.random() * 0.02 + 0.01; this.wobbleAmplitude = Math.random() * 10 + 2.5; this.life = 1; this.fadeSpeed = Math.random() * 0.005 + 0.001; this.depth = random(0, 30); this.targetDepth = random(240, 1000); }
            update() { this.speed += 0.05 * this.speed * Math.pow(this.depth / this.targetDepth, 2); this.x += this.speed * Math.cos(this.angle); this.y += this.speed * Math.sin(this.angle); this.wobbleAngle += this.wobbleFrequency; this.life -= this.fadeSpeed; if (this.depth < this.targetDepth) { this.depth += 0.25 + 2.5 * Math.pow(this.depth / this.targetDepth, 2); } if (this.life <= 0 || this.x - this.length > width || this.y - this.length > height) { this.reset(); } }
            draw() { const scale = this.depth / this.targetDepth; const currentLength = 30 + this.length * scale; const wobbleOffset = Math.sin(this.wobbleAngle) * this.wobbleAmplitude; const wobbleX = wobbleOffset * Math.cos(this.angle - Math.PI / 2); const wobbleY = wobbleOffset * Math.sin(this.angle - Math.PI / 2); const startX = this.x + wobbleX; const startY = this.y + wobbleY; const endX = startX - currentLength * Math.cos(this.angle); const endY = startY - currentLength * Math.sin(this.angle); const colorPos = (this.wobbleAngle / (Math.PI)) % this.colorPalette.length; const colorIndex1 = Math.floor(colorPos); const colorIndex2 = (colorIndex1 + 1) % this.colorPalette.length; const blendFactor = colorPos - colorIndex1; const color1 = this.colorPalette[colorIndex1]; const color2 = this.colorPalette[colorIndex2]; const r = Math.floor(color1.r + (color2.r - color1.r) * blendFactor); const g = Math.floor(color1.g + (color2.g - color1.g) * blendFactor); const b = Math.floor(color1.b + (color2.b - color1.b) * blendFactor); const pulse = (Math.sin(this.wobbleAngle * 4) + 1) / 2; const alpha = (this.life < 0.1 ? this.life * (0.4 + pulse * 0.6) : 0.4 * pulse + scale * 2 * 0.6); const gradient = ctx.createLinearGradient(startX, startY, endX, endY); gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`); gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); ctx.shadowBlur = 15; ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`; ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.strokeStyle = gradient; ctx.lineWidth = 1 + (scale * 8); ctx.stroke(); ctx.shadowBlur = 0; }
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
            const numMeteors = Math.floor(width / 120) + 11;
            const numStars = Math.floor(width / 25) + 5;
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
