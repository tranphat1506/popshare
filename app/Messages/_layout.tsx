import React from 'react';
import MessagesScreen from './';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessageDetailScreen from './MessageDetailScreen';
const Stack = createNativeStackNavigator();
const Layout = () => {
    return (
        <Stack.Navigator initialRouteName="index">
            <Stack.Screen name="index" component={MessagesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="message-detail" component={MessageDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default Layout;
