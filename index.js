(function () {
  function handleAnchorClick(event) {
    const targetSelector = this.getAttribute('href');
    if (!targetSelector || targetSelector === '#') {
      return;
    }

    if (!targetSelector.startsWith('#')) {
      return;
    }

    event.preventDefault();
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function bindSmoothScroll(anchor) {
    if (!anchor || anchor.dataset.smoothScrollBound === 'true') {
      return;
    }
    anchor.addEventListener('click', handleAnchorClick);
    anchor.dataset.smoothScrollBound = 'true';
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(bindSmoothScroll);
  }

  document.addEventListener('DOMContentLoaded', setupSmoothScroll);
  window.addEventListener('navbar:ready', setupSmoothScroll);
})();
