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
// Suggestion Form Functions
    function openSuggestionForm(type) {
        const form = document.getElementById('suggestionForm');
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }
    
    function closeSuggestionForm() {
        document.getElementById('suggestionForm').style.display = 'none';
        document.getElementById('suggestionFormContent').reset();
    }
    
    // Form Submission
    document.getElementById('suggestionFormContent').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your suggestion! We will review it soon.');
        closeSuggestionForm();
    });
    
    // Add hover effects
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'var(--card-bg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'var(--card-bg)';
        });
    });
