(function () {
  const PROJECT_NAME = 'Agriculture-inJordan';
  const THEME_STORAGE_KEY = 'agri-theme-preference';
  const themeState = {
    toggles: [],
    current: 'light',
    hasExplicitPreference: false,
  };

  const scriptElement = document.currentScript;
  const explicitBasePath = scriptElement && scriptElement.dataset ? scriptElement.dataset.base : '';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.warn('[navbar] Unable to read theme preference from storage:', error);
      return null;
    }
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      themeState.hasExplicitPreference = true;
    } catch (error) {
      console.warn('[navbar] Unable to persist theme preference:', error);
    }
  }

  function prefersDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') {
      themeState.hasExplicitPreference = true;
      return stored;
    }
    return prefersDarkMode() ? 'dark' : 'light';
  }

  function updateToggleState() {
    if (!themeState.toggles.length) {
      return;
    }

    const ariaLabel = themeState.current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    const labelText = themeState.current === 'dark' ? 'Light mode' : 'Dark mode';

    themeState.toggles.forEach((toggle) => {
      toggle.setAttribute('data-theme', themeState.current);
      toggle.setAttribute('aria-label', ariaLabel);
      toggle.setAttribute('title', ariaLabel);
      const label = toggle.querySelector('.theme-toggle__label');
      if (label) {
        label.textContent = labelText;
      }
    });
  }

  function applyTheme(theme) {
    themeState.current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    updateToggleState();
    window.dispatchEvent(new CustomEvent('theme:change', { detail: { theme } }));
  }

  function setTheme(theme, persist = true) {
    if (persist) {
      persistTheme(theme);
    }
    applyTheme(theme);
  }

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      if (!themeState.hasExplicitPreference) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
    }
  }

  function computeBasePath() {
    if (explicitBasePath) {
      return explicitBasePath;
    }
    try {
      const decodedPath = decodeURIComponent(window.location.pathname || '');
      const projectIndex = decodedPath.lastIndexOf(PROJECT_NAME);
      if (projectIndex === -1) {
        return deriveBaseFromSegments(decodedPath);
      }

      let subPath = decodedPath.slice(projectIndex + PROJECT_NAME.length);
      subPath = subPath.replace(/\\/g, '/');
      if (!subPath.length || subPath === '/') {
        return '.';
      }

      if (subPath.endsWith('/')) {
        subPath = subPath.slice(0, -1);
      }

      const segments = subPath.split('/').filter(Boolean);
      if (segments.length && segments[segments.length - 1].includes('.')) {
        segments.pop();
      }

      const depth = segments.length;
      if (depth <= 0) {
        return '.';
      }

      return Array(depth).fill('..').join('/');
    } catch (error) {
      console.error('[navbar] Failed to compute base path:', error);
      return '.';
    }
  }

  function deriveBaseFromSegments(pathname) {
    const normalized = pathname.split(/[?#]/)[0].replace(/\\/g, '/');
    const segments = normalized.split('/').filter(Boolean);
    if (!segments.length) {
      return '.';
    }

    const lastSegment = segments[segments.length - 1];
    const isFile = lastSegment.includes('.');
    const depth = isFile ? segments.length - 1 : segments.length;
    if (depth <= 0) {
      return '.';
    }

    return Array(depth).fill('..').join('/');
  }

  function joinPath(base, relative) {
    if (!relative) {
      return base;
    }

    const cleanedRelative = relative.replace(/^\.\//, '').replace(/^\//, '');

    if (!base || base === '.' || base === './') {
      if (relative.startsWith('./') || relative.startsWith('../') || relative.startsWith('/')) {
        return relative;
      }
      return `./${cleanedRelative}`;
    }

    return `${base.replace(/\/$/, '')}/${cleanedRelative}`;
  }

  async function loadNavbar() {
    const placeholder = document.querySelector('[data-component="navbar"]');
    if (!placeholder) {
      return;
    }

    const basePath = computeBasePath();
    const componentUrl = joinPath(basePath, 'components/navbar.html');

    try {
      const response = await fetch(componentUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const html = await response.text();
      placeholder.insertAdjacentHTML('beforebegin', html);
      placeholder.remove();
      hydrateNavbar(basePath);
    } catch (error) {
      console.error('[navbar] Failed to load navbar component:', error);
    }
  }

  function hydrateNavbar(basePath) {
    const assetElements = document.querySelectorAll('[data-src]');
    assetElements.forEach((element) => {
      const relativePath = element.getAttribute('data-src');
      if (!relativePath) {
        return;
      }
      element.setAttribute('src', joinPath(basePath, relativePath));
      element.removeAttribute('data-src');
    });

    const linkElements = document.querySelectorAll('[data-path]');
    linkElements.forEach((element) => {
      const relativeHref = element.getAttribute('data-path');
      if (!relativeHref) {
        return;
      }
      element.setAttribute('href', joinPath(basePath, relativeHref));
      element.removeAttribute('data-path');
    });

    setupInteractions();
    initializeThemeToggle();
    window.dispatchEvent(new CustomEvent('navbar:ready'));
  }

  function setupInteractions() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    const mobileLinks = document.querySelectorAll('.mobile-links a');
    const navbar = document.querySelector('.navbar');

    if (!hamburger || !mobileMenu || !overlay || !navbar) {
      return;
    }

    const toggleMenu = () => {
      mobileMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    const updateNavbarSurface = () => {
      if (window.scrollY > 100) {
        navbar.style.background = 'var(--navbar-surface)';
        navbar.style.backdropFilter = 'blur(10px)';
      } else {
        navbar.style.background = '';
        navbar.style.backdropFilter = '';
      }
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    window.addEventListener('scroll', updateNavbarSurface);
    window.addEventListener('theme:change', updateNavbarSurface);
    updateNavbarSurface();
  }

  function initializeThemeToggle() {
    const toggles = Array.from(document.querySelectorAll('.theme-toggle'));
    if (!toggles.length) {
      return;
    }

    themeState.toggles = toggles;
    updateToggleState();

    const closeMobileMenuIfOpen = () => {
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('overlay');
      const hamburger = document.getElementById('hamburger');
      if (!mobileMenu || !overlay || !hamburger) {
        return;
      }
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    };

    toggles.forEach((button) => {
      button.addEventListener('click', () => {
        const nextTheme = themeState.current === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        if (button.classList.contains('theme-toggle--mobile')) {
          closeMobileMenuIfOpen();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', loadNavbar);
})();
