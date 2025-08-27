import React, { useRef, useEffect } from 'react';

const SpaceBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let meteors = [];
        const numMeteors = 25;
        let stars = [];
        const numStars = 50;

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
            update() { this.alpha += this.twinkleSpeed * this.twinkleDirection; if (this.alpha > 1 || this.alpha < 0.3) { this.twinkleDirection *= -1; } this.draw(); }
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
            reset() { this.x = Math.random() * (width * 1.5) - (width * 0.25); this.y = Math.random() * -100 - 10; this.speed = Math.random() * 1.5 + 1; this.length = Math.random() * 250 + 100; this.angle = Math.PI / 4; this.wobbleAngle = Math.random() * Math.PI * 2; this.wobbleFrequency = Math.random() * 0.02 + 0.01; this.wobbleAmplitude = Math.random() * 25 + 15; this.life = 1; this.fadeSpeed = Math.random() * 0.005 + 0.002; }
            update() { this.x += this.speed * Math.cos(this.angle); this.y += this.speed * Math.sin(this.angle); this.wobbleAngle += this.wobbleFrequency; this.life -= this.fadeSpeed; if (this.life <= 0 || this.x - this.length > width || this.y - this.length > height) { this.reset(); } }
            draw() { const wobbleOffset = Math.sin(this.wobbleAngle) * this.wobbleAmplitude; const wobbleX = wobbleOffset * Math.cos(this.angle - Math.PI / 2); const wobbleY = wobbleOffset * Math.sin(this.angle - Math.PI / 2); const startX = this.x + wobbleX; const startY = this.y + wobbleY; const endX = startX - this.length * Math.cos(this.angle); const endY = startY - this.length * Math.sin(this.angle); const colorPos = (this.wobbleAngle / (Math.PI)) % this.colorPalette.length; const colorIndex1 = Math.floor(colorPos); const colorIndex2 = (colorIndex1 + 1) % this.colorPalette.length; const blendFactor = colorPos - colorIndex1; const color1 = this.colorPalette[colorIndex1]; const color2 = this.colorPalette[colorIndex2]; const r = Math.floor(color1.r + (color2.r - color1.r) * blendFactor); const g = Math.floor(color1.g + (color2.g - color1.g) * blendFactor); const b = Math.floor(color1.b + (color2.b - color1.b) * blendFactor); const pulse = (Math.sin(this.wobbleAngle * 4) + 1) / 2; const alpha = this.life * (0.4 + pulse * 0.6); const gradient = ctx.createLinearGradient(startX, startY, endX, endY); gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`); gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); ctx.shadowBlur = 15; ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`; ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.strokeStyle = gradient; ctx.lineWidth = 2.5; ctx.stroke(); ctx.shadowBlur = 0; }
        }

        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            stars.forEach(s => s.update());
            meteors.forEach(m => { m.update(); m.draw(); });
            requestAnimationFrame(animate);
        }

        function init() {
            setSize();
            meteors = []; stars = [];
            for (let i = 0; i < numMeteors; i++) { meteors.push(new Meteor()); }
            for (let i = 0; i < numStars; i++) { stars.push(new Star()); }
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);
            animate();
        }

        window.addEventListener('resize', init);
        init();

        return () => {
            window.removeEventListener('resize', init);
        };
    }, []);

    return <canvas id="bg-animation-canvas" ref={canvasRef}></canvas>;
};

export default SpaceBackground;
