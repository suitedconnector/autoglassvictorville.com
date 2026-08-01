(function() {
  const CONSENT_KEY = 'cookie-consent';
  const CONSENT_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 year in ms

  function getCookieConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setCookieConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
    localStorage.setItem(CONSENT_KEY + '-date', new Date().getTime());
  }

  function showBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.style.display = 'block';
    }
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }

  function initBanner() {
    const consent = getCookieConsent();

    if (!consent) {
      showBanner();
    } else {
      hideBanner();
    }

    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const resetBtn = document.getElementById('cookie-reset');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        setCookieConsent('accepted');
        hideBanner();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        setCookieConsent('rejected');
        hideBanner();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(CONSENT_KEY + '-date');
        showBanner();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }
})();
