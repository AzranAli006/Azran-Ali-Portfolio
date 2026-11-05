// ====== EDIT THESE ======
const ROLES = [
  "Software Developer",
  "AI & ML Enthusiast",
  "Problem Solver",
  "Quick Learner",
];
const CONTACT_EMAIL = "you@example.com"; // contact form opens the visitor's email app addressed to this
// ========================

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const navLinks = document.getElementById("nav-links");
document
  .getElementById("menu-toggle")
  .addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open")),
  );

// Dark / light theme (remembered between visits)
const themeBtn = document.getElementById("theme-toggle");
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
}
let saved = null;
try {
  saved = localStorage.getItem("theme");
} catch (e) {}
applyTheme(
  saved ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),
);
themeBtn.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

// Typing effect
const typingEl = document.getElementById("typing");
let roleIdx = 0,
  charIdx = 0,
  deleting = false;
function type() {
  const word = ROLES[roleIdx];
  typingEl.textContent = word.substring(0, charIdx);
  if (!deleting && charIdx < word.length) {
    charIdx++;
    setTimeout(type, 110);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1400);
  } else if (charIdx > 0) {
    charIdx--;
    setTimeout(type, 55);
  } else {
    deleting = false;
    roleIdx = (roleIdx + 1) % ROLES.length;
    setTimeout(type, 300);
  }
}
type();

// Scroll reveal + skill bars + counters
function animateCount(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    n += step;
    if (n >= target) {
      n = target;
      clearInterval(timer);
    }
    el.textContent = n;
  }, 40);
}
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      el.querySelectorAll(".fill").forEach(
        (f) => (f.style.width = f.dataset.width + "%"),
      );
      el.querySelectorAll("[data-count]").forEach(animateCount);
      observer.unobserve(el);
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Active nav link on scroll + back-to-top
const sections = document.querySelectorAll("section[id]");
const toTop = document.getElementById("to-top");
window.addEventListener("scroll", () => {
  const y = window.scrollY + 120;
  sections.forEach((sec) => {
    const link = document.querySelector(`#nav-links a[href="#${sec.id}"]`);
    if (link)
      link.classList.toggle(
        "active",
        y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight,
      );
  });
  toTop.classList.toggle("show", window.scrollY > 500);
});
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// Contact form -> opens visitor's email app (works without a backend)
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${msg}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  document.getElementById("form-status").textContent =
    "Opening your email app...";
});
