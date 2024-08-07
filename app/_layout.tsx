import { useMemo } from 'react';
import SplashScreen from '@/components/common/SplashScreen';
import useGlobalFonts from '@/hooks/useGlobalFonts';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './Home/_layout';
import NotFoundPage from './+not-found';
import { DEFAULT_LINKING } from '@/configs/routes.config';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import BottomNavBar from '@/components/BottomNavBar';
const Tab = createBottomTabNavigator();
export default function Layout() {
    // Loading list
    const [loadedFonts] = useGlobalFonts();
    const loadingList = useMemo(() => [loadedFonts], [loadedFonts]);

    // Loading status
    const loaded = useMemo(() => {
        return loadingList.every((status) => status === true);
    }, [loadingList]);

    // return component
    if (!loaded) return <SplashScreen onlyIcon={!loadedFonts} />;
    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <NavigationContainer
                    linking={DEFAULT_LINKING}
                    independent={true}
                    fallback={<SplashScreen onlyIcon={!loadedFonts} />}
                >
                    <Tab.Navigator initialRouteName="/" tabBar={(props) => <BottomNavBar {...props} />}>
                        <Tab.Screen name="/" component={HomePage} options={{ headerShown: false }} />
                        <Tab.Screen name="archive" component={NotFoundPage} />
                    </Tab.Navigator>
                </NavigationContainer>
            </NativeBaseProvider>
        </Provider>
    );
}
