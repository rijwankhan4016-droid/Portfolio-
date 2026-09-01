// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ---------- Hero editor tab content ----------
const tabContent = [
  // index.html
  `<span class="kw">&lt;div</span> <span class="fn">class</span>=<span class="str">"developer"</span><span class="kw">&gt;</span>
  <span class="kw">&lt;h1&gt;</span>Mohammad Rijvan Khan<span class="kw">&lt;/h1&gt;</span>
  <span class="kw">&lt;p&gt;</span>Frontend Developer<span class="kw">&lt;/p&gt;</span>
<span class="kw">&lt;/div&gt;</span>`,
  // style.css
  `<span class="punc">.developer {</span>
  <span class="fn">color</span>: <span class="str">#e6e8ef</span>;
  <span class="fn">stack</span>: <span class="str">HTML, CSS, JS</span>;
  <span class="fn">energy</span>: <span class="str">unlimited</span>;
<span class="punc">}</span>`,
  // script.js
  `<span class="kw">const</span> developer <span class="punc">=</span> <span class="punc">{</span>
  name: <span class="str">"Mohammad Rijvan Khan"</span>,
  role: <span class="str">"Frontend Developer"</span>,
  stack: [<span class="str">"HTML"</span>, <span class="str">"CSS"</span>, <span class="str">"JavaScript"</span>],
  status: <span class="str">"open to opportunities"</span>
<span class="punc">}</span><span class="punc">;</span>`
];

const typedCodeEl = document.getElementById('typedCode');
const lineNumbersEl = document.getElementById('lineNumbers');
const tabs = document.querySelectorAll('.tab');
let currentTab = 0;
let typingTimer = null;

function stripTags(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent.split('\n');
}

function setLineNumbers(count) {
  lineNumbersEl.innerHTML = Array.from({ length: count }, (_, i) => i + 1).join('<br>');
}

function typeHTML(html) {
  clearTimeout(typingTimer);
  const lines = stripTags(html);
  setLineNumbers(lines.length);
  typedCodeEl.innerHTML = '';

  // Build final DOM off-screen so tags render, but reveal progressively via a plain-text
  // typing effect, then swap in the styled version at the end for crisp syntax color.
  let plain = lines.join('\n');
  let i = 0;
  typedCodeEl.textContent = '';

  function step() {
    if (i <= plain.length) {
      typedCodeEl.textContent = plain.slice(0, i);
      i += 2;
      typingTimer = setTimeout(step, 12);
    } else {
      typedCodeEl.innerHTML = html;
    }
  }
  step();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = parseInt(tab.dataset.tab, 10);
    typeHTML(tabContent[currentTab]);
  });
});

// Auto-cycle tabs once, then settle on the last one
window.addEventListener('DOMContentLoaded', () => {
  typeHTML(tabContent[0]);
});

// ---------- Skills terminal ----------
const skills = [
  { name: 'HTML5', level: 'fluent', pct: 90, color: 'var(--gold)' },
  { name: 'CSS3', level: 'fluent', pct: 85, color: 'var(--purple)' },
  { name: 'JavaScript', level: 'building daily', pct: 70, color: 'var(--green)' },
  { name: 'Responsive Design', level: 'comfortable', pct: 75, color: 'var(--gold)' },
  { name: 'Git & GitHub', level: 'learning', pct: 55, color: 'var(--purple)' },
];

const skillsTerminal = document.getElementById('skillsTerminal');
let skillsHTML = `<p><span class="prompt">$</span> ls ./skills --verbose</p>`;
skills.forEach(s => {
  skillsHTML += `
    <div class="skill-row" data-pct="${s.pct}" data-color="${s.color}">
      <span class="skill-name">${s.name}</span>
      <div class="skill-bar-track"><div class="skill-bar-fill"></div></div>
      <span class="skill-level">${s.level}</span>
    </div>`;
});
skillsTerminal.innerHTML = skillsHTML;

// ---------- Scroll reveal ----------
document.querySelectorAll('.about-grid, .status-list, .terminal-block, .section-head')
  .forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');

      // trigger skill bar fill animation once skills terminal is visible
      if (entry.target.id === 'skillsTerminal' || entry.target.contains?.(skillsTerminal)) {
        document.querySelectorAll('.skill-row').forEach(row => {
          const fill = row.querySelector('.skill-bar-fill');
          fill.style.width = row.dataset.pct + '%';
          fill.style.background = row.dataset.color;
        });
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Separate observer just for skills bars (since terminal-block already observed above,
// but ensure skill rows fill even if terminal-block matched a different selector path)
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.skill-row').forEach(row => {
        const fill = row.querySelector('.skill-bar-fill');
        fill.style.width = row.dataset.pct + '%';
        fill.style.background = row.dataset.color;
      });
      skillsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
skillsObserver.observe(skillsTerminal);

// ---------- Navbar shrink on scroll ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 40 ? '0 4px 20px rgba(0,0,0,0.3)' : 'none';
});
