import React from 'react';
import { View } from 'native-base';
import SafeAreaViewRemake from '../SafeAreaViewRemake';
import { ViewProps } from 'react-native';

const DefaultLayout = ({ preventStatusBar, ...props }: ViewProps & React.ComponentProps<typeof SafeAreaViewRemake>) => {
    return (
        <SafeAreaViewRemake preventStatusBar={preventStatusBar}>
            <View
                {...props}
                style={[
                    props.style,
                    {
                        width: '100%',
                        height: '100%',
                    },
                ]}
            >
                {props.children}
            </View>
        </SafeAreaViewRemake>
    );
};

export default DefaultLayout;
