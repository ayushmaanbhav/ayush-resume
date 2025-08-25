import React, { useRef, useEffect } from 'react';

const SpaceBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let stars = [];
        let asteroids = [];
        let comets = [];

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        class Star {
            constructor() {
                this.x = random(0, canvas.width);
                this.y = random(0, canvas.height);
                this.radius = random(0.5, 1.5);
                this.alpha = random(0.3, 1);
                this.twinkleSpeed = random(0.01, 0.03);
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
                if (this.alpha > 1 || this.alpha < 0.3) {
                    this.twinkleDirection *= -1;
                }
                this.draw();
            }
        }

        class Asteroid {
            constructor() {
                this.x = random(-100, canvas.width + 100);
                this.y = random(-100, canvas.height + 100);
                this.radius = random(1, 4);
                this.vx = random(-0.2, 0.2);
                this.vy = random(-0.2, 0.2);
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(150, 150, 150, 0.6)';
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
                    Object.assign(this, new Asteroid());
                }
                this.draw();
            }
        }
        
        class Comet {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = random(0, canvas.width);
                this.y = random(-200, -100);
                this.radius = random(1, 2.5);
                this.vx = random(-2, 2);
                this.vy = random(2, 4);
                this.len = random(100, 200);
                this.alpha = 1;
            }

            draw() {
                ctx.beginPath();
                const tailX = this.x - this.len * this.vx;
                const tailY = this.y - this.len * this.vy;
                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.radius;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.y > canvas.height + 200) {
                   if(Math.random() < 0.01) { // 1% chance to respawn
                       this.reset();
                   }
                }
                this.draw();
            }
        }


        function initSpace() {
            stars = [];
            asteroids = [];
            comets = [];
            for (let i = 0; i < 200; i++) stars.push(new Star());
            for (let i = 0; i < 20; i++) asteroids.push(new Asteroid());
            for (let i = 0; i < 5; i++) comets.push(new Comet());
        }

        function animateSpace() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => s.update());
            asteroids.forEach(a => a.update());
            comets.forEach(c => c.update());
            requestAnimationFrame(animateSpace);
        }

        setCanvasSize();
        initSpace();
        animateSpace();
        window.addEventListener('resize', () => {
            setCanvasSize();
            initSpace();
        });

    }, []);

    return <canvas id="space-background" ref={canvasRef}></canvas>;
};

export default SpaceBackground;
