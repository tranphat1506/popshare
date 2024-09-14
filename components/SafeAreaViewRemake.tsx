import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View, ViewProps } from 'react-native';

const SafeAreaViewRemake: React.FC<
    { preventStatusBar?: boolean; lightColor?: string; darkColor?: string; enableSafeArea?: boolean } & ViewProps
> = ({ preventStatusBar = true, enableSafeArea = true, ...props }) => {
    const backgroundColor = useThemeColor({ light: props.lightColor, dark: props.darkColor }, 'background');
    return (
        <>
            <StatusBar animated={true} backgroundColor={backgroundColor} />
            {enableSafeArea && (
                <SafeAreaView
                    style={[
                        ...[preventStatusBar ? styles.SafeAreaDetect : {}],
                        props.style,
                        { backgroundColor: backgroundColor },
                    ]}
                >
                    {props.children}
                </SafeAreaView>
            )}
            {!enableSafeArea && (
                <View
                    style={[
                        ...[preventStatusBar ? styles.SafeAreaDetect : {}],
                        props.style,
                        { backgroundColor: backgroundColor },
                    ]}
                >
                    {props.children}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    SafeAreaDetect: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});

export default SafeAreaViewRemake;
