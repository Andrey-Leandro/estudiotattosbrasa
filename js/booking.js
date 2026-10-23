
/* =====================================================
   BRASA TATTOO 3.0
   BOOKING.JS
   Orçamentos pelo WhatsApp
===================================================== */

"use strict";

/* ==========================================
   01. DADOS DO ESTÚDIO
========================================== */

const BRASA_CONFIG = {

  studio: "Brasa Tattoo",

  artist: "Werlleyn Nascimento",

  whatsapp: "5511958087575",

  instagram: "brasattoo_",

  city: "Carapicuíba - SP",

  specialties: [
    "Blackwork",
    "Realismo"
  ]

};

/* ==========================================
   02. INICIAR FORMULÁRIO
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  initBookingForm
);

function initBookingForm() {

  const form = document.getElementById(
    "bookingForm"
  );

  const feedback = document.getElementById(
    "formFeedback"
  );

  if (!form) {

    console.warn(
      "Brasa Tattoo: formulário não encontrado."
    );

    return;

  }

  /* ==========================================
     03. AVISOS AO CLIENTE
  ========================================== */

  function showFeedback(
    message,
    type = "error"
  ) {

    if (!feedback) return;

    feedback.textContent = message;

    feedback.style.color =
      type === "success"
        ? "#6be58a"
        : "#efa69b";

  }

  function clearFeedback() {

    if (!feedback) return;

    feedback.textContent = "";

  }

  /* ==========================================
     04. TRATAR NÚMEROS
  ========================================== */

  function onlyNumbers(value) {

    return String(value || "").replace(
      /\D/g,
      ""
    );

  }

  /* ==========================================
     05. VALIDAR WHATSAPP DO CLIENTE
  ========================================== */

  function validPhone(value) {

    const digits = onlyNumbers(value);

    return (
      /^\d{10,11}$/.test(digits) ||
      /^55\d{10,11}$/.test(digits)
    );

  }

  /* ==========================================
     06. FORMATAR DATA
  ========================================== */

  function formatDate(value) {

    if (!value) return "A combinar";

    const parts = value.split("-");

    if (parts.length !== 3) {
      return "A combinar";
    }

    const [year, month, day] = parts;

    return `${day}/${month}/${year}`;

  }

  /* ==========================================
     07. DATA DE HOJE
  ========================================== */

  function getToday() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

  }

  /* ==========================================
     08. PEGAR DADOS DO FORMULÁRIO
  ========================================== */

  function getBookingData() {

    const fields = new FormData(form);

    return {

      name: String(
        fields.get("name") || ""
      ).trim(),

      phone: String(
        fields.get("phone") || ""
      ).trim(),

      style: String(
        fields.get("style") || ""
      ).trim(),

      placement: String(
        fields.get("placement") || ""
      ).trim(),

      size: String(
        fields.get("size") || ""
      ).trim(),

      description: String(
        fields.get("description") || ""
      ).trim(),

      date: String(
        fields.get("date") || ""
      ).trim(),

      consent:
        fields.get("consent") === "on"

    };

  }

  /* ==========================================
     09. VALIDAR DADOS
  ========================================== */

  function validateBooking(data) {

    if (data.name.length < 2) {

      return "Informe seu nome para continuar.";

    }

    if (!validPhone(data.phone)) {

      return "Informe um WhatsApp válido com DDD.";

    }

    if (!data.style) {

      return "Selecione o estilo desejado.";

    }

    if (!data.placement) {

      return "Selecione a região do corpo.";

    }

    if (!data.size) {

      return "Informe o tamanho aproximado.";

    }

    if (data.description.length < 10) {

      return "Descreva sua ideia com pelo menos 10 caracteres.";

    }

    if (data.date) {

      const selected = new Date(
        `${data.date}T12:00:00`
      );

      if (
        Number.isNaN(selected.getTime()) ||
        selected.getFullYear() !==
          Number(data.date.slice(0, 4)) ||
        selected.getMonth() + 1 !==
          Number(data.date.slice(5, 7)) ||
        selected.getDate() !==
          Number(data.date.slice(8, 10))
      ) {

        return "Selecione uma data válida.";

      }

      if (data.date < getToday()) {

        return "A data não pode estar no passado.";

      }

    }

    if (!data.consent) {

      return "Autorize o compartilhamento dos dados para continuar.";

    }

    return null;

  }

  /* ==========================================
     10. CRIAR MENSAGEM DO WHATSAPP
  ========================================== */

  function buildWhatsAppMessage(data) {

    const lines = [

      "🔥 *BRASA TATTOO*",

      "*SOLICITAÇÃO DE ORÇAMENTO*",

      "",

      "Olá, Werlleyn! Gostaria de solicitar um orçamento para uma tatuagem.",

      "",

      "👤 *DADOS DO CLIENTE*",

      `Nome: ${data.name}`,

      `WhatsApp: ${data.phone}`,

      "",

      "🎨 *DETALHES DA TATUAGEM*",

      `Estilo: ${data.style}`,

      `Região do corpo: ${data.placement}`,

      `Tamanho aproximado: ${data.size}`,

      "",

      "📝 *DESCRIÇÃO DO PROJETO*",

      data.description,

      "",

      "📅 *DATA DE PREFERÊNCIA*",

      formatDate(data.date),

      "",

      "Gostaria de conversar sobre valores e disponibilidade.",

      "",

      "Mensagem preparada pelo site Brasa Tattoo."

    ];

    return lines.join("\n");

  }

  /* ==========================================
     11. CRIAR LINK DO WHATSAPP
  ========================================== */

  function createWhatsAppLink(message) {

    const number = onlyNumbers(
      BRASA_CONFIG.whatsapp
    );

    if (!/^55\d{10,11}$/.test(number)) {

      return null;

    }

    return (
      `https://wa.me/${number}?text=` +
      encodeURIComponent(message)
    );

  }

  /* ==========================================
     12. ENVIAR FORMULÁRIO
  ========================================== */

  form.addEventListener("submit", event => {

    event.preventDefault();

    clearFeedback();

    if (!form.reportValidity()) return;

    const data = getBookingData();

    const error = validateBooking(data);

    if (error) {

      showFeedback(error);

      return;

    }

    const message = buildWhatsAppMessage(data);

    const whatsappUrl = createWhatsAppLink(
      message
    );

    if (!whatsappUrl) {

      showFeedback(
        "O WhatsApp comercial não está configurado."
      );

      return;

    }

    showFeedback(
      "Abrindo o WhatsApp com seu orçamento...",
      "success"
    );

    /*
      Abre o WhatsApp na mesma aba.

      O cliente ainda precisa clicar
      em Enviar dentro do WhatsApp.

      O formulário não será apagado.
    */

    window.location.assign(whatsappUrl);

  });

  /* ==========================================
     13. LIMPAR AVISOS
  ========================================== */

  form.addEventListener(
    "input",
    clearFeedback
  );

  form.addEventListener(
    "change",
    clearFeedback
  );

  /* ==========================================
     14. INICIALIZAÇÃO
  ========================================== */

  console.log(
    "Brasa Tattoo 3.0 | booking.js carregado"
  );

}
