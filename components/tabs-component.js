class TabsComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="tabs-container">
        <button class="tab-button active" data-tab="basic-auth">Basic Auth</button>
        <button class="tab-button" data-tab="jwt">JWT Headers</button>
        <button class="tab-button" data-tab="oauth2">OAuth 2.0</button>
        <button class="tab-button" data-tab="oidc">OIDC</button>
      </div>
    `;

    this.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and content sections
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding content
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
}

customElements.define('tabs-component', TabsComponent);
