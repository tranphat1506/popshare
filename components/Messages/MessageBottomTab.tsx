import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputContentSizeChangeEventData, View } from 'react-native';
import { ThemedView } from '../ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon, KeyboardAvoidingView } from 'native-base';
import { Feather, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { sendMessage } from '@/helpers/fetching';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { updateTempMessageWithTempId, updateTheNewestMessage, updateTheNewestMessages } from '@/redux/chatRoom/reducer';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
import _ from 'lodash';
import { useEmitOnTyping } from '@/hooks/socket.io/useOnActionOnChatRoom';
import { IMessageDetail, IMessageTypeTypes } from '@/redux/chatRoom/messages.interface';

const DEFAULT_INPUT_HEIGHT = 30;
const DEFAULT_TEXT_HEIGHT = 20;
const MAX_LINES_INPUT_TEXT = 6;
interface MessageBottomTabProps {
    currentUser?: ICurrentUserDetail;
    roomId?: string;
}
const handleShowTempMessage = (currentUser: ICurrentUserDetail, messages: ICreateMessagePayload[]) => {
    const newMessages: IMessageDetail[] = [];
    for (const message of messages) {
        const tempId = `temp::${Date.now()}::${Math.random()}`;
        // Assign temp id to message
        message.tempId = tempId;
        newMessages.push({
            _id: tempId,
            roomId: message.roomId,
            senderId: currentUser.userId,
            messageType: message.messageType,
            content: message.content,
            mediaUrl: message.mediaUrl,
            reactions: [],
            seenBy: [currentUser.userId],
            repliedTo: message.repliedTo,
            createdAt: Date.now(),
            isEveryoneRecalled: false,
            isSelfRecalled: false,
            tempId: tempId,
            isTemp: true,
        });
    }

    return {
        tempMessages: newMessages,
        messages: messages,
    };
};
export interface ISendMessagePayload {
    roomId: string;
    messages: ICreateMessagePayload[];
    socketId: string;
}
export interface ICreateMessagePayload {
    roomId: string;
    messageType: IMessageTypeTypes;
    senderId: string;
    content?: string;
    mediaUrl?: string;
    repliedTo?: string; // ID của tin nhắn mà tin nhắn này đang trả lời
    tempId?: string;
}
const handleSendMessages = async (messages: ICreateMessagePayload[], roomId?: string, socketId?: string) => {
    if (messages.length === 0 || !roomId || !socketId) return;
    const session = await LoginSessionManager.getCurrentSession();
    if (!session) return;
    const newMessages: ICreateMessagePayload[] = [];
    for (const message of messages) {
        switch (message.messageType) {
            case 'text':
                const trimMessage = message.content?.trim();
                if (!trimMessage || trimMessage === '') break;
                const messagePayload: ICreateMessagePayload = {
                    ...message,
                    messageType: 'text',
                    content: trimMessage,
                    roomId: message.roomId,
                    senderId: message.senderId,
                    tempId: message.tempId,
                };
                newMessages.push(messagePayload);
                break;
            default:
                console.error(`NOT SUPPORT MESSAGE TYPE ${message.messageType} yet!`);
                break;
        }
    }
    if (messages.length === 0) return;
    const sendPayload: ISendMessagePayload = {
        messages: newMessages,
        roomId,
        socketId,
    };
    const response = await sendMessage(
        {
            token: session.token,
            rtoken: session.rtoken,
        },
        sendPayload,
    );
    if (!response) {
        // logic when sending message failed
        return;
    }
    return updateTempMessageWithTempId({
        replaceMessages: response.messages,
    });
};
const MessageBottomTab: React.FC<MessageBottomTabProps> = ({ currentUser, roomId }) => {
    const [action, setAction] = useEmitOnTyping(roomId);
    const handleFocusedInput = () => {
        setAction('text');
    };
    const handleClearAllAction = () => {
        setAction('stop');
    };
    const dispatch = useAppDispatch();
    const [inputHeight, setInputHeight] = useState<{
        height: number;
        isMultiline: boolean;
    }>({ height: DEFAULT_INPUT_HEIGHT, isMultiline: false });
    const handleChangeMessage = (text: string) => {
        setTextMessage(text);
    };
    const socketId = useAppSelector((state) => state.socket.socketId);
    const [textMessage, setTextMessage] = useState<string>('');
    const messagesBatch = useRef<ICreateMessagePayload[]>([]);
    const batchInterval = 100; // Khoảng thời gian batch (500ms)
    const isBatching = useRef(false);
    // Xử lý thay đổi chiều cao của TextInput
    const handleContentSizeChange = (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        const { height } = e.nativeEvent.contentSize;
        if (height > DEFAULT_INPUT_HEIGHT && height - DEFAULT_TEXT_HEIGHT * (MAX_LINES_INPUT_TEXT + 1) < 0) {
            setInputHeight({ height, isMultiline: true }); // Truyền chiều cao mới cho cha
        } else if (height - DEFAULT_TEXT_HEIGHT * (MAX_LINES_INPUT_TEXT + 1) >= 0) {
            setInputHeight(inputHeight);
        } else {
            setInputHeight({ height: DEFAULT_INPUT_HEIGHT, isMultiline: false });
        }
    };
    const handleClickSendMessage = useCallback(
        (message: ICreateMessagePayload) => {
            isBatching.current = false;

            const sendMessages = async () => {
                isBatching.current = false;
                if (!currentUser || !roomId || messagesBatch.current.length === 0) return;

                const batchMessages = [...messagesBatch.current];
                messagesBatch.current = []; // reset queue

                // Handle showing temporary messages
                const { messages, tempMessages } = handleShowTempMessage(currentUser, batchMessages);
                dispatch(updateTheNewestMessages({ messages: tempMessages, currentUserId: currentUser.userId }));

                // Send the messages to the server
                try {
                    const sendAction = await handleSendMessages(messages, roomId, socketId);
                    if (sendAction) {
                        dispatch(sendAction);
                    }
                } catch (error) {
                    // Handle failure by possibly retrying or alerting the user
                    console.error('Failed to send messages', error);
                    messagesBatch.current.push(...batchMessages); // re-add unsent messages to queue
                }
            };

            messagesBatch.current.push(message);

            if (messagesBatch.current.length >= 10) {
                // If batch reaches 10, send immediately
                sendMessages();
            } else if (!isBatching.current) {
                // Start batching if not already in progress
                isBatching.current = true;

                setTimeout(() => {
                    sendMessages();
                }, batchInterval);
            }
        },
        [currentUser, roomId, socketId, dispatch],
    );

    return (
        <ThemedView
            style={{
                flexDirection: 'row',
                display: 'flex',
                alignItems: inputHeight.isMultiline ? 'flex-end' : 'center',
                paddingHorizontal: 16,
                paddingVertical: 10,
                columnGap: 16,
            }}
        >
            {/* Top */}
            <View
                className="flex flex-row gap-x-4"
                style={{
                    alignItems: inputHeight.isMultiline ? 'flex-end' : 'center',
                }}
            >
                <TouchableOpacity activeOpacity={0.6}>
                    <Icon as={Fontisto} name="paperclip" size={'lg'} />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 1,
                    borderRadius: inputHeight.height > DEFAULT_INPUT_HEIGHT ? 10 : 99999,
                    paddingVertical: 10,
                    alignItems: inputHeight.isMultiline ? 'flex-end' : 'center',
                }}
                className="py-1 px-4 bg-[#eee] dark:bg-[#111] flex flex-row items-center"
            >
                <TextInput
                    onFocus={handleFocusedInput}
                    onBlur={handleClearAllAction}
                    editable
                    multiline
                    numberOfLines={4}
                    onChangeText={handleChangeMessage}
                    value={textMessage}
                    placeholder="Aa"
                    placeholderTextColor={'#777'}
                    onContentSizeChange={handleContentSizeChange}
                    className="text-black dark:text-white"
                    style={{
                        fontSize: 16,
                        lineHeight: 20,
                        height: inputHeight.height,
                        minHeight: DEFAULT_INPUT_HEIGHT,
                        fontFamily: 'System-Regular',
                        paddingRight: 10,
                        minWidth: 100,
                        flex: 1,
                    }}
                />
                {!textMessage && (
                    <TouchableOpacity activeOpacity={0.6} style={{ padding: 2 }}>
                        <Icon as={MaterialCommunityIcons} name="sticker-circle-outline" size={'lg'} />
                    </TouchableOpacity>
                )}
                {textMessage && (
                    <TouchableOpacity activeOpacity={0.6} style={{ padding: 2 }}>
                        <Icon as={MaterialCommunityIcons} name="sticker-emoji" size={'lg'} />
                    </TouchableOpacity>
                )}
            </View>
            <View className="flex flex-row gap-x-4">
                {textMessage && (
                    <TouchableOpacity
                        onPress={() => {
                            // Reset input
                            setTextMessage('');
                            setInputHeight({ height: DEFAULT_INPUT_HEIGHT, isMultiline: false });
                            handleClickSendMessage({
                                messageType: 'text',
                                content: textMessage,
                                roomId: roomId!,
                                senderId: currentUser!.userId,
                            });
                        }}
                        activeOpacity={0.6}
                    >
                        <Icon as={Feather} name="send" size={'lg'} />
                    </TouchableOpacity>
                )}
                {!textMessage && (
                    <TouchableOpacity activeOpacity={0.6}>
                        <Icon as={Feather} name="mic" size={'lg'} />
                    </TouchableOpacity>
                )}
            </View>
        </ThemedView>
    );
};

export default memo(MessageBottomTab);
