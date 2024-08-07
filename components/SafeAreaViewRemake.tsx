import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';

const SafeAreaViewRemake: React.FC<any> = (props) => {
    const backgroundColor = useThemeColor({}, 'background');
    return (
        <SafeAreaView
            style={[
                styles.SafeAreaDetect,
                {
                    backgroundColor,
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
