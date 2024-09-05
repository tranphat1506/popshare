import React from 'react';
import HomeScreen from './';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationsStackScreen from '../Notifications';
import FriendsStackScreen from '../Friends';
import NotFound from '../+not-found';
import useInitSocket from '@/hooks/socket.io/useInitSocket';
const Stack = createNativeStackNavigator();
const Layout = () => {
    const initSocket = useInitSocket();
    return (
        <Stack.Navigator initialRouteName="home">
            <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false, title: 'Home' }} />
            <Stack.Screen name="notifications" component={NotificationsStackScreen} />
            <Stack.Screen name="friends" component={FriendsStackScreen} />
            <Stack.Screen name="NotFound" component={NotFound} />
        </Stack.Navigator>
    );
};

export default Layout;
