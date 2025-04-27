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

        this.setupBlink();
    }

    setupBlink() {
        const playButton = this.shadowRoot.getElementById('play');
        const topLid = this.shadowRoot.querySelector('.eyelid.top');
        const bottomLid = this.shadowRoot.querySelector('.eyelid.bottom');

        if (!playButton || !topLid || !bottomLid) {
            console.error("Menu elements not found");
            return;
        }

        playButton.addEventListener('click', (e) => {
            e.preventDefault();

            topLid.classList.add('closed');
            bottomLid.classList.add('closed');

            setTimeout(() => {
                topLid.classList.remove('closed');
                bottomLid.classList.remove('closed');
            }, 300);

            setTimeout(() => {
                topLid.classList.add('closed');
                bottomLid.classList.add('closed');
            }, 1000);

            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('start-dialog', { bubbles: true, composed: true }));
            }, 1800);
        });
    }
}

customElements.define('app-menu', Menu);
