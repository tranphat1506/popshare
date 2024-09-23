import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

interface SoundState {
    isLoading: boolean;
    data: Audio.SoundObject;
    handleAsyncPause: () => Promise<void>;
    handleAsyncPlay: () => Promise<void>;
    handleAsyncPlayFromStart: () => Promise<void>;
}
export const SoundCollections = {
    NotificationSound: require('@/assets/sounds/notification_sound.mp3'),
};
const usePlaySound = (sound: keyof typeof SoundCollections) => {
    const [soundState, setSoundState] = useState<SoundState>();

    useEffect(() => {
        handleLoadingSound();
    }, [sound]);

    const handlePlaySound = (sound: Audio.SoundObject) => async () => {
        if (sound.status.isLoaded) await sound.sound.playAsync();
    };
    const handlePlayFromStart = (sound: Audio.SoundObject) => async () => {
        if (sound.status.isLoaded) await sound.sound.playFromPositionAsync(0);
    };
    const handlePauseSound = (sound: Audio.SoundObject) => async () => {
        if (sound.status.isLoaded) await sound.sound.pauseAsync();
    };
    const handleLoadingSound = async () => {
        const soundObject = await Audio.Sound.createAsync(SoundCollections[sound]);
        setSoundState({
            isLoading: soundObject.status.isLoaded,
            data: soundObject,
            handleAsyncPause: handlePauseSound(soundObject),
            handleAsyncPlay: handlePlaySound(soundObject),
            handleAsyncPlayFromStart: handlePlayFromStart(soundObject),
        });
    };
    return soundState;
};

export default usePlaySound;
