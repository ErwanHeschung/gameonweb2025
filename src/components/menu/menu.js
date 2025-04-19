class Menu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    async render() {
        const response = await fetch('/components/menu/menu.html');
        const html = await response.text();
        this.shadowRoot.innerHTML = html;
    }
}

customElements.define('app-menu', Menu);
