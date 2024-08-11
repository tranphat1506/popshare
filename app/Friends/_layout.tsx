import React from 'react';
import FriendsScreen from '.';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Layout = () => {
    return (
        <Stack.Navigator initialRouteName="friends">
            <Stack.Screen name="friends" component={FriendsScreen} />
        </Stack.Navigator>
    );
};

export default Layout;
