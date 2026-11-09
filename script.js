const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const mobile = window.innerWidth < 768;
const CONFIG = {
    particles: mobile ? 1400 : 4000,
    stars: mobile ? 900 : 2600,
    heartScale: mobile ? 11 : 17,
    trailOpacity: mobile ? 0.08 : 0.035
};

const particles = [];
const stars = [];

function heart(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)
    };
}

for (let i = 0; i < CONFIG.particles; i++) {
    const t = Math.random() * Math.PI * 2;
    const h = heart(t);
    particles.push({
        tx: h.x * CONFIG.heartScale,
        ty: -h.y * CONFIG.heartScale,
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        vx: 0, vy: 0,
        size: Math.random() * 1.8 + 0.3,
        speed: 0.002 + Math.random() * 0.01
    });
}

for (let i = 0; i < CONFIG.stars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.2
    });
}

function drawBackground() {
    const g = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, canvas.width
    );
    g.addColorStop(0, "#140012");
    g.addColorStop(0.45, "#070010");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
    for (const star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
    }
}

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    ctx.fillStyle = `rgba(0,0,0,${CONFIG.trailOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawStars();

    const cx = canvas.width / 2 + Math.sin(time * 0.2) * 10;
    const cy = canvas.height / 2 + Math.cos(time * 0.15) * 10;

    ctx.save();
    ctx.translate(cx, cy);

    for (const p of particles) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.0009;
        p.vy += dy * 0.0009;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,150,210,0.65)";
        ctx.fill();
    }
    ctx.restore();
}

const startBtn = document.getElementById("startBtn");
if (startBtn) {
    startBtn.addEventListener("click", () => {
        const music = document.getElementById("bgMusic");
        if (music) music.play().catch(() => {});
        const hero = document.getElementById("hero");
        if (hero) hero.remove();

        const galaxy = document.getElementById("galaxyMap");
        if (galaxy) {
            galaxy.style.display = "block";
            galaxy.style.opacity = "1";
            galaxy.style.pointerEvents = "auto";
            galaxy.scrollIntoView({ behavior: "smooth" });
        }
    });
}

window.addEventListener("load", () => {
    const loading = document.getElementById("loading");
    setTimeout(() => {
        if (loading) loading.style.opacity = "0";
        setTimeout(() => {
            if (loading) loading.remove();
        }, 600);
    }, 3000);
});

animate();
