import PopshareAvatar from '@/components/common/PopshareAvatar';
import { ThemedText } from '@/components/ThemedText';
import { ISessionToken } from '@/storage/loginSession.storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface UserSessionItemProps {
    item: ISessionToken;
    handleRefreshToken: (session: ISessionToken) => void;
}
const UserSessionItem: React.FC<UserSessionItemProps> = ({ item, handleRefreshToken }) => {
    return (
        <TouchableOpacity
            onPress={() => handleRefreshToken(item)}
            activeOpacity={0.5}
            className="border border-gray-400 rounded-xl dark:bg-black dark:border-white"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 16,
                flexDirection: 'row',
                columnGap: 10,
                maxWidth: 350,
            }}
        >
            <PopshareAvatar
                size={60}
                avatarColor={item.avatarColor}
                avatarEmoji={item.avatarEmoji as any}
                profilePicture={item.profilePicture}
            />
            <View style={{ height: '100%' }}>
                <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{ fontSize: 16, lineHeight: 20, marginTop: 5, width: 210 }}
                >
                    {item.displayName}
                </ThemedText>
                <ThemedText
                    lightColor="#00000090"
                    darkColor="#ffffff90"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{ fontSize: 14, lineHeight: 14, marginTop: 3, width: 150 }}
                >
                    @{item.username}
                </ThemedText>
            </View>
            <View>
                <TouchableOpacity>
                    <Icon className="text-black dark:text-white" name="navigate-next" as={MaterialIcons} size={'lg'} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default UserSessionItem;
