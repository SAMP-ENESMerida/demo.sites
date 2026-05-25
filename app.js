  es: {
    pageDescription:
    langAria: "Cambiar idioma",
    themeAria: "Cambiar modo claro u oscuro",
    statusLoading: "Cargando estado de la demo…",
    statusOnline: "Estado: demo en línea",
    statusConfigError: "Estado: no se pudo cargar la configuración del enlace",
  },
    pageTitle: "SAMP demo | Automatic fish detection",
      "Temporary portal to access a Gradio demo for automatic fish detection.",
    langTitle: "Switch language",
    themeTitle: "Switch light or dark mode",
    updatedFallback: "not available",
    statusOffline: "Status: demo offline or pending update",
    copyDone: "Link copied",
};
function getCurrentLanguage() {
  return stored === "en" || stored === "es" ? stored : "es";

  const strings = I18N[lang] || I18N.es;
  document.documentElement.lang = lang;

  if (descriptionMeta) descriptionMeta.setAttribute("content", strings.pageDescription);
  const langButton = document.getElementById("language-toggle");
    langButton.textContent = lang.toUpperCase();
    langButton.setAttribute("title", strings.langTitle);

  if (themeButton) {
    themeButton.setAttribute("title", strings.themeTitle);

    element.innerHTML = element.getAttribute(`data-${lang}`) || "";

  if (statusEl) {
      statusEl.textContent = strings.statusLoading;
      statusEl.textContent = strings.statusOnline;
      statusEl.textContent = strings.statusOffline;
      statusEl.textContent = strings.statusConfigError;
  }
  const updatedEl = document.getElementById("updated-at");
    updatedEl.textContent = strings.updatedFallback;

}
function applyStoredTheme() {
  const storedTheme = localStorage.getItem("samp-theme");
    root.classList.add("dark");
    root.classList.remove("dark");
}
function setupFloatingButtons() {
  const languageButton = document.getElementById("language-toggle");
  if (themeButton) {
      const root = document.documentElement;
      if (isDark) {
        localStorage.setItem("samp-theme", "light");
        root.classList.add("dark");
      }
  }
  if (languageButton) {
      const current = getCurrentLanguage();
      applyLanguage(next);
  }

async function loadDemoConfig() {
  const statusEl = document.getElementById("demo-status");
  const linkEl = document.getElementById("demo-link");
  updatedEl.textContent = config.updated_at || I18N[getCurrentLanguage()].updatedFallback;
  if (config.updated_at) updatedEl.dataset.hasValue = "true";
  const copyEl = document.getElementById("copy-link");

  try {
    const response = await fetch("demo-config.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load demo-config.json: ${response.status}`);

    const config = await response.json();
    const demoUrl = config.demo_url || "#";
    const status = config.status || "offline";

    linkEl.href = demoUrl;
    updatedEl.textContent = config.updated_at || "sin registro";

    if (status === "online" && demoUrl !== "#") {
      statusEl.dataset.state = "online";
      statusEl.textContent = I18N[getCurrentLanguage()].statusOnline;
      statusEl.style.background = "rgba(0, 245, 212, 0.18)";
    } else {
      statusEl.dataset.state = "offline";
      statusEl.textContent = I18N[getCurrentLanguage()].statusOffline;
      statusEl.style.background = "rgba(255, 255, 255, 0.13)";
    }

    copyEl.addEventListener("click", async () => {
      if (demoUrl === "#") return;
      await navigator.clipboard.writeText(demoUrl);
      copyEl.textContent = I18N[getCurrentLanguage()].copyDone;
      setTimeout(() => applyLanguage(getCurrentLanguage()), 1600);
    });
  } catch (error) {
    statusEl.dataset.state = "error";
    statusEl.textContent = I18N[getCurrentLanguage()].statusConfigError;
    linkEl.href = "#";
    console.error(error);
  }
}

applyStoredTheme();
setupFloatingButtons();
applyLanguage(getCurrentLanguage());
loadDemoConfig();
