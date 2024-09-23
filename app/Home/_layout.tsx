import React from 'react';
import HomeScreen from './';

import BottomNavBar from '@/components/BottomNavBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationsStackScreen from '@/app/Notifications/_layout';
import FriendsStackScreen from '@/app/Friends/_layout';
const Tab = createBottomTabNavigator();
const Layout = () => {
    return (
        <Tab.Navigator initialRouteName="home" tabBar={(props) => <BottomNavBar {...props} />}>
            <Tab.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="friends" component={FriendsStackScreen} options={{ headerShown: false }} />
            <Tab.Screen name="notifications" component={NotificationsStackScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default Layout;
