// ---------- Typing effect ----------
const roles = [
  "IoT systems",
  "Flutter apps",
  "Firebase backends",
  "embedded firmware"
];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}
typeLoop();

// ---------- PCB trace rail ----------
const railWrap = document.querySelector('.rail-wrap');
const rail = document.getElementById('rail');
const railSignal = document.getElementById('railSignal');
const nodes = document.querySelectorAll('.trace-node');
const nodeDots = [];

function layoutNodes() {
  if (!rail) return;
  document.querySelectorAll('.node-dot').forEach(d => d.remove());
  nodeDots.length = 0;
  const railTop = rail.getBoundingClientRect().top + window.scrollY;
  nodes.forEach(section => {
    const top = section.getBoundingClientRect().top + window.scrollY - railTop;
    const dot = document.createElement('div');
    dot.className = 'node-dot';
    dot.style.top = top + 'px';
    dot.dataset.ref = section.dataset.ref;
    rail.appendChild(dot);
    nodeDots.push({ el: dot, section });
  });
}

function updateSignal() {
  if (!railWrap) return;
  const wrapRect = railWrap.getBoundingClientRect();
  const wrapTop = wrapRect.top + window.scrollY;
  const wrapHeight = railWrap.offsetHeight;
  const viewportCenter = window.scrollY + window.innerHeight * 0.4;
  let progress = (viewportCenter - wrapTop) / wrapHeight;
  progress = Math.max(0, Math.min(1, progress));
  railSignal.style.top = (progress * wrapHeight) + 'px';

  nodeDots.forEach(({ el, section }) => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.15;
    el.classList.toggle('lit', inView);
  });
}

let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => { updateSignal(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('load', () => { layoutNodes(); updateSignal(); });
window.addEventListener('resize', () => { layoutNodes(); updateSignal(); });
window.addEventListener('scroll', onScroll);

// ---------- Skill tag filtering ----------
const tagButtons = document.querySelectorAll('.tag');
const projectCards = document.querySelectorAll('.project-card');

tagButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.classList.contains('active');
    tagButtons.forEach(b => b.classList.remove('active'));
    projectCards.forEach(c => { c.classList.remove('dimmed', 'highlighted'); });

    if (isActive) return; // toggle off -> reset

    const filter = btn.dataset.filter;
    if (!filter) return;
    btn.classList.add('active');
    const targets = filter.split(' ');

    projectCards.forEach(card => {
      const project = card.dataset.project;
      if (targets.includes(project)) {
        card.classList.add('highlighted');
      } else {
        card.classList.add('dimmed');
      }
    });

    const firstMatch = document.querySelector('.project-card.highlighted');
    if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

// ---------- Copy email / phone ----------
function wireCopyButton(id, dataAttr) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const value = btn.dataset[dataAttr];
    navigator.clipboard.writeText(value).then(() => {
      const hint = btn.querySelector('.copy-hint');
      const original = hint.textContent;
      hint.textContent = 'copied!';
      setTimeout(() => { hint.textContent = original; }, 1500);
    });
  });
}
wireCopyButton('copyEmail', 'email');
wireCopyButton('copyPhone', 'phone');