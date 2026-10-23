
/* ==================================================
   BRASA TATTOO 3.1
   GALLERY.JS

   FILTROS CORRIGIDOS
   BLACKWORK / REALISMO / TODOS

   Werlleyn Nascimento
================================================== */

"use strict";

/* ==============================================
   01 — INICIALIZAÇÃO
============================================== */

function initializeBrasaGallery() {

  const grid = document.getElementById(
    "portfolioGrid"
  );

  const filtersContainer = document.getElementById(
    "galleryFilters"
  );

  const galleryStatus = document.getElementById(
    "galleryStatus"
  );

  const lightbox = document.getElementById(
    "galleryLightbox"
  );

  const lightboxImage = document.getElementById(
    "lightboxImage"
  );

  const lightboxCaption = document.getElementById(
    "lightboxCaption"
  );

  const closeButton = document.getElementById(
    "lightboxClose"
  );

  const previousButton = document.getElementById(
    "lightboxPrev"
  );

  const nextButton = document.getElementById(
    "lightboxNext"
  );

  /* ==============================================
     02 — VERIFICAR ELEMENTOS
  ============================================== */

  if (!grid || !filtersContainer) {

    console.error(
      "BRASA TATTOO: grade ou filtros não encontrados."
    );

    return;

  }

  if (grid.dataset.galleryInitialized === "true") {
    return;
  }

  const items = Array.from(
    grid.querySelectorAll(".gallery-item")
  );

  const filterButtons = Array.from(
    filtersContainer.querySelectorAll(
      ".filter-btn[data-filter]"
    )
  );

  if (!items.length || !filterButtons.length) {

    console.error(
      "BRASA TATTOO: fotos ou botões não encontrados."
    );

    return;

  }

  grid.dataset.galleryInitialized = "true";

  /* ==============================================
     03 — ESTADO DA GALERIA
  ============================================== */

  let visibleItems = [...items];

  let currentIndex = 0;

  let lastFocusedElement = null;

  let touchStartX = null;

  const lightboxReady = Boolean(
    lightbox &&
    lightboxImage &&
    lightboxCaption &&
    closeButton &&
    previousButton &&
    nextButton
  );

  /* ==============================================
     04 — MOSTRAR UMA FOTO
  ============================================== */

  function showItem(item) {

    item.hidden = false;

    /*
      Removemos possíveis estilos antigos
      que tenham escondido a fotografia.
    */

    item.style.removeProperty("display");

    /*
      O animation.css usa reveal e is-visible.
      Garantimos que a foto apareça.
    */

    item.classList.add("is-visible");

    item.setAttribute(
      "aria-hidden",
      "false"
    );

    item.removeAttribute("tabindex");

  }

  /* ==============================================
     05 — ESCONDER UMA FOTO
  ============================================== */

  function hideItem(item) {

    item.hidden = true;

    /*
      display: none !important impede que
      outros estilos mantenham a foto visível.
    */

    item.style.setProperty(
      "display",
      "none",
      "important"
    );

    item.setAttribute(
      "aria-hidden",
      "true"
    );

    item.setAttribute(
      "tabindex",
      "-1"
    );

  }

  /* ==============================================
     06 — ATUALIZAR CONTADOR
  ============================================== */

  function updateGalleryStatus(category) {

    if (!galleryStatus) return;

    const count = visibleItems.length;

    let categoryLabel = "";

    if (category === "realismo") {
      categoryLabel = " de Realismo";
    }

    if (category === "blackwork") {
      categoryLabel = " de Blackwork / Traços";
    }

    const word =
      count === 1 ? "trabalho" : "trabalhos";

    galleryStatus.textContent =
      `${count} ${word}${categoryLabel} ${count === 1 ? "encontrado" : "encontrados"}`;

  }

  /* ==============================================
     07 — FILTRAR TATUAGENS
  ============================================== */

  function filterGallery(category) {

    const selectedCategory =
      String(category || "all")
        .trim()
        .toLowerCase();

    /*
      Se o visualizador estiver aberto,
      fechamos antes de aplicar o filtro.
    */

    if (
      lightboxReady &&
      !lightbox.hidden
    ) {

      closeLightbox();

    }

    visibleItems = [];

    items.forEach(item => {

      const rawCategories =
        item.getAttribute("data-category") || "";

      const itemCategories = rawCategories
        .toLowerCase()
        .trim()
        .split(/\s+/);

      const matches =
        selectedCategory === "all" ||
        itemCategories.includes(selectedCategory);

      if (matches) {

        showItem(item);

        visibleItems.push(item);

      } else {

        hideItem(item);

      }

    });

    /*
      Destacar o botão escolhido.
    */

    filterButtons.forEach(button => {

      const buttonCategory =
        String(
          button.getAttribute("data-filter") || ""
        ).toLowerCase();

      const isActive =
        buttonCategory === selectedCategory;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

    });

    updateGalleryStatus(selectedCategory);

    console.log(
      "[BRASA] Filtro:",
      selectedCategory,
      "| Fotos:",
      visibleItems.length
    );

  }

  /* ==============================================
     08 — CLIQUES DOS BOTÕES
  ============================================== */

  filtersContainer.addEventListener(
    "click",
    event => {

      const button = event.target.closest(
        ".filter-btn[data-filter]"
      );

      if (!button) return;

      if (!filtersContainer.contains(button)) {
        return;
      }

      event.preventDefault();

      const category = button.getAttribute(
        "data-filter"
      );

      filterGallery(category);

    }
  );

  /* ==============================================
     09 — ATUALIZAR A FOTO AMPLIADA
  ============================================== */

  function updateLightbox() {

    if (!lightboxReady) return;

    const selectedItem =
      visibleItems[currentIndex];

    if (!selectedItem) return;

    const thumbnail = selectedItem.querySelector(
      "img"
    );

    const imagePath =
      selectedItem.dataset.full ||
      thumbnail?.getAttribute("src");

    const imageTitle =
      selectedItem.dataset.title ||
      thumbnail?.alt ||
      "Trabalho Brasa Tattoo";

    if (!imagePath) return;

    lightboxImage.src = imagePath;

    lightboxImage.alt =
      thumbnail?.alt || imageTitle;

    lightboxCaption.textContent =
      `${currentIndex + 1} / ${visibleItems.length} — ${imageTitle}`;

    const hasMultiplePhotos =
      visibleItems.length > 1;

    previousButton.hidden = !hasMultiplePhotos;

    nextButton.hidden = !hasMultiplePhotos;

  }

  /* ==============================================
     10 — ABRIR FOTO AMPLIADA
  ============================================== */

  function openLightbox(item) {

    if (!lightboxReady) return;

    const index = visibleItems.indexOf(item);

    if (index < 0) return;

    currentIndex = index;

    lastFocusedElement =
      document.activeElement;

    updateLightbox();

    lightbox.hidden = false;

    document.body.classList.add(
      "lightbox-open"
    );

    closeButton.focus();

  }

  /* ==============================================
     11 — FECHAR FOTO AMPLIADA
  ============================================== */

  function closeLightbox() {

    if (!lightboxReady || lightbox.hidden) {
      return;
    }

    lightbox.hidden = true;

    document.body.classList.remove(
      "lightbox-open"
    );

    lightboxImage.removeAttribute("src");

    if (
      lastFocusedElement &&
      lastFocusedElement.isConnected &&
      !lastFocusedElement.hidden
    ) {

      lastFocusedElement.focus();

    }

    lastFocusedElement = null;

  }

  /* ==============================================
     12 — PRÓXIMA FOTO
  ============================================== */

  function nextImage() {

    if (visibleItems.length <= 1) return;

    currentIndex =
      (currentIndex + 1) % visibleItems.length;

    updateLightbox();

  }

  /* ==============================================
     13 — FOTO ANTERIOR
  ============================================== */

  function previousImage() {

    if (visibleItems.length <= 1) return;

    currentIndex =
      (
        currentIndex - 1 +
        visibleItems.length
      ) % visibleItems.length;

    updateLightbox();

  }

  /* ==============================================
     14 — CLIQUE NAS FOTOGRAFIAS
  ============================================== */

  grid.addEventListener("click", event => {

    const item = event.target.closest(
      ".gallery-item"
    );

    if (!item) return;

    if (!grid.contains(item)) return;

    if (item.hidden) return;

    openLightbox(item);

  });

  /* ==============================================
     15 — EVENTOS DO VISUALIZADOR
  ============================================== */

  if (lightboxReady) {

    closeButton.addEventListener(
      "click",
      closeLightbox
    );

    previousButton.addEventListener(
      "click",
      previousImage
    );

    nextButton.addEventListener(
      "click",
      nextImage
    );

    /*
      Fechar ao clicar no fundo escuro.
    */

    lightbox.addEventListener(
      "click",
      event => {

        if (event.target === lightbox) {
          closeLightbox();
        }

      }
    );

    /* ==========================================
       16 — CONTROLE DO TECLADO
    ========================================== */

    document.addEventListener(
      "keydown",
      event => {

        if (lightbox.hidden) return;

        if (event.key === "Escape") {

          event.preventDefault();

          closeLightbox();

          return;

        }

        if (event.key === "ArrowRight") {

          event.preventDefault();

          nextImage();

          return;

        }

        if (event.key === "ArrowLeft") {

          event.preventDefault();

          previousImage();

          return;

        }

        /*
          Prender o foco nos botões do visualizador.
        */

        if (event.key === "Tab") {

          const focusableButtons = [
            closeButton,
            previousButton,
            nextButton
          ].filter(button => !button.hidden);

          const first = focusableButtons[0];

          const last = focusableButtons[
            focusableButtons.length - 1
          ];

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

        }

      }
    );

    /* ==========================================
       17 — DESLIZAR NO CELULAR
    ========================================== */

    lightbox.addEventListener(
      "touchstart",
      event => {

        if (event.touches.length !== 1) {
          return;
        }

        touchStartX =
          event.touches[0].clientX;

      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      event => {

        if (
          touchStartX === null ||
          event.changedTouches.length !== 1
        ) {

          return;

        }

        const endX =
          event.changedTouches[0].clientX;

        const difference =
          touchStartX - endX;

        touchStartX = null;

        if (Math.abs(difference) < 60) {
          return;
        }

        if (difference > 0) {

          nextImage();

        } else {

          previousImage();

        }

      },
      { passive: true }
    );

  } else {

    console.warn(
      "[BRASA] Visualizador incompleto. Os filtros continuam funcionando."
    );

  }

  /* ==============================================
     18 — INICIAR FILTRO PADRÃO
  ============================================== */

  filterGallery("all");

  console.log(
    "BRASA TATTOO 3.1 — GALERIA INICIADA"
  );

}

/* ==============================================
   19 — EXECUTAR QUANDO HTML ESTIVER PRONTO
============================================== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeBrasaGallery,
    { once: true }
  );

} else {

  initializeBrasaGallery();

}
