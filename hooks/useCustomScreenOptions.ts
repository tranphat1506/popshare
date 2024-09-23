import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useThemeColor } from './useThemeColor';
import { NativeStackNavigationOptions } from 'react-native-screens/lib/typescript/native-stack/types';
import { useEffect, useState } from 'react';
type CustomScreenProps = NativeStackNavigationOptions & {
    lightColor?: string;
    darkColor?: string;
};
const useCustomScreenOptions = (props: CustomScreenProps) => {
    const tintColor = useThemeColor({}, 'tint');
    const [options, setOptions] = useState<CustomScreenProps | undefined>(props);
    const headerColor = useThemeColor({ light: options?.lightColor, dark: options?.darkColor }, 'header');
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    useEffect(() => {
        if (options) {
            navigation.setOptions({
                headerTitleStyle: { fontFamily: 'System-Medium' },
                headerTintColor: tintColor,
                headerStyle: { backgroundColor: headerColor },
                ...options,
            });
        }
    }, [options, headerColor]);
    return [options, setOptions] as [
        NativeStackNavigationOptions | undefined,
        React.Dispatch<React.SetStateAction<NativeStackNavigationOptions | undefined>>,
    ];
};

export default useCustomScreenOptions;
