const I18N = {
  es: {
    pageTitle: "SAMP demo | Detección automática de peces",
    pageDescription:
      "Portal temporal para acceder a una demo Gradio de detección automática de peces.",
    langAria: "Cambiar idioma",
    langTitle: "Cambiar idioma",
    themeAria: "Cambiar modo claro u oscuro",
    themeTitle: "Cambiar modo claro u oscuro",
    statusLoading: "Cargando estado de la demo…",
    updatedFallback: "sin registro",
    statusOnline: "Estado: demo en línea",
    statusOffline: "Estado: demo fuera de línea o pendiente de actualización",
    statusConfigError: "Estado: no se pudo cargar la configuración del enlace",
    copyDone: "Enlace copiado",
  },
  en: {
    pageTitle: "SAMP demo | Automatic fish detection",
    pageDescription:
      "Temporary portal to access a Gradio demo for automatic fish detection.",
    langAria: "Switch language",
    langTitle: "Switch language",
    themeAria: "Switch light or dark mode",
    themeTitle: "Switch light or dark mode",
    statusLoading: "Loading demo status…",
    updatedFallback: "not available",
    statusOnline: "Status: demo online",
    statusOffline: "Status: demo offline or pending update",
    statusConfigError: "Status: could not load link configuration",
    copyDone: "Link copied",
  },
};

function getCurrentLanguage() {
  const stored = localStorage.getItem("samp-lang");
  return stored === "en" || stored === "es" ? stored : "es";
}

function applyLanguage(lang) {
  const strings = I18N[lang] || I18N.es;

  document.documentElement.lang = lang;
  document.title = strings.pageTitle;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute("content", strings.pageDescription);

  const langButton = document.getElementById("language-toggle");
  if (langButton) {
    langButton.textContent = lang.toUpperCase();
    langButton.setAttribute("aria-label", strings.langAria);
    langButton.setAttribute("title", strings.langTitle);
  }

  const themeButton = document.getElementById("theme-toggle");
  if (themeButton) {
    themeButton.setAttribute("aria-label", strings.themeAria);
    themeButton.setAttribute("title", strings.themeTitle);
  }

  const floatingActions = document.querySelector(".floating-actions");
  if (floatingActions) {
    const ariaLabel = floatingActions.getAttribute(`data-aria-label-${lang}`);
    if (ariaLabel) floatingActions.setAttribute("aria-label", ariaLabel);
  }

  const translatableElements = document.querySelectorAll("[data-es], [data-en]");
  translatableElements.forEach((element) => {
    const translated = element.getAttribute(`data-${lang}`);
    if (translated !== null) element.textContent = translated;
  });

  const statusEl = document.getElementById("demo-status");
  if (statusEl) {
    if (!statusEl.dataset.state) {
      statusEl.textContent = strings.statusLoading;
    } else if (statusEl.dataset.state === "online") {
      statusEl.textContent = strings.statusOnline;
    } else if (statusEl.dataset.state === "offline") {
      statusEl.textContent = strings.statusOffline;
    } else if (statusEl.dataset.state === "error") {
      statusEl.textContent = strings.statusConfigError;
    }
  }

  const updatedEl = document.getElementById("updated-at");
  if (updatedEl && !updatedEl.dataset.hasValue) {
    updatedEl.textContent = strings.updatedFallback;
  }

  localStorage.setItem("samp-lang", lang);
}

function applyStoredTheme() {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("samp-theme");
  if (storedTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function setupFloatingButtons() {
  const themeButton = document.getElementById("theme-toggle");
  const languageButton = document.getElementById("language-toggle");

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const root = document.documentElement;
      const isDark = root.classList.contains("dark");
      if (isDark) {
        root.classList.remove("dark");
        localStorage.setItem("samp-theme", "light");
      } else {
        root.classList.add("dark");
        localStorage.setItem("samp-theme", "dark");
      }
    });
  }

  if (languageButton) {
    languageButton.addEventListener("click", () => {
      const current = getCurrentLanguage();
      const next = current === "es" ? "en" : "es";
      applyLanguage(next);
    });
  }
}

async function loadDemoConfig() {
  const copyEl = document.getElementById("copy-link");

  try {
    const config = window.SAMP_DEMO_CONFIG;

    if (!config) {
      throw new Error("window.SAMP_DEMO_CONFIG is not defined.");
    }

    window.__demoConfig = config;
    updateStatusText(config);

    if (copyEl) {
      copyEl.addEventListener("click", async () => {
        const demoUrl = config.demo_url || "#";
        if (demoUrl === "#") return;

        await navigator.clipboard.writeText(demoUrl);
        copyEl.textContent = i18n.text("Enlace copiado", "Link copied");

        setTimeout(() => {
          copyEl.textContent = i18n.text("Copiar enlace", "Copy link");
        }, 1600);
      });
    }
  } catch (error) {
    window.__demoConfig = null;
    updateStatusText(null);
    console.error(error);
  }
}

applyStoredTheme();
setupFloatingButtons();
applyLanguage(getCurrentLanguage());
loadDemoConfig();
