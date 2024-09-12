import React from 'react';
import MessagesScreen from './';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
const Layout = () => {
    return (
        <Stack.Navigator initialRouteName="messages">
            <Stack.Screen name="messages" component={MessagesScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default Layout;
