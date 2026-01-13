
class TabsComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="tabs-container">
        <a href="index.html" class="tab-button">Home</a>
        <a href="basic-auth.html" class="tab-button">Basic Auth</a>
        <a href="jwt.html" class="tab-button">JWT</a>
        <a href="oauth2.html" class="tab-button">OAuth 2.0</a>
        <a href="oidc.html" class="tab-button">OIDC</a>
      </div>
    `;
    
    // Highlight the current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const buttons = this.querySelectorAll('.tab-button');
    buttons.forEach(button => {
      if (button.getAttribute('href') === currentPage) {
        button.classList.add('active');
      }
    });
  }
}

customElements.define('tabs-component', TabsComponent);
