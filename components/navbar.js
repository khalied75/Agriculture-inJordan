(function () {
  const PROJECT_NAME = 'Agriculture-inJordan';
  const scriptElement = document.currentScript;
  const explicitBasePath = scriptElement && scriptElement.dataset ? scriptElement.dataset.base : '';

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

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        navbar.style.background = 'rgba(46, 125, 50, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
      } else {
        navbar.style.background = '';
        navbar.style.backdropFilter = '';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', loadNavbar);
})();



