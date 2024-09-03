import { loadAsync, useFonts } from 'expo-font';

const useGlobalFonts = async () => {
    await loadAsync({
        'System-Black': require('../assets/fonts/Lexend-Black.ttf'),
        'System-ExtraBold': require('../assets/fonts/Lexend-ExtraBold.ttf'),
        'System-Bold': require('../assets/fonts/Lexend-Bold.ttf'),
        'System-SemiBold': require('../assets/fonts/Lexend-SemiBold.ttf'),
        'System-Medium': require('../assets/fonts/Lexend-Medium.ttf'),
        'System-Regular': require('../assets/fonts/Lexend-Regular.ttf'),
        'System-Thin': require('../assets/fonts/Lexend-Thin.ttf'),
        'System-Light': require('../assets/fonts/Lexend-Light.ttf'),
        'System-ExtraLight': require('../assets/fonts/Lexend-ExtraLight.ttf'),
    });
    return true;
};
export default useGlobalFonts;
