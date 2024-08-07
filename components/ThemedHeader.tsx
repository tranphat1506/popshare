import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import React from 'react';

type ThemedHeaderProps = React.ComponentProps<typeof Stack.Screen> & {
    lightColor?: string;
    darkColor?: string;
};
const ThemedHeader = ({ lightColor, darkColor, ...headerProps }: ThemedHeaderProps) => {
    const headerColor = useThemeColor({ light: lightColor, dark: darkColor }, 'header');
    const tintColor = useThemeColor({}, 'tint');
    return (
        <Stack.Screen
            {...headerProps}
            options={{
                ...headerProps.options,
                headerTitleStyle: { fontFamily: 'System-Medium' },
                headerTintColor: tintColor,
                headerStyle: { backgroundColor: headerColor },
            }}
        />
    );
};

export default ThemedHeader;
