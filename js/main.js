(function () {
  const WA_NUMBER = "528123276329";
  const body = document.body;
  body.classList.add("loading");

  const loader = document.getElementById("loader");
  const startedAt = Date.now();

  function hideLoader() {
    const elapsed = Date.now() - startedAt;
    const wait = Math.max(0, 2300 - elapsed);
    window.setTimeout(() => {
      loader?.classList.add("is-hidden");
      body.classList.remove("loading");
    }, wait);
  }

  window.addEventListener("load", hideLoader);
  window.setTimeout(hideLoader, 4200);

  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobMenu = document.getElementById("mob-menu");

  function updateNavbar() {
    navbar?.classList.toggle("scrolled", window.scrollY > 18);
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  hamburger?.addEventListener("click", () => {
    const open = !mobMenu.classList.contains("is-open");
    mobMenu.classList.toggle("is-open", open);
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });

  mobMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobMenu.classList.remove("is-open");
      hamburger?.classList.remove("is-open");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  const marquee = document.getElementById("marquee");
  if (marquee) {
    const items = [
      "Marrod Shinny",
      "Limpieza profesional",
      "Empresas",
      "Hogares",
      "Atención al detalle",
      "Trabajo metódico",
      "Equipo capacitado",
      "Cotización por WhatsApp"
    ];
    const content = [...items, ...items, ...items, ...items]
      .map((item) => `<span>${item}</span>`)
      .join("");
    marquee.innerHTML = content;
  }

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px" });

  revealItems.forEach((item) => revealObserver.observe(item));

  const statNumbers = document.querySelectorAll(".stat-num");
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateNumber(entry.target);
      statObserver.unobserve(entry.target);
    });
  }, { threshold: 0.45 });

  statNumbers.forEach((number) => statObserver.observe(number));

  function animateNumber(element) {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(target * eased);
      element.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const form = document.getElementById("wa-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("f-name")?.value.trim();
    const interest = document.getElementById("f-interest")?.value.trim();
    const message = document.getElementById("f-msg")?.value.trim();

    if (!name || !message) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola Marrod Shinny, quiero solicitar una cotización de limpieza profesional.",
      `Nombre: ${name}`,
      `Servicio: ${interest}`,
      `Detalle: ${message}`
    ].join("\n");

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  createParticleCanvas("hero-canvas", {
    count: 74,
    colors: ["#D4AF37", "#A2C29C", "#4B8DBB", "#ffffff"],
    size: [0.9, 2.4],
    speed: 0.34,
    alpha: 0.62,
    connect: true
  });

  createParticleCanvas("why-canvas", {
    count: 42,
    colors: ["#D4AF37", "#A2C29C"],
    size: [0.8, 1.8],
    speed: 0.2,
    alpha: 0.34,
    connect: false
  });

  createParticleCanvas("sector-canvas", {
    count: 34,
    colors: ["#4B8DBB", "#D4AF37", "#C62F3D"],
    size: [0.8, 1.6],
    speed: 0.18,
    alpha: 0.28,
    connect: false
  });

  function createParticleCanvas(id, options) {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    let width = 0;
    let height = 0;
    let raf = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function seed() {
      particles.length = 0;
      const count = Math.round(options.count * Math.min(Math.max(width / 900, 0.72), 1.25));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: random(0, width),
          y: random(0, height),
          vx: random(-options.speed, options.speed),
          vy: random(-options.speed, options.speed),
          r: random(options.size[0], options.size[1]),
          color: options.colors[Math.floor(Math.random() * options.colors.length)]
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.globalAlpha = options.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (options.connect) {
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = "#D4AF37";
        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      cancelAnimationFrame(raf);
      resize();
      seed();
      draw();
    };

    resize();
    seed();
    draw();
    window.addEventListener("resize", onResize, { passive: true });
  }
})();
