// ---------- Rotating role ticker ----------
const tickerList = document.getElementById('tickerList');
if (tickerList) {
  const items = tickerList.children.length;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % items;
    tickerList.style.transform = `translateY(-${i * 1.5}em)`;
  }, 2200);
  tickerList.style.transition = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)';
}

// ---------- Project accordion ----------
const projectRows = document.querySelectorAll('.project-row');
projectRows.forEach(row => {
  const btn = row.querySelector('.project-summary');
  btn.addEventListener('click', () => {
    const isOpen = row.classList.contains('open');
    projectRows.forEach(r => {
      r.classList.remove('open');
      r.querySelector('.project-summary').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      row.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  });
});

// ---------- Skill tag filtering ----------
const tagButtons = document.querySelectorAll('.tag');

tagButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.classList.contains('active');
    tagButtons.forEach(b => b.classList.remove('active'));
    projectRows.forEach(r => r.classList.remove('dimmed', 'highlighted'));

    if (isActive) return;

    const filter = btn.dataset.filter;
    if (!filter) return;
    btn.classList.add('active');
    const targets = filter.split(' ');

    projectRows.forEach(row => {
      const project = row.dataset.project;
      if (targets.includes(project)) {
        row.classList.add('highlighted');
      } else {
        row.classList.add('dimmed');
      }
    });

    const firstMatch = document.querySelector('.project-row.highlighted');
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