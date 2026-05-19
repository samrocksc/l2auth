// Main JavaScript file for the Auth Systems Primer

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  console.log('Auth Systems Primer loaded');

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Any additional initialization can go here
});

// Service worker registration for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
