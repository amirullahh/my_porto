/* ============================================================
   AMIR.OS — interactions
   ============================================================ */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- scroll progress ---------- */
  const progress = document.querySelector(".scroll-progress");
  function updateProgress() {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    progress.style.width = (pct * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- hero typed roles ---------- */
  const roles = [
    "devops & cloud engineering",
    "full-stack developer",
    "applied NLP / ML tinkerer",
    "aws certified cloud practitioner",
    "automation enjoyer",
  ];
  const typedEl = document.getElementById("typed");
  let ri = 0, ci = 0, deleting = false;

  function typeLoop() {
    const word = roles[ri];
    typedEl.textContent = word.slice(0, ci);
    let delay = deleting ? 28 : 62;
    if (!deleting && ci === word.length) { delay = 2100; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 420; }
    else ci += deleting ? -1 : 1;
    setTimeout(typeLoop, delay);
  }
  if (reducedMotion) {
    typedEl.textContent = roles[0];
  } else {
    typeLoop();
  }

  /* ---------- terminal playback ---------- */
  const termBody = document.getElementById("termBody");
  const session = [
    { cls: "t-cmd", text: "whoami" },
    { cls: "t-out", text: "amirullah hidayat — jakarta, id" },
    { cls: "t-cmd", text: "cat status.txt" },
    { cls: "t-out green", text: "[ ok ] AWS Certified Cloud Practitioner" },
    { cls: "t-out green", text: "[ ok ] open to work — devops / cloud / ml" },
    { cls: "t-cmd", text: "ls ./focus" },
    { cls: "t-out amber", text: "aws  docker  python  ci-cd  nlp" },
    { cls: "t-cmd", text: "sudo systemctl start opportunity" },
    { cls: "t-out green", text: "[ ok ] accepting new challenges..." },
  ];

  function finishTerminal() {
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.textContent = " ▊";
    const line = document.createElement("span");
    line.className = "t-line t-cmd";
    line.appendChild(cursor);
    termBody.appendChild(line);
  }

  if (reducedMotion) {
    session.forEach((s) => {
      const el = document.createElement("span");
      el.className = "t-line " + s.cls;
      el.textContent = s.text;
      termBody.appendChild(el);
    });
    finishTerminal();
  } else {
    let li = 0;
    function nextLine() {
      if (li >= session.length) { finishTerminal(); return; }
      const s = session[li++];
      const el = document.createElement("span");
      el.className = "t-line " + s.cls;
      termBody.appendChild(el);

      if (s.cls.startsWith("t-cmd")) {
        // type commands character by character
        let i = 0;
        (function tick() {
          el.textContent = s.text.slice(0, ++i);
          if (i < s.text.length) setTimeout(tick, 34);
          else setTimeout(nextLine, 380);
        })();
      } else {
        // outputs appear at once
        el.textContent = s.text;
        setTimeout(nextLine, 300);
      }
    }
    setTimeout(nextLine, 600);
  }

  /* ---------- active nav link ---------- */
  const navAnchors = document.querySelectorAll(".nav-links a");
  const sections = [...navAnchors]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navAnchors.forEach((a) =>
              a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
            );
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------- mobile menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- copy email ---------- */
  const copyBtn = document.getElementById("copyEmail");
  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const original = copyBtn.innerHTML;
    copyBtn.innerHTML = 'tercopy <span class="copy-icon">✓</span>';
    copyBtn.disabled = true;
    setTimeout(() => {
      copyBtn.innerHTML = original;
      copyBtn.disabled = false;
    }, 1800);
  });

  /* ---------- project card cursor glow ---------- */
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
})();
