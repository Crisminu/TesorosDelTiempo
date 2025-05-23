document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = async (selector, path) => {
    const el = document.querySelector(selector);
    if (el) {
      const res = await fetch(path);
      const html = await res.text();
      el.innerHTML = html;

      if (selector === "#header") {
        initMenuToggle();  // Inicializa menú hamburguesa
        initDarkMode();
        initLanguageSelector();  // <-- Aquí se llama a la función que definimos abajo
      }
    }
  };

  loadComponent("#header", "components/header.html");
  loadComponent("#footer", "components/footer.html");

  function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
      });
    }
  }

  function initDarkMode() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const body = document.body;
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');

    function applyDarkMode(enabled) {
      if (enabled) {
        body.classList.add('dark');
        document.documentElement.classList.add('dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    }

    let darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting === null) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyDarkMode(systemPrefersDark);
      localStorage.setItem('darkMode', systemPrefersDark ? 'enabled' : 'disabled');
    } else {
      applyDarkMode(darkModeSetting === 'enabled');
    }

    toggleBtn.addEventListener('click', () => {
      const enabled = body.classList.contains('dark');
      applyDarkMode(!enabled);
      localStorage.setItem('darkMode', !enabled ? 'enabled' : 'disabled');
    });
  }

  async function initLanguageSelector() {
    const selector = document.getElementById('language-selector');

    // Detectar si estamos en raíz o en carpeta components
    // Esto es para ajustar la ruta relativa al archivo JSON de traducciones
    const basePath = window.location.pathname.startsWith('/components/') ? '../' : '';

    if (!selector && !document.querySelector('[data-i18n]')) {
      // No hay selector ni elementos a traducir: salir
      return;
    }

    const savedLang = localStorage.getItem('language') || 'es';
    if (selector) selector.value = savedLang;

    async function loadTranslations(lang) {
      try {
        const response = await fetch(`${basePath}locales/${lang}.json`);
        if (!response.ok) throw new Error('No se pudo cargar el archivo de traducción');
        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
          const keys = el.getAttribute('data-i18n').split('.');
          let text = translations;
          for (const key of keys) {
            if (text[key] === undefined) {
              text = null;
              break;
            }
            text = text[key];
          }
          if (text) el.textContent = text;
        });
      } catch (error) {
        console.error(error);
      }
    }

    await loadTranslations(savedLang);

    if (selector) {
      selector.addEventListener('change', async () => {
        const selectedLang = selector.value;
        localStorage.setItem('language', selectedLang);
        await loadTranslations(selectedLang);
      });
    }
  }
});
