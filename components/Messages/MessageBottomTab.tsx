import React, { useCallback, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputContentSizeChangeEventData, View } from 'react-native';
import { ThemedView } from '../ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'native-base';
import { Feather, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { sendTextMessage } from '@/helpers/fetching';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { updateTempMessageWithTempId, updateTheNewestMessage } from '@/redux/chatRoom/reducer';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
import _ from 'lodash';
import { useEmitOnTyping } from '@/hooks/socket.io/useOnActionOnChatRoom';

const DEFAULT_INPUT_HEIGHT = 30;
const DEFAULT_TEXT_HEIGHT = 20;
const MAX_LINES_INPUT_TEXT = 6;
interface MessageBottomTabProps {
    currentUser?: ICurrentUserDetail;
    roomId?: string;
}
const handleShowTempMessage = (
    currentUser: ICurrentUserDetail,
    roomId: string,
    message: string,
    repliedTo?: string,
) => {
    const tempId = `temp::${Date.now()}::${Math.random()}`;
    return {
        action: updateTheNewestMessage({
            message: {
                _id: tempId,
                roomId: roomId,
                senderId: currentUser.userId,
                messageType: 'text',
                content: message,
                mediaUrl: undefined,
                reactions: [],
                seenBy: [currentUser.userId],
                repliedTo: repliedTo,
                createdAt: Date.now(),
                isEveryoneRecalled: false,
                isSelfRecalled: false,
                isTemp: true,
            },
            currentUserId: currentUser.userId,
        }),
        tempId: tempId,
    };
};
const handleSendTextMessage = async (roomId: string, message: string, tempId: string, socketId?: string) => {
    const session = await LoginSessionManager.getCurrentSession();
    if (!session) return;
    const trimMessage = message.trim();
    if (trimMessage === '') return;
    const reponse = await sendTextMessage(
        { token: session.token, rtoken: session.rtoken },
        {
            messageType: 'text',
            content: trimMessage,
            roomId: roomId,
        },
        socketId,
    );
    if (!reponse) {
        // logic when sending message failed
        return;
    }
    return updateTempMessageWithTempId({
        roomId: roomId,
        replaceMessage: reponse.newMessage,
        tempId: tempId,
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
    const socketId = useAppSelector((state) => state.socket.socketId);
    const [message, setMessage] = useState<string>('');
    const [inputHeight, setInputHeight] = useState<{
        height: number;
        isMultiline: boolean;
    }>({ height: DEFAULT_INPUT_HEIGHT, isMultiline: false });
    const handleChangeMessage = (text: string) => {
        setMessage(text);
    };
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
    const handleClickSendMessage = _.debounce(
        async () => {
            if (!currentUser || !roomId) return;
            // Reset input
            setMessage('');
            setInputHeight({ height: DEFAULT_INPUT_HEIGHT, isMultiline: false });
            const { action, tempId } = handleShowTempMessage(currentUser, roomId, message, undefined);
            dispatch(action);
            const sendAction = await handleSendTextMessage(roomId, message, tempId, socketId);
            if (sendAction) dispatch(sendAction);
        },
        100,
        {
            leading: true,
            trailing: false,
        },
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
                    value={message}
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
                {!message && (
                    <TouchableOpacity activeOpacity={0.6} style={{ padding: 2 }}>
                        <Icon as={MaterialCommunityIcons} name="sticker-circle-outline" size={'lg'} />
                    </TouchableOpacity>
                )}
                {message && (
                    <TouchableOpacity activeOpacity={0.6} style={{ padding: 2 }}>
                        <Icon as={MaterialCommunityIcons} name="sticker-emoji" size={'lg'} />
                    </TouchableOpacity>
                )}
            </View>
            <View className="flex flex-row gap-x-4">
                {message && (
                    <TouchableOpacity onPress={handleClickSendMessage} activeOpacity={0.6}>
                        <Icon as={Feather} name="send" size={'lg'} />
                    </TouchableOpacity>
                )}
                {!message && (
                    <TouchableOpacity activeOpacity={0.6}>
                        <Icon as={Feather} name="mic" size={'lg'} />
                    </TouchableOpacity>
                )}
            </View>
        </ThemedView>
    );
};

export default MessageBottomTab;
