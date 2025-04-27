class Dialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.dialogs = [];
        this.currentIndex = 0;
        this.finishCallback = null;
    }

    connectedCallback() {
        this.render();
    }

    async render() {
        const response = await fetch('/components/dialog/dialog.html');
        const html = await response.text();
        this.shadowRoot.innerHTML = html;
        this.setup();
        this.dispatchEvent(new CustomEvent('dialog-ready', { bubbles: true, composed: true }));
    }

    setup() {
        this.dialogBox = this.shadowRoot.getElementById('dialog');
        this.speakerElement = this.shadowRoot.getElementById('speaker');
        this.textElement = this.shadowRoot.getElementById('text');
        this.nextButton = this.shadowRoot.getElementById('next-btn');

        this.nextButton.addEventListener('click', () => this.advance());
    }

    start(dialogs, onFinish) {
        this.dialogs = dialogs;
        this.currentIndex = 0;
        this.finishCallback = onFinish || null;
        this.dialogBox.style.display = 'flex';
        this.showCurrent();
        console.log("Dialog started with dialogs:", this.dialogs);
    }

    showCurrent() {
        const current = this.dialogs[this.currentIndex];
        this.speakerElement.textContent = current.speaker;

        const fullText = current.text;
        this.textElement.textContent = "";

        let index = 0;

        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        this.typingInterval = setInterval(() => {
            if (index < fullText.length) {
                this.textElement.textContent += fullText.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
            }
        }, 30);
    }

    advance() {
        this.currentIndex++;
        if (this.currentIndex < this.dialogs.length) {
            this.showCurrent();
        } else {
            this.dialogBox.style.display = 'none';
            if (this.finishCallback) {
                this.finishCallback();
            }
            this.dispatchEvent(new CustomEvent('dialog-finished', { bubbles: true, composed: true }));
        }
    }
}

customElements.define('app-dialog', Dialog);