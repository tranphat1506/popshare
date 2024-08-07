import React from 'react';
import DevicesScreen from './';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Layout = () => {
    return (
        <Stack.Navigator initialRouteName="devices">
            <Stack.Screen name="devices" component={DevicesScreen} />
        </Stack.Navigator>
    );
};

export default Layout;
