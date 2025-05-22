document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = async (selector, path) => {
    const el = document.querySelector(selector);
    if (el) {
      const res = await fetch(path);
      const html = await res.text();
      el.innerHTML = html;

      if (selector === "#header") {
        initMenuToggle();  // <-- aquí inicializamos el menú hamburguesa
        initDarkMode();
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
});
