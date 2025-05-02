type Action = "forward" | "backward" | "left" | "right" | "jump";

type KeyMappings = Record<Action, string>;

const KeyLayouts: Record<"QWERTY" | "AZERTY", KeyMappings> = {
    QWERTY: {
        forward: "w",
        backward: "s",
        left: "a",
        right: "d",
        jump: " "
    },
    AZERTY: {
        forward: "z", 
        backward: "s",
        left: "q", 
        right: "d",
        jump: " "
    }
};

export class InputManager {
    private keys: { [key: string]: boolean } = {};
    private currentLayout: "QWERTY" | "AZERTY" = "QWERTY";

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

    public isActionPressed(action: Action): boolean {
        const key = KeyLayouts[this.currentLayout][action];
        return this.isKeyPressed(key);
    }

    public setLayout(layout: "QWERTY" | "AZERTY") {
        if (KeyLayouts[layout]) {
            this.currentLayout = layout;
        }
    }

    public getLayout(): "QWERTY" | "AZERTY" {
        return this.currentLayout;
    }
}

export const inputManager = new InputManager();