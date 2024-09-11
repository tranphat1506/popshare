import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from '../ThemedText';
import { ICloudMessageRoom, IGroupMessageRoom, IP2PMessageRoom } from '@/components/Messages/MessageBox';
import { RoomTypeTypes } from '@/redux/chatRoom/room.interface';
import PopshareAvatar from '../common/PopshareAvatar';
import { EmojiKey } from '../common/EmojiPicker';
import { StringOnlineStateHelper } from '@/helpers/string';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';

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
        <DefaultLayout>
            {/* Header */}
            <View className="flex flex-row items-center justify-between px-4 h-14">
                <View className="flex flex-row items-center justify-between" style={{ columnGap: 20 }}>
                    <TouchableOpacity onPress={handleExit}>
                        <Icon as={Ionicons} name="arrow-back" size={'lg'} className="text-black dark:text-white" />
                    </TouchableOpacity>
                </View>
                {/* Middle container */}
                {/* Display name container */}
                <View
                    className="flex flex-row  items-center justify-center basis-[55%]"
                    style={{ columnGap: 10, minWidth: 150 }}
                >
                    <ThemedText
                        numberOfLines={1}
                        style={{
                            fontFamily: 'System-Medium',
                            fontSize: 16,
                            lineHeight: 18,
                        }}
                    >
                        {/* For p2p room. Display nickname of member or realname of user */}
                        {(roomType === 'p2p' && (room as IP2PMessageRoom).member.displayName) ||
                            (room as IP2PMessageRoom).user.displayName}
                        {roomType === 'cloud' && (room as ICloudMessageRoom).user.displayName}
                        {roomType === 'group' && (room as IGroupMessageRoom).room.detail.roomName}
                    </ThemedText>
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
            </View>
        </DefaultLayout>
    );
};

export default MessageChatBox;
