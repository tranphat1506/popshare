import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useThemeColor } from './useThemeColor';
import { NativeStackNavigationOptions } from 'react-native-screens/lib/typescript/native-stack/types';
import { useEffect } from 'react';

type CustomScreenProps = NativeStackNavigationOptions & {
    lightColor?: string;
    darkColor?: string;
};
const useCustomScreenOptions = ({ lightColor, darkColor, ...optionsProps }: CustomScreenProps) => {
    const headerColor = useThemeColor({ light: lightColor, dark: darkColor }, 'header');
    const tintColor = useThemeColor({}, 'tint');
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerTitleStyle: { fontFamily: 'System-Medium' },
            headerTintColor: tintColor,
            headerStyle: { backgroundColor: headerColor },
            ...optionsProps,
        });
    }, [headerColor, tintColor]);
};

export default useCustomScreenOptions;
