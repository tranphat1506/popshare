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
const MessageChatBox: React.FC<MessageChatBoxProps> = ({ room, roomType }) => {
    useCustomScreenOptions({
        headerShown: false,
    });
    return (
        <DefaultLayout>
            {/* Header */}
            <View className="flex flex-row items-center justify-between px-4 h-14 border-b border-[#0000005a] dark:border-[#222]">
                <View className="flex flex-row items-center justify-between" style={{ columnGap: 20 }}>
                    <TouchableOpacity onPress={() => {}}>
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
                    </ThemedText>
                </View>
                <TouchableOpacity onPress={() => {}}>
                    {/* Avatar */}
                    <View>
                        {roomType === 'p2p' && (
                            <PopshareAvatar
                                size={35}
                                profilePicture={(room as IP2PMessageRoom).user.profilePicture}
                                avatarColor={(room as IP2PMessageRoom).user.avatarColor}
                                avatarEmoji={(room as IP2PMessageRoom).user.avatarEmoji as EmojiKey}
                                displayOnlineState={true}
                                onlineState={(room as IP2PMessageRoom).user.onlineState}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </DefaultLayout>
    );
};

export default MessageChatBox;
