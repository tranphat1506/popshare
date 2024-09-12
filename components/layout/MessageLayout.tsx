import React from 'react';
import SafeAreaViewRemake from '../SafeAreaViewRemake';

const MessageChatBoxLayout = ({
    preventStatusBar,
    style,
    ...props
}: React.ComponentProps<typeof SafeAreaViewRemake>) => {
    return (
        <SafeAreaViewRemake
            {...props}
            preventStatusBar={preventStatusBar}
            style={[
                style,
                {
                    width: '100%',
                    height: '100%',
                },
            ]}
        >
            {props.children}
        </SafeAreaViewRemake>
    );
};

export default MessageChatBoxLayout;
