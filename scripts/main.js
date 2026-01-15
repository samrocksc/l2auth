// Main JavaScript file for the Auth Systems Primer

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  console.log('Auth Systems Primer loaded');

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Any additional initialization can go here

  // Initialize modal functionality
  initMarkdownModal();
});

// Service worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

function initMarkdownModal() {
  const modal = document.getElementById('markdown-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const markdownContent = document.getElementById('markdown-content');
  const modalTitle = document.getElementById('modal-title');

  // Debug: Check if wc-markdown is available
  console.log('Markdown content element:', markdownContent);
  if (markdownContent) {
    console.log('wc-markdown custom element defined:', customElements.get('wc-markdown'));
  }

  // Close modal when close button is clicked
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle Try Me Out button clicks
  document.addEventListener('click', async (e) => {
    if (e.target.closest('[data-try-me-out]')) {
      const button = e.target.closest('[data-try-me-out]');
      const endpointType = button.getAttribute('data-try-me-out');
      const title = button.textContent.replace('Try Me Out: ', '');

      try {
        // Set modal title and content
        modalTitle.textContent = title;
        console.log('Loading markdown file:', `/assets/markdown/${endpointType}.md`);

        markdownContent.setAttribute('src', `/assets/markdown/${endpointType}.md`);

        // Show modal
        modal.style.display = 'flex';
      } catch (error) {
        console.error('Error loading markdown:', error);
        modalTitle.textContent = title;
        markdownContent.innerHTML = '# Error\n\nFailed to load endpoint information.';
        modal.style.display = 'flex';
      }
    }
  });
}
