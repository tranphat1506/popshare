import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View, ViewProps } from 'react-native';

const SafeAreaViewRemake: React.FC<
    { preventStatusBar?: boolean; lightColor?: string; darkColor?: string } & ViewProps
> = ({ preventStatusBar = true, ...props }) => {
    const backgroundColor = useThemeColor({ light: props.lightColor, dark: props.darkColor }, 'background');
    return (
        <>
            <StatusBar animated={true} backgroundColor={backgroundColor} />
            <SafeAreaView
                style={[
                    ...[preventStatusBar ? styles.SafeAreaDetect : {}],
                    props.style,
                    { backgroundColor: backgroundColor },
                ]}
            >
                {props.children}
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    SafeAreaDetect: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});

export default SafeAreaViewRemake;
