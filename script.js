// Highlight the nav link for the section on screen
const links = document.querySelectorAll(".nav-links a");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));

// Presenting: left/right arrow keys move between sections
const stops = [document.getElementById("top"), ...document.querySelectorAll("section[id]")];
document.addEventListener("keydown", (e) => {
  if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  e.preventDefault();
  let current = 0;
  stops.forEach((s, i) => { if (s.getBoundingClientRect().top <= window.innerHeight * 0.3) current = i; });
  const next = Math.max(0, Math.min(stops.length - 1, current + (e.key === "ArrowRight" ? 1 : -1)));
  stops[next].scrollIntoView({ behavior: "smooth" });
});

// Fill the 100-dot recycling graphic (about 9 of 100 recycled)
const dots = document.getElementById("dots");
for (let i = 0; i < 100; i++) {
  const dot = document.createElement("span");
  if (i < 9) dot.className = "on";
  dots.appendChild(dot);
}
