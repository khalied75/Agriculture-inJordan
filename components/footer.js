(function () {
  const PROJECT_NAME = 'Agriculture-inJordan';
  const scriptElement = document.currentScript;
  const explicitBasePath =
    scriptElement && scriptElement.dataset ? (scriptElement.dataset.base || '') : '';

  function computeBasePath() {
    if (explicitBasePath) return explicitBasePath;

    try {
      const decodedPath = decodeURIComponent(window.location.pathname || '');
      const projectIndex = decodedPath.lastIndexOf(PROJECT_NAME);

      if (projectIndex === -1) return deriveBaseFromSegments(decodedPath);

      let subPath = decodedPath
        .slice(projectIndex + PROJECT_NAME.length)
        .replace(/\\/g, '/');

      if (!subPath.length || subPath === '/') return '.';
      if (subPath.endsWith('/')) subPath = subPath.slice(0, -1);

      const segments = subPath.split('/').filter(Boolean);
      if (segments.length && segments[segments.length - 1].includes('.')) segments.pop();

      const depth = segments.length;
      return depth > 0 ? Array(depth).fill('..').join('/') : '.';
    } catch (error) {
      console.error('[footer] Failed to compute base path:', error);
      return '.';
    }
  }

  function deriveBaseFromSegments(pathname) {
    const normalized = (pathname || '').split(/[?#]/)[0].replace(/\\/g, '/');
    const segments = normalized.split('/').filter(Boolean);
    if (!segments.length) return '.';

    const lastSegment = segments[segments.length - 1];
    const isFile = lastSegment.includes('.');
    const depth = isFile ? segments.length - 1 : segments.length;
    return depth > 0 ? Array(depth).fill('..').join('/') : '.';
  }

  function joinPath(base, relative) {
    if (!relative) return base || '.';

    // نظّف المسار النسبي من ./ والبدايات المائلة
    const rel = relative.replace(/^\.\//, '').replace(/^\/+/, '');

    // في حال القاعدة فارغة أو نقطة، احترم المسارات النسبية/المطلقة المعطاة
    if (!base || base === '.' || base === './') {
      if (/^(\.\/|\.\.\/|\/)/.test(relative)) return relative;
      return './' + rel;
    }

    const trimmedBase = base.replace(/\/+$/, '');
    return trimmedBase + '/' + rel;
  }

  async function loadFooter() {
    const placeholder = document.querySelector('[data-component="footer"]');
    if (!placeholder) return;

    const basePath = computeBasePath();
    const componentUrl = joinPath(basePath, 'components/footer.html');

    try {
      const response = await fetch(componentUrl, { credentials: 'same-origin' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} while fetching ${componentUrl}`);
      }

      const html = await response.text();
      placeholder.insertAdjacentHTML('beforebegin', html);
      const footerElement = placeholder.previousElementSibling;
      placeholder.remove();
      hydrateFooter(basePath, footerElement);
    } catch (error) {
      console.error('[footer] Failed to load footer component:', error);
    }
  }

  function hydrateFooter(basePath, root) {
    if (!root) {
      root = document.querySelector('[data-footer-root]');
      if (!root) return;
    }

    const yearElement = root.querySelector('[data-footer-year]');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    const linkElements = root.querySelectorAll('[data-path]');
    linkElements.forEach((el) => {
      const relativeHref = el.getAttribute('data-path');
      if (!relativeHref) return;
      el.setAttribute('href', joinPath(basePath, relativeHref));
      el.removeAttribute('data-path');
    });
  }

  document.addEventListener('DOMContentLoaded', loadFooter);
})();