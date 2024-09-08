import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import useGlobalFonts from '@/hooks/useGlobalFonts';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './Home/_layout';
import NotFoundPage from './+not-found';
import { DEFAULT_LINKING, RootStackParamList } from '@/configs/routes.config';
import 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/redux/store';
import BottomNavBar from '@/components/BottomNavBar';
import AuthLayout from '@/app/Auth/_layout';
import { useAppSelector } from '@/redux/hooks/hooks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ISessionToken, LoginSessionManager } from '@/storage/loginSession.storage';
import { login } from '@/redux/auth/reducer';
import * as Splash from 'expo-splash-screen';
import { fetchMyData, FetchUserProfileById } from '@/helpers/fetching';
import { addPeers } from '@/redux/peers/reducer';
Splash.preventAutoHideAsync();
const Tab = createBottomTabNavigator<RootStackParamList>();
export default function Layout() {
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

    const [appIsReady, setAppIsReady] = useState<boolean>(false);
    useEffect(() => {
        const loaded = async () => {
            try {
                await useGlobalFonts();
            } catch (error) {
                console.warn(error);
            } finally {
                setAppIsReady(true);
            }
        };
        loaded();
    }, []);
    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await Splash.hideAsync();
        }
    }, [appIsReady]);
    // return component
    if (!appIsReady) return null;
    return (
        <GestureHandlerRootView onLayout={onLayoutRootView}>
            <NavigationContainer
                // linking={DEFAULT_LINKING}
                independent={true}
            >
                {authState.isLogging ? <MainComponent /> : <AuthLayout />}
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

const MainComponent = () => {
    const dispatch = useDispatch();
    const handleFetchAllFriends = async (friends: string[], session: ISessionToken) => {
        const friendsData = await Promise.all(
            friends.map((userId) => FetchUserProfileById(userId, { token: session.token, rtoken: session.rtoken })),
        );
        return friendsData.map((data) => data?.user).filter((data) => !!data);
    };
    const handleFetchCurrentSession = async () => {
        const session = await LoginSessionManager.getCurrentSession();
        if (session) {
            const userData = await fetchMyData({ token: session.token, rtoken: session.rtoken });

            if (userData) {
                const friends = await handleFetchAllFriends(userData.friends.friendList, session);
                dispatch(addPeers(friends));
                dispatch(login(userData.user));
            }
        }
        return session;
    };
    useLayoutEffect(() => {
        handleFetchCurrentSession();
    }, []);
    return (
        <Tab.Navigator initialRouteName="/" tabBar={(props) => <BottomNavBar {...props} />}>
            <Tab.Screen name="/" component={HomePage} options={{ headerShown: false }} />
            <Tab.Screen name="archive" component={NotFoundPage} />
        </Tab.Navigator>
    );
};
