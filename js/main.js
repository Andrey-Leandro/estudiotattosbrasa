
/* =====================================================
   BRASA TATTOO 3.0
   MAIN.JS
   Werlleyn Nascimento | Blackwork & Realismo
===================================================== */

"use strict";

/* ==========================================
   01. ATIVAR JAVASCRIPT
========================================== */

document.documentElement.classList.add("js-enabled");

/* ==========================================
   02. INICIAR O SITE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  initHeader();
  initMobileMenu();
  initScrollReveal();
  initSmoothNavigation();
  initActiveNavigation();
  initCurrentYear();
  initBookingDate();

});

/* ==========================================
   03. HEADER AO ROLAR
========================================== */

function initHeader() {

  const header = document.getElementById("header");

  if (!header) return;

  let ticking = false;

  function updateHeader() {

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 40
    );

    ticking = false;

  }

  window.addEventListener(
    "scroll",
    () => {

      if (ticking) return;

      ticking = true;

      requestAnimationFrame(updateHeader);

    },
    { passive: true }
  );

  updateHeader();

}

/* ==========================================
   04. MENU DO CELULAR
========================================== */

function initMobileMenu() {

  const toggle = document.getElementById("menuToggle");

  const nav = document.getElementById("mainNav");

  if (!toggle || !nav) return;

  const navLinks = Array.from(
    nav.querySelectorAll("a")
  );

  const mobileBreakpoint = window.matchMedia(
    "(max-width: 1050px)"
  );

  function isOpen() {
    return nav.classList.contains("is-open");
  }

  function openMenu() {

    nav.classList.add("is-open");

    toggle.classList.add("is-active");

    toggle.setAttribute("aria-expanded", "true");

    toggle.setAttribute("aria-label", "Fechar menu");

    document.body.classList.add("menu-open");

    navLinks[0]?.focus();

  }

  function closeMenu(restoreFocus = false) {

    if (!isOpen()) return;

    nav.classList.remove("is-open");

    toggle.classList.remove("is-active");

    toggle.setAttribute("aria-expanded", "false");

    toggle.setAttribute("aria-label", "Abrir menu");

    document.body.classList.remove("menu-open");

    if (restoreFocus) {
      toggle.focus();
    }

  }

  toggle.addEventListener("click", () => {

    if (isOpen()) {
      closeMenu(true);
    } else {
      openMenu();
    }

  });

  /* Fechar ao escolher uma seção */

  navLinks.forEach(link => {

    link.addEventListener("click", () => {

      closeMenu();

    });

  });

  /* Fechar com ESC e controlar foco */

  document.addEventListener("keydown", event => {

    if (!isOpen()) return;

    if (event.key === "Escape") {

      event.preventDefault();

      closeMenu(true);

      return;

    }

    if (event.key !== "Tab") return;

    const focusable = [toggle, ...navLinks];

    const first = focusable[0];

    const last = focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {

      event.preventDefault();
      last.focus();

    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {

      event.preventDefault();
      first.focus();

    }

  });

  /* Fechar ao clicar fora */

  document.addEventListener("click", event => {

    if (!isOpen()) return;

    if (
      !nav.contains(event.target) &&
      !toggle.contains(event.target)
    ) {

      closeMenu();

    }

  });

  /* Voltar ao menu desktop */

  function handleBreakpoint() {

    if (!mobileBreakpoint.matches) {
      closeMenu();
    }

  }

  mobileBreakpoint.addEventListener(
    "change",
    handleBreakpoint
  );

}

/* ==========================================
   05. ANIMAÇÕES AO ROLAR
========================================== */

function initScrollReveal() {

  const elements = document.querySelectorAll(
    ".reveal"
  );

  if (!elements.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {

    elements.forEach(element => {
      element.classList.add("is-visible");
    });

    return;

  }

  const observer = new IntersectionObserver(

    (entries, currentObserver) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        currentObserver.unobserve(entry.target);

      });

    },

    {
      threshold: 0.08,
      rootMargin: "0px 0px 35px 0px"
    }

  );

  elements.forEach(element => {
    observer.observe(element);
  });

}

/* ==========================================
   06. NAVEGAÇÃO SUAVE
========================================== */

function initSmoothNavigation() {

  const links = document.querySelectorAll(
    'a[href^="#"]'
  );

  links.forEach(link => {

    link.addEventListener("click", event => {

      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.getElementById(
        href.substring(1)
      );

      if (!target) return;

      event.preventDefault();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({

        behavior: reducedMotion ? "auto" : "smooth",

        block: "start"

      });

      if (window.history.replaceState) {

        window.history.replaceState(
          null,
          "",
          href
        );

      }

    });

  });

}

/* ==========================================
   07. MENU DESTACA A SEÇÃO ATUAL
========================================== */

function initActiveNavigation() {

  const links = Array.from(
    document.querySelectorAll(
      '.nav a[href^="#"]'
    )
  );

  const sections = links.map(link => {

    const id = link.getAttribute("href").slice(1);

    return {
      link,
      section: document.getElementById(id)
    };

  }).filter(item => item.section);

  if (!sections.length) return;

  let ticking = false;

  function updateActive() {

    const position = window.scrollY + 160;

    let activeItem = sections[0];

    sections.forEach(item => {

      if (item.section.offsetTop <= position) {
        activeItem = item;
      }

    });

    links.forEach(link => {

      const active = link === activeItem.link;

      link.classList.toggle("active", active);

      if (active) {

        link.setAttribute(
          "aria-current",
          "location"
        );

      } else {

        link.removeAttribute("aria-current");

      }

    });

    ticking = false;

  }

  window.addEventListener(
    "scroll",
    () => {

      if (ticking) return;

      ticking = true;

      requestAnimationFrame(updateActive);

    },
    { passive: true }
  );

  window.addEventListener("resize", updateActive);

  updateActive();

}

/* ==========================================
   08. ANO AUTOMÁTICO
========================================== */

function initCurrentYear() {

  const yearElement = document.getElementById(
    "currentYear"
  );

  if (!yearElement) return;

  yearElement.textContent = new Date().getFullYear();

}

/* ==========================================
   09. DATA DO ORÇAMENTO
========================================== */

function initBookingDate() {

  const dateInput = document.getElementById(
    "preferredDate"
  );

  if (!dateInput) return;

  function updateMinDate() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const today = `${year}-${month}-${day}`;

    dateInput.min = today;

    if (
      dateInput.value &&
      dateInput.value < today
    ) {

      dateInput.value = "";

    }

  }

  updateMinDate();

  dateInput.addEventListener(
    "focus",
    updateMinDate
  );

  dateInput.addEventListener(
    "change",
    updateMinDate
  );

}

/* ==========================================
   10. CONFIRMAÇÃO NO CONSOLE
========================================== */

console.log(
  "Brasa Tattoo 3.0 | main.js carregado"
);
