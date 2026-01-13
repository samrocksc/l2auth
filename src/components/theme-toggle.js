class ThemeToggle extends HTMLElement {
  connectedCallback() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    this.innerHTML = `
      <button class="theme-toggle" aria-label="Toggle theme">
        ${savedTheme === 'light' ? '◑' : '◐'}
      </button>
    `;

    const toggleButton = this.querySelector('.theme-toggle');
    
    toggleButton.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update button text
      toggleButton.textContent = newTheme === 'light' ? '◑' : '◐';
    });
  }
}

customElements.define('theme-toggle', ThemeToggle);
