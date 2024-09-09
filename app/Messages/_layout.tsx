import React from 'react';
import NotificationsScreen from './';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Layout = () => {
    return (
        <Stack.Navigator initialRouteName="notifications">
            <Stack.Screen name="notifications" component={NotificationsScreen} />
        </Stack.Navigator>
    );
};

export default Layout;
