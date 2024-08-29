import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import Test from './Test';

const Stack = createNativeStackNavigator();
const Layout = () => {
    return (
        <Stack.Navigator initialRouteName="signIn">
            <Stack.Screen name="signIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="signUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="forgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
    );
};

export default Layout;
