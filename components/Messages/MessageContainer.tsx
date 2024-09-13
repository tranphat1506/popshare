import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import MessageList from './MessageList';
import MessageChatBox, { MessageChatBoxProps } from './MessageChatBox';

interface MessageContainerProps {
    chatBox?: MessageChatBoxProps;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MessageContainer: React.FC<MessageContainerProps> = ({ chatBox }) => {
    const [currentChatBox, setCurrentChatBox] = useState<MessageChatBoxProps | undefined>(chatBox);
    const translateX = useSharedValue(SCREEN_WIDTH); // Bắt đầu ngoài màn hình (bên trái)
    const handleSetChatBox = (chatBox?: MessageChatBoxProps) => {
        if (!chatBox) {
            // Khi thoát, bắt đầu animation trượt ra ngoài
            translateX.value = withTiming(SCREEN_WIDTH, { duration: 500 }, () => {
                runOnJS(setCurrentChatBox)(undefined); // Sau khi animation kết thúc, mới set về undefined
            });
        } else {
            setCurrentChatBox(chatBox);
        }
    };
    useEffect(() => {
        if (currentChatBox) {
            translateX.value = withTiming(0, { duration: 500 }); // Chuyển từ trái vào giữa màn hình
        }
    }, [currentChatBox]);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <>
            <MessageList handleSetChatBox={handleSetChatBox} />
            {currentChatBox && (
                <Animated.View style={[styles.chatBoxContainer, animatedStyle]}>
                    <MessageChatBox {...currentChatBox} handleExit={() => handleSetChatBox(undefined)} />
                </Animated.View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    chatBoxContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        width: '100%',
        height: '100%',
    },
});

export default MessageContainer;
