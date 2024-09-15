import React from 'react';
import NotificationsScreen from './';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Layout = () => {
    return (
        <Stack.Navigator initialRouteName="index">
            <Stack.Screen name="index" component={NotificationsScreen} />
        </Stack.Navigator>
    );
};

export default Layout;
