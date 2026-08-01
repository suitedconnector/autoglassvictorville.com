(function() {
  // Create sticky quote button
  function initStickyQuoteBtn() {
    // Check if button already exists
    if (document.getElementById('sticky-quote-btn')) {
      return;
    }

    // Create button element
    const btn = document.createElement('button');
    btn.id = 'sticky-quote-btn';
    btn.className = 'sticky-quote-btn';
    btn.textContent = 'Get Free Quote';

    // Add button to body
    document.body.appendChild(btn);

    // Handle click
    btn.addEventListener('click', function() {
      // Try to find quote form
      const quoteForm = document.getElementById('quoteForm');

      if (quoteForm) {
        // Scroll to form
        quoteForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Focus on first form field
        setTimeout(() => {
          const firstInput = quoteForm.querySelector('input, select, textarea');
          if (firstInput) firstInput.focus();
        }, 500);
      } else {
        // No form on this page, scroll to contact section or call phone
        const contactSection = document.querySelector('[href*="contact"]');
        if (contactSection) {
          window.location.href = '/contact/';
        } else {
          // Fallback: call phone
          window.location.href = 'tel:(760) 555-0101';
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyQuoteBtn);
  } else {
    initStickyQuoteBtn();
  }
})();
