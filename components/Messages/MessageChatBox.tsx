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
import { BLUE_ICON_COLOR, BLUE_MAIN_COLOR } from '@/constants/Colors';
import { ThemedView } from '../ThemedView';
import MessageBottomTab from './MessageBottomTab';
import MessageChatList from './MessageChatList';
import ButtonScrollToEnd from './ButtonScrollToEnd';
const { width, height } = Dimensions.get('window');
export interface MessageChatBoxProps {
    room: IP2PMessageRoom | ICloudMessageRoom | IGroupMessageRoom;
    roomType: RoomTypeTypes;
}

const MessageChatBox: React.FC<
    MessageChatBoxProps & {
        handleExit: () => void;
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
        if (distanceToEnd >= 20) {
            setDisplayScrollToEnd(true);
        } else {
            setDisplayScrollToEnd(false);
        }
    };
    return (
        <>
            <ThemedView style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
                <ImageBackground
                    style={{
                        width: width,
                        height: '100%',
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
                    <ThemedView style={{ height: 50 }} className="flex flex-row items-center justify-between px-4">
                        <View className="flex flex-row items-center justify-between" style={{ columnGap: 20 }}>
                            <TouchableOpacity onPress={handleExit}>
                                <Icon as={Ionicons} name="arrow-back" size={'lg'} color={BLUE_MAIN_COLOR} />
                            </TouchableOpacity>
                        </View>
                        {/* Middle container */}
                        <View
                            className="flex flex-col items-center justify-center basis-[55%]"
                            style={{ minWidth: 150 }}
                        >
                            {/* Display name container */}
                            <ThemedText
                                numberOfLines={1}
                                style={{
                                    fontFamily: 'System-Bold',
                                    fontSize: 14,
                                }}
                            >
                                {/* For p2p room. Display nickname of member or realname of user */}
                                {(roomType === 'p2p' && (room as IP2PMessageRoom).member.displayName) ||
                                    (room as IP2PMessageRoom).user.displayName}
                                {roomType === 'cloud' && (room as ICloudMessageRoom).currentUser.displayName}
                                {roomType === 'group' && (room as IGroupMessageRoom).room.detail.roomName}
                            </ThemedText>
                            {roomType === 'p2p' && (
                                <ThemedText
                                    lightColor="#777"
                                    darkColor="#999"
                                    numberOfLines={1}
                                    style={{
                                        fontFamily: 'System-Medium',
                                        fontSize: 11,
                                        lineHeight: 14,
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
                                        size={30}
                                        profilePicture={(room as IP2PMessageRoom).user.profilePicture}
                                        avatarColor={(room as IP2PMessageRoom).user.avatarColor}
                                        avatarEmoji={(room as IP2PMessageRoom).user.avatarEmoji as EmojiKey}
                                    />
                                )}
                                {roomType === 'cloud' && (
                                    <PopshareAvatar
                                        size={30}
                                        profilePicture={(room as ICloudMessageRoom).currentUser.profilePicture}
                                        avatarColor={(room as ICloudMessageRoom).currentUser.avatarColor}
                                        avatarEmoji={(room as ICloudMessageRoom).currentUser.avatarEmoji as EmojiKey}
                                    />
                                )}
                                {roomType === 'group' && (
                                    <PopshareAvatar
                                        size={30}
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
                    {displayScrollToEnd && <ButtonScrollToEnd handleClick={handleScrollToLastMessage} />}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // height of bottom tab
                    >
                        <MessageBottomTab currentUser={room.currentUser} roomId={room.room.detail._id} />
                    </KeyboardAvoidingView>
                </View>
            </ThemedView>
        </>
    );
};

export default MessageChatBox;
