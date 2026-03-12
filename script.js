document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a");
  const revealItems = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll("main section[id]");
  const progressBar = document.getElementById("progressBar");
  const cursorGlow = document.getElementById("cursorGlow");
  const faqItems = document.querySelectorAll(".faq-item");

  // Encerramento visual da intro
  window.setTimeout(() => {
    body.classList.add("intro-done");
  }, 1850);

  // Menu mobile
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = nav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        nav.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      }
    });
  }

  // Reveal
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 40, 220)}ms`;
    observer.observe(item);
  });

  // Link ativo
  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const matchingLink = document.querySelector(`.nav a[href="#${id}"]`);

      if (!matchingLink) return;

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => link.classList.remove("is-active"));
        matchingLink.classList.add("is-active");
      }
    });
  };

  // Barra de progresso
  const updateProgressBar = () => {
    if (!progressBar) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  // Cursor glow
  if (cursorGlow && window.matchMedia("(min-width: 768px)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    const renderGlow = () => {
      currentX += (mouseX - currentX) * 0.14;
      currentY += (mouseY - currentY) * 0.14;

      cursorGlow.style.transform = `translate(${currentX - 130}px, ${currentY - 130}px)`;
      requestAnimationFrame(renderGlow);
    };

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorGlow.style.opacity = "1";
    });

    window.addEventListener("mouseout", () => {
      cursorGlow.style.opacity = "0";
    });

    requestAnimationFrame(renderGlow);
  }

  // FAQ estilo persiana
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");

    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((faq) => {
        faq.classList.remove("is-open");
        const btn = faq.querySelector(".faq-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  const handleScrollEffects = () => {
    setActiveLink();
    updateProgressBar();
  };

  window.addEventListener("scroll", handleScrollEffects, { passive: true });
  window.addEventListener("resize", handleScrollEffects);

  handleScrollEffects();
});