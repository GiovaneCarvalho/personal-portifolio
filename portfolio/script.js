// Initialize Lucide Icons (called after this file in the HTML)
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const tabBtns = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view');

    // Tab Navigation Logic
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding view
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Re-bind Lucide icons if dynamically loaded (safety check)
            lucide.createIcons();
        });
    });

    // Language Toggle Logic
    const langBtns = document.querySelectorAll('.lang-btn');

    // Sync initial state
    const syncLangBtns = () => {
        const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'pt';
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };
    syncLangBtns();

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang === 'en') {
                document.body.classList.remove('lang-pt');
                document.body.classList.add('lang-en');
                localStorage.setItem('lang', 'en');
            } else {
                document.body.classList.remove('lang-en');
                document.body.classList.add('lang-pt');
                localStorage.setItem('lang', 'pt');
            }
            syncLangBtns();
        });
    });

    // Simple reveal animation for elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observing to elements we want to reveal
    const revealElements = document.querySelectorAll('.card, .timeline-item, .hero-title, .hero-subtitle, .hero-actions');

    revealElements.forEach(el => {
        // Only apply inline styles if we plan to animate them
        if (getComputedStyle(el).opacity !== '0') {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
        observer.observe(el);
    });
});

// Canvas Particle Network Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let animFrame;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    let numParticles = Math.floor((width * height) / 18000);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

function animate() {
    animFrame = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 - dist / 800})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x != null && mouse.y != null) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 - dist / 600})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', resize);
resize();
animate();
