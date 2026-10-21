// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") links.classList.remove("open");
});

// 100-square waffle chart: 8.7% recycled ≈ 9 squares
const waffle = document.getElementById("waffle");
for (let i = 0; i < 100; i++) {
  const sq = document.createElement("span");
  if (i < 9) sq.className = "on";
  waffle.appendChild(sq);
}

// Reveal-on-scroll and budget bar animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".bar-fill").forEach((bar) => {
      const total = Number(bar.closest(".bar-list").dataset.total);
      bar.style.width = (Number(bar.dataset.value) / total) * 100 + "%";
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Highlight the nav link for the section on screen
const sections = [...document.querySelectorAll("main section")];
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
  const text = document.getElementById("letter-text").innerText;
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Copied! Paste it into an email or letter.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById("letter-text"));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    status.textContent = "Text selected — press Ctrl/Cmd + C to copy.";
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
