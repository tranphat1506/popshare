import React, { useRef, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from '../ThemedText';
import { ICloudMessageRoom, IGroupMessageRoom, IP2PMessageRoom } from '@/components/Messages/MessageBox';
import { RoomTypeTypes } from '@/redux/chatRoom/room.interface';
import PopshareAvatar from '../common/PopshareAvatar';
import { EmojiKey } from '../common/EmojiPicker';
import { StringOnlineStateHelper } from '@/helpers/string';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { ThemedView } from '../ThemedView';
import MessageBottomTab from './MessageBottomTab';
import MessageChatList from './MessageChatList';
const { width, height } = Dimensions.get('window');
export interface MessageChatBoxProps {
    room: IP2PMessageRoom | ICloudMessageRoom | IGroupMessageRoom;
    roomType: RoomTypeTypes;
}

const MessageChatBox: React.FC<
    MessageChatBoxProps & {
        handleExit?: () => void;
    }
> = ({ room, roomType, handleExit }) => {
    const messageChatRef = useRef<ScrollView | null>(null);
    const handleScrollToLastMessage = () => {
        messageChatRef.current?.scrollToEnd({ animated: true });
    };
    const [displayScrollToEnd, setDisplayScrollToEnd] = useState<boolean>(false);
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;
        const distanceToEnd = contentHeight - contentOffsetY - layoutHeight;
        console.log(distanceToEnd);

        if (distanceToEnd >= 50) {
            setDisplayScrollToEnd(true);
        } else {
            setDisplayScrollToEnd(false);
        }
    };
    return (
        <>
            <KeyboardAvoidingView style={{ flex: 1, width: '100%', height: '100%' }}>
                <ImageBackground
                    style={{
                        width: width,
                        height: height,
                        position: 'absolute',
                        zIndex: 1,
                    }}
                    source={require('@/assets/chat_background/chatBackground002.jpg')}
                    resizeMode="cover"
                ></ImageBackground>
                <View
                    style={{
                        flex: 1,
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        zIndex: 2,
                    }}
                >
                    {/* Header */}
                    <ThemedView style={{ height: 60 }} className="flex flex-row items-center justify-between px-4">
                        <View className="flex flex-row items-center justify-between" style={{ columnGap: 20 }}>
                            <TouchableOpacity onPress={handleExit}>
                                <Icon as={Ionicons} name="arrow-back" size={'lg'} color={BLUE_MAIN_COLOR} />
                            </TouchableOpacity>
                        </View>
                        {/* Middle container */}
                        <View
                            className="flex flex-col items-center justify-center basis-[55%]"
                            style={{ columnGap: 10, minWidth: 150 }}
                        >
                            {/* Display name container */}
                            <ThemedText
                                numberOfLines={1}
                                style={{
                                    fontFamily: 'System-Black',
                                    fontSize: 17,
                                    lineHeight: 19,
                                }}
                            >
                                {/* For p2p room. Display nickname of member or realname of user */}
                                {(roomType === 'p2p' && (room as IP2PMessageRoom).member.displayName) ||
                                    (room as IP2PMessageRoom).user.displayName}
                                {roomType === 'cloud' && (room as ICloudMessageRoom).user.displayName}
                                {roomType === 'group' && (room as IGroupMessageRoom).room.detail.roomName}
                            </ThemedText>
                            {roomType === 'p2p' && (
                                <ThemedText
                                    lightColor="#777"
                                    darkColor="#999"
                                    numberOfLines={1}
                                    style={{
                                        fontFamily: 'System-Medium',
                                        fontSize: 13,
                                        lineHeight: 16,
                                    }}
                                >
                                    {(room as IP2PMessageRoom).user.onlineState
                                        ? StringOnlineStateHelper.toLastOnlineTime(
                                              (room as IP2PMessageRoom).user.onlineState!.lastTimeActive,
                                          )
                                        : 'Offline'}
                                </ThemedText>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => {}}>
                            {/* Avatar */}
                            <View>
                                {roomType === 'p2p' && (
                                    <PopshareAvatar
                                        size={42}
                                        profilePicture={(room as IP2PMessageRoom).user.profilePicture}
                                        avatarColor={(room as IP2PMessageRoom).user.avatarColor}
                                        avatarEmoji={(room as IP2PMessageRoom).user.avatarEmoji as EmojiKey}
                                        displayOnlineState={true}
                                        onlineState={(room as IP2PMessageRoom).user.onlineState}
                                    />
                                )}
                                {roomType === 'cloud' && (
                                    <PopshareAvatar
                                        size={42}
                                        profilePicture={(room as ICloudMessageRoom).user.profilePicture}
                                        avatarColor={(room as ICloudMessageRoom).user.avatarColor}
                                        avatarEmoji={(room as ICloudMessageRoom).user.avatarEmoji as EmojiKey}
                                    />
                                )}
                                {roomType === 'group' && (
                                    <PopshareAvatar
                                        size={42}
                                        profilePicture={(room as IGroupMessageRoom).room.detail.roomAvatar}
                                        avatarColor={(room as IGroupMessageRoom).avatarColor}
                                    >
                                        <ThemedText
                                            style={{
                                                color: (room as IGroupMessageRoom).suffixNameColor,
                                                fontSize: 14,
                                                lineHeight: 16,
                                            }}
                                        >
                                            {(room as IGroupMessageRoom).suffixRoomName}
                                        </ThemedText>
                                    </PopshareAvatar>
                                )}
                            </View>
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedView
                        lightColor="#ffffff00"
                        darkColor="#00000030"
                        style={{ flex: 2, paddingHorizontal: 5, paddingVertical: 10 }}
                    >
                        <ScrollView
                            ref={messageChatRef}
                            onLayout={handleScrollToLastMessage}
                            onContentSizeChange={handleScrollToLastMessage}
                            onScroll={handleScroll}
                        >
                            <MessageChatList room={room.room} />
                        </ScrollView>
                    </ThemedView>
                    {displayScrollToEnd && (
                        <View
                            style={{
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: '#000',
                                position: 'absolute',
                            }}
                        >
                            <TouchableOpacity onPress={handleScrollToLastMessage}>
                                <ThemedView style={{ borderRadius: 999, padding: 5, backgroundColor: BLUE_MAIN_COLOR }}>
                                    <Icon as={AntDesign} name="caretdown" size={'md'} color={'white'} />
                                </ThemedView>
                            </TouchableOpacity>
                        </View>
                    )}
                    <MessageBottomTab />
                </View>
            </KeyboardAvoidingView>
        </>
    );
};

export default MessageChatBox;
