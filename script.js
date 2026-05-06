/* ─── CUSTOM CURSOR ───────────────────────────────── */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function rafCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cur.style.left  = mx + 'px';
  cur.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(rafCursor);
})();

/* ─── NAV SCROLL SHRINK ───────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── LIQUID CANVAS BACKGROUND ───────────────────── */
const canvas = document.getElementById('liquid');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const blobColors = [
  'rgba(0,170,255,',
  'rgba(26,111,255,',
  'rgba(0,245,200,',
  'rgba(0,80,200,',
];

class Blob {
  constructor(index) {
    this.init(index);
  }

  init(index) {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = 180 + Math.random() * 220;
    this.dx    = (Math.random() - 0.5) * 0.6;
    this.dy    = (Math.random() - 0.5) * 0.6;
    this.color = blobColors[index % blobColors.length];
    this.alpha = 0.07 + Math.random() * 0.06;
    this.phase = Math.random() * Math.PI * 2;
    this.speed = 0.004 + Math.random() * 0.004;
  }

  draw(timestamp) {
    const pulse = 1 + 0.08 * Math.sin(timestamp * this.speed + this.phase);
    const grad  = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.r * pulse
    );
    grad.addColorStop(0, this.color + this.alpha + ')');
    grad.addColorStop(1, this.color + '0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * pulse, 0, Math.PI * 2);
    ctx.fill();

    this.x += this.dx;
    this.y += this.dy;

    // Wrap around edges
    if (this.x < -this.r)      this.x = W + this.r;
    if (this.x > W + this.r)   this.x = -this.r;
    if (this.y < -this.r)      this.y = H + this.r;
    if (this.y > H + this.r)   this.y = -this.r;
  }
}

const blobs = Array.from({ length: 9 }, (_, i) => new Blob(i));

function animateLiquid(timestamp) {
  ctx.clearRect(0, 0, W, H);
  blobs.forEach(b => b.draw(timestamp));
  requestAnimationFrame(animateLiquid);
}
requestAnimationFrame(animateLiquid);

/* ─── SCROLL REVEAL ───────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── ANIMATED SKILL BARS ─────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetScale = fill.style.getPropertyValue('--w');
      setTimeout(() => {
        fill.style.transform = `scaleX(${targetScale})`;
        fill.classList.add('animated');
      }, 200);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ─── CONTACT FORM ────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'MESSAGE SENT ✓';
  btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
  setTimeout(() => {
    btn.textContent = 'SEND MESSAGE ↗';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

/* ─── PROJECT CARD CURSOR GLOW ────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(10,40,80,0.7), rgba(6,20,45,0.55) 60%)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ─── MOBILE NAV ──────────────────────────────────── */
const mobNav      = document.getElementById('mob-nav');
const hamburger   = document.getElementById('hamburger');
const mobNavClose = document.getElementById('mob-nav-close');

hamburger.addEventListener('click', () => mobNav.classList.add('open'));
mobNavClose.addEventListener('click', () => mobNav.classList.remove('open'));

document.querySelectorAll('#mob-nav a').forEach(link => {
  link.addEventListener('click', () => mobNav.classList.remove('open'));
});


/* ─── DARK / LIGHT MODE ─────────────────────────── */
const toggleBtn = document.getElementById('theme-toggle');

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  toggleBtn.textContent = '🌙';
}

// Toggle
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');

  const isLight = document.body.classList.contains('light');

  toggleBtn.textContent = isLight ? '🌙' : '☀️';

  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
const isLight = document.body.classList.contains('light');
ctx.globalCompositeOperation = isLight ? 'multiply' : 'screen';