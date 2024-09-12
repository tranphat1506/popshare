import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import { ImageBackground, ScrollView, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from '../ThemedText';
import { ICloudMessageRoom, IGroupMessageRoom, IP2PMessageRoom } from '@/components/Messages/MessageBox';
import { RoomTypeTypes } from '@/redux/chatRoom/room.interface';
import PopshareAvatar from '../common/PopshareAvatar';
import { EmojiKey } from '../common/EmojiPicker';
import { StringOnlineStateHelper } from '@/helpers/string';
import { Feather, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { ThemedView } from '../ThemedView';
import MessageBottomTab from './MessageBottomTab';
import MessageChatBoxLayout from '../layout/MessageLayout';
import MessageChatList from './MessageChatList';

export interface MessageChatBoxProps {
    room: IP2PMessageRoom | ICloudMessageRoom | IGroupMessageRoom;
    roomType: RoomTypeTypes;
}

const MessageChatBox: React.FC<
    MessageChatBoxProps & {
        handleExit?: () => void;
    }
> = ({ room, roomType, handleExit }) => {
    return (
        <ImageBackground
            source={require('@/assets/chat_background/chatBackground002.jpg')}
            resizeMode="cover"
            style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <View style={{ flex: 1 }}>
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
                    <MessageChatList room={room.room} />
                </ThemedView>
            </View>
            <MessageBottomTab />
        </ImageBackground>
    );
};

export default MessageChatBox;
