import { useMemo } from 'react';
import SplashScreen from '@/components/common/SplashScreen';
import useGlobalFonts from '@/hooks/useGlobalFonts';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './Home/_layout';
import NotFoundPage from './+not-found';
import { DEFAULT_LINKING, RootStackParamList } from '@/configs/routes.config';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import BottomNavBar from '@/components/BottomNavBar';
import AuthLayout from '@/app/Auth/_layout';
import { View } from 'react-native';
import { useAppSelector } from '@/redux/hooks/hooks';
const Tab = createBottomTabNavigator<RootStackParamList>();
export default function Layout() {
    // Loading list
    const [loadedFonts] = useGlobalFonts();
    const loadingList = useMemo(() => [loadedFonts], [loadedFonts]);
    // Loading status
    const loaded = useMemo(() => {
        return loadingList.every((status) => status === true);
    }, [loadingList]);
    // return component
    if (!loaded)
        return (
            <Provider store={store}>
                <SplashScreen onlyIcon={!loadedFonts} />
            </Provider>
        );
    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <AppComponent />
            </NativeBaseProvider>
        </Provider>
    );
}
const AppComponent = () => {
    const authState = useAppSelector((state) => state.auth);
    return (
        <NavigationContainer
            // linking={DEFAULT_LINKING}
            independent={true}
        >
            {authState.isLogging ? (
                <Tab.Navigator initialRouteName="/" tabBar={(props) => <BottomNavBar {...props} />}>
                    <Tab.Screen name="/" component={HomePage} options={{ headerShown: false }} />
                    <Tab.Screen name="archive" component={NotFoundPage} />
                </Tab.Navigator>
            ) : (
                <AuthLayout />
            )}
        </NavigationContainer>
    );
};
