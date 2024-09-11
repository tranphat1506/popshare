import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MessageList from './MessageList';
import MessageChatBox, { MessageChatBoxProps } from './MessageChatBox';

interface MessageContainerProps {
    chatBox?: MessageChatBoxProps;
}
const MessageContainer: React.FC<MessageContainerProps> = ({ chatBox }) => {
    const [currentChatBox, setCurrentChatBox] = useState<MessageChatBoxProps | undefined>(chatBox);
    const handleSetChatBox = (chatBox?: MessageChatBoxProps) => {
        setCurrentChatBox(chatBox);
    };
    return (
        <>
            <MessageList handleSetChatBox={handleSetChatBox} />
            {currentChatBox && (
                <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, width: '100%', height: '100%' }}>
                    <MessageChatBox {...currentChatBox} handleExit={handleSetChatBox} />
                </View>
            )}
        </>
    );
};

export default MessageContainer;
