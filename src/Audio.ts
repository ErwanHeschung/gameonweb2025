import * as BABYLON from "@babylonjs/core";

export async function addMusic(scene: BABYLON.Scene): Promise<void> {
    const audioEngine = await BABYLON.CreateAudioEngineAsync();
    await audioEngine.unlockAsync();

    const music = await BABYLON.CreateSoundAsync("BackgroundMusic", "/music/background.mp3", {
        loop: true,
        autoplay: true,
        volume: 0.5
    });

    music.play();
}