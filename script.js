// Nav: transparent over the hero, solid once scrolled
const nav = document.getElementById("nav");
const hero = document.querySelector(".hero");
const setNav = () => nav.classList.toggle("solid", window.scrollY > hero.offsetHeight - 80);
setNav();
window.addEventListener("scroll", setNav, { passive: true });

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  nav.classList.add("solid");
});
links.addEventListener("click", (e) => {
  if (e.target.closest("a")) links.classList.remove("open");
});

// 100-square waffle chart: 8.7% recycled ≈ 9 squares
const waffle = document.getElementById("waffle");
for (let i = 0; i < 100; i++) {
  const sq = document.createElement("span");
  if (i < 9) sq.className = "on";
  waffle.appendChild(sq);
}

// Reveal on scroll; grow the spending bar when it appears
const stack = document.getElementById("stack");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    if (entry.target.contains(stack)) {
      stack.querySelectorAll("div").forEach((seg) => (seg.style.flexGrow = seg.dataset.value));
    }
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Highlight the nav link for the section on screen
const sections = [...document.querySelectorAll("[data-section]")];
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => sectionObserver.observe(s));

// Donation demo — no payment info is collected
document.getElementById("donate-demo").addEventListener("click", () => {
  document.getElementById("donate-msg").hidden = false;
});

// Copy sample letter
document.getElementById("copy-letter").addEventListener("click", async () => {
  const letter = document.getElementById("letter-text");
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(letter.innerText);
    status.textContent = "Copied — paste it into an email.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(letter);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    status.textContent = "Selected — press Ctrl/Cmd + C.";
  }
  setTimeout(() => (status.textContent = ""), 4000);
});

// Presenter navigation: arrow keys / PageUp / PageDown jump between sections
const hint = document.getElementById("presenter-hint");
function currentSectionIndex() {
  const mid = window.innerHeight * 0.35;
  let idx = 0;
  sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) idx = i; });
  return idx;
}
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input, textarea, [contenteditable]")) return;
  const forward = ["ArrowRight", "PageDown"].includes(e.key);
  const back = ["ArrowLeft", "PageUp"].includes(e.key);
  if (!forward && !back) return;
  e.preventDefault();
  const next = Math.min(sections.length - 1, Math.max(0, currentSectionIndex() + (forward ? 1 : -1)));
  sections[next].scrollIntoView({ behavior: "smooth" });
});
setTimeout(() => hint.classList.add("show"), 800);
setTimeout(() => hint.classList.remove("show"), 5000);
