export class InputManager {
    private keys: { [key: string]: boolean } = {};

    constructor() {
        window.addEventListener("keydown", (evt) => {
            this.keys[evt.key.toLowerCase()] = true;
        });
        window.addEventListener("keyup", (evt) => {
            this.keys[evt.key.toLowerCase()] = false;
        });
    }

    public isKeyPressed(key: string): boolean {
        return !!this.keys[key.toLowerCase()];
    }
}

export const inputManager = new InputManager();