import React from 'react';
import SafeAreaViewRemake from '../SafeAreaViewRemake';
import { View } from 'react-native';

const MessageChatBoxLayout = ({
    preventStatusBar,
    style,
    ...props
}: React.ComponentProps<typeof SafeAreaViewRemake>) => {
    return (
        <SafeAreaViewRemake preventStatusBar={preventStatusBar} enableSafeArea={true}>
            <View
                {...props}
                style={[
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

export default MessageChatBoxLayout;
