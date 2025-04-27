interface DialogElement extends HTMLElement {
    start(dialogs: { speaker: string; text: string }[]): void;
}

window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('app-menu') as Menu;
    const dialog = document.getElementById('game-dialog') as DialogElement;

    const introLines = [
        { speaker: "", text: "Each day presses heavier on my chest," },
        { speaker: "", text: "each whisper cuts a little deeper." },
        { speaker: "", text: "I hide behind smiles," },
        { speaker: "", text: "vanish behind silence." },
        { speaker: "", text: "But when sleep takes hold," },
        { speaker: "", text: "and the world blurs into shadows..." },
        { speaker: "", text: "I step into the one place left untouched." },
        { speaker: "", text: "Dreamscape." }
    ];

    menu.addEventListener('start-dialog', () => {
        console.log('Menu said: start dialog');

        dialog.start(introLines);

        dialog.addEventListener('dialog-finished', () => {
            console.log('Dialog finished! Now launching game.');
            window.location.href = 'game.html'; // NOW launch game
        }, { once: true }); // only run once
    });
});