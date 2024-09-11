import React from 'react';
import HomeScreen from './';

import BottomNavBar from '@/components/BottomNavBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Layout = () => {
    return (
        <Tab.Navigator initialRouteName="home" tabBar={(props) => <BottomNavBar {...props} />}>
            <Tab.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default Layout;
