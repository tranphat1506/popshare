import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppSelector } from '@/redux/hooks/hooks';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, ViewProps } from 'react-native';

const SafeAreaViewRemake: React.FC<{ preventStatusBar?: boolean } & ViewProps> = ({
    preventStatusBar = true,
    ...props
}) => {
    const backgroundColor = useThemeColor({}, 'background');
    const borderColor = useThemeColor({ light: '#ffffff00', dark: '#222' });

    return (
        <SafeAreaView
            style={[
                ...[preventStatusBar ? styles.SafeAreaDetect : {}],
                {
                    backgroundColor,
                    borderColor: borderColor,
                    borderTopWidth: 1,
                },
            ]}
        >
            {props.children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    SafeAreaDetect: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});

export default SafeAreaViewRemake;
